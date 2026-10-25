import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma, dbConfigured } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { ipOf, limited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "Accounts are not switched on yet." }, { status: 503 });
  if (limited(`login:${ipOf(req)}`, 20, 900_000)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const u = await prisma.user.findUnique({ where: { email: String(email ?? "").trim().toLowerCase() }, select: { id: true, passwordHash: true } });
  if (!u || !(await bcrypt.compare(String(password ?? ""), u.passwordHash))) return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  await prisma.user.update({ where: { id: u.id }, data: { lastSeenAt: new Date() }, select: { id: true } });
  await createSession(u.id);
  return NextResponse.json({ ok: true });
}
