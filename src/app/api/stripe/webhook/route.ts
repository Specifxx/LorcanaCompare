// Subscription state → User.tier / premiumUntil. Idempotent on event id.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyStripeSignature } from "@/lib/stripe";

export const dynamic = "force-dynamic";

interface Sub { id: string; customer: string; status: string; current_period_end?: number; items?: { data: { current_period_end?: number }[] }; metadata?: { userId?: string; tier?: string } }

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  if (!secret || !verifyStripeSignature(body, req.headers.get("stripe-signature"), secret)) return NextResponse.json({ error: "bad signature" }, { status: 400 });
  const ev = JSON.parse(body) as { id: string; type: string; data: { object: Record<string, unknown> } };
  const seen = await prisma.stripeEvent.findUnique({ where: { id: ev.id }, select: { id: true } });
  if (seen) return NextResponse.json({ ok: true, duplicate: true });

  if (ev.type.startsWith("customer.subscription.")) {
    const s = ev.data.object as unknown as Sub;
    const end = s.current_period_end ?? s.items?.data?.[0]?.current_period_end;
    const active = ["active", "trialing", "past_due"].includes(s.status);
    const tier = s.metadata?.tier === "plus" ? "plus" : "premium";
    const where = s.metadata?.userId ? { id: s.metadata.userId } : { stripeCustomerId: s.customer };
    await prisma.user.updateMany({
      where,
      data: active
        ? { tier, stripeSubId: s.id, stripeCustomerId: s.customer, premiumUntil: end ? new Date(end * 1000 + 3 * 86_400_000) : null }
        : { tier: "free", premiumUntil: new Date() },
    });
  }
  await prisma.stripeEvent.create({ data: { id: ev.id, type: ev.type } });
  return NextResponse.json({ ok: true });
}
