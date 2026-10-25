import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { lineItem, stripe, stripeConfigured, type Interval, type PaidTier } from "@/lib/stripe";
import { abs } from "@/lib/site";

export async function POST(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (!stripeConfigured()) return NextResponse.json({ error: "Payments are not switched on yet." }, { status: 503 });
  const { tier, interval } = (await req.json().catch(() => ({}))) as { tier?: PaidTier; interval?: Interval };
  if (tier !== "plus" && tier !== "premium") return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  const iv: Interval = interval === "yearly" ? "yearly" : "monthly";
  let customer = u.stripeCustomerId;
  if (!customer) {
    const c = await stripe<{ id: string }>("customers", { email: u.email, metadata: { userId: u.id } });
    customer = c.id;
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: customer }, select: { id: true } });
  }
  const session = await stripe<{ url: string }>("checkout/sessions", {
    mode: "subscription",
    customer,
    client_reference_id: u.id,
    "line_items[0]": lineItem(tier, iv),
    allow_promotion_codes: "true",
    success_url: abs("/account?upgraded=1"),
    cancel_url: abs("/premium"),
    subscription_data: { metadata: { userId: u.id, tier } },
    metadata: { userId: u.id, tier },
  });
  return NextResponse.json({ url: session.url });
}
