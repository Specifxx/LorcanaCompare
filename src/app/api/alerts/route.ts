import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productById } from "@/lib/data";
import { LIMITS } from "@/lib/premium";

export async function POST(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { productId, targetCents } = (await req.json().catch(() => ({}))) as { productId?: number; targetCents?: number };
  if (!productId || !productById(productId)) return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  if (!targetCents || targetCents < 1 || targetCents > 10_000_000) return NextResponse.json({ error: "Enter a target price." }, { status: 400 });
  const count = await prisma.priceAlert.count({ where: { userId: u.id } });
  const existing = await prisma.priceAlert.findUnique({ where: { userId_productId: { userId: u.id, productId } }, select: { id: true } });
  if (!existing && count >= LIMITS[u.tier].alerts)
    return NextResponse.json({ error: `Your plan includes ${LIMITS[u.tier].alerts} alert${LIMITS[u.tier].alerts === 1 ? "" : "s"}. Upgrade for more.` }, { status: 402 });
  await prisma.priceAlert.upsert({
    where: { userId_productId: { userId: u.id, productId } },
    create: { userId: u.id, productId, targetCents },
    update: { targetCents, lastSentAt: null },
    select: { id: true },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  await prisma.priceAlert.deleteMany({ where: { id, userId: u.id } });
  return NextResponse.json({ ok: true });
}
