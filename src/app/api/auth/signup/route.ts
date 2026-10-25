import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma, dbConfigured } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { ipOf, limited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "Accounts are not switched on yet." }, { status: 503 });
  if (limited(`signup:${ipOf(req)}`, 5, 3_600_000)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const e = String(email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) || e.length > 200) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (!password || password.length < 8 || password.length > 200) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: e }, select: { id: true } });
  if (exists) return NextResponse.json({ error: "That email already has an account — sign in instead." }, { status: 409 });
  const u = await prisma.user.create({ data: { email: e, passwordHash: await bcrypt.hash(password, 10) }, select: { id: true } });
  await createSession(u.id);
  return NextResponse.json({ ok: true });
}
