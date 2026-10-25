import { NextResponse } from "next/server";
import { prisma, dbConfigured } from "@/lib/db";
import { notifyOwnerBounded } from "@/lib/email";
import { ipOf, limited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (limited(`nl:${ipOf(req)}`, 5, 3_600_000)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const e = String(email ?? "").trim().toLowerCase().slice(0, 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (!dbConfigured()) return NextResponse.json({ error: "Not available yet." }, { status: 503 });
  await prisma.newsletterSubscriber.upsert({ where: { email: e }, create: { email: e }, update: {}, select: { id: true } });
  await notifyOwnerBounded("New newsletter signup", e);
  return NextResponse.json({ ok: true });
}
