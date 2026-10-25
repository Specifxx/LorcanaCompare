// Stripe over its REST API (no SDK, so no SDK/API-version drift). Prices come
// from STRIPE_PRICE_* when set; otherwise checkout creates the price inline
// from PLANS, so the site can take payments before any Stripe setup beyond the
// secret key and the webhook.
import crypto from "node:crypto";
import { SITE } from "@/site.config";
import { PLANS } from "./premium";

export type Interval = "monthly" | "yearly";
export type PaidTier = keyof typeof PLANS;

export const stripeConfigured = () => !!process.env.STRIPE_SECRET_KEY;

function encode(obj: Record<string, unknown>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") out.push(...encode(v as Record<string, unknown>, key));
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out;
}

export async function stripe<T = Record<string, unknown>>(path: string, params?: Record<string, unknown>, method = "POST"): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: method === "GET" ? undefined : encode(params ?? {}).join("&"),
  });
  const data = (await res.json()) as T & { error?: { message: string } };
  if (!res.ok) throw new Error(`Stripe ${path}: ${data.error?.message ?? res.status}`);
  return data;
}

export function lineItem(tier: PaidTier, interval: Interval): Record<string, unknown> {
  const env = process.env[`STRIPE_PRICE_${tier.toUpperCase()}_${interval.toUpperCase()}`];
  if (env) return { price: env, quantity: 1 };
  const plan = PLANS[tier];
  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: interval === "monthly" ? plan.monthly : plan.yearly,
      recurring: { interval: interval === "monthly" ? "month" : "year" },
      product_data: { name: `${SITE.name} ${plan.name}` },
    },
  };
}

/** Verifies a Stripe-Signature header (v1 scheme, 5-minute tolerance). */
export function verifyStripeSignature(payload: string, header: string | null, secret: string, now = Date.now()): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(now / 1000 - t) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const sigs = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}
