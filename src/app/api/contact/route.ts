import { NextResponse } from "next/server";
import { prisma, dbConfigured } from "@/lib/db";
import { notifyOwnerBounded } from "@/lib/email";
import { ipOf, limited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (limited(`contact:${ipOf(req)}`, 5, 3_600_000)) return NextResponse.json({ error: "Too many messages." }, { status: 429 });
  const { email, message, kind, website } = (await req.json().catch(() => ({}))) as Record<string, string>;
  if (website) return NextResponse.json({ ok: true }); // honeypot
  const e = String(email ?? "").trim().slice(0, 200);
  const m = String(message ?? "").trim().slice(0, 5000);
  if (!/^[^@\s]+@[^@\s]+$/.test(e) || m.length < 5) return NextResponse.json({ error: "Add your email and a message." }, { status: 400 });
  const k = ["store", "feedback"].includes(kind) ? kind : "contact";
  if (dbConfigured()) await prisma.contactMessage.create({ data: { email: e, message: m, kind: k }, select: { id: true } });
  await notifyOwnerBounded(`New ${k} message`, `From: ${e}\n\n${m}`);
  return NextResponse.json({ ok: true });
}
