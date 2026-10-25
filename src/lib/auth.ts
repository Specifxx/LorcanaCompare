// Email + password accounts with a signed session cookie (jose HS256), the same
// shape as Rift Compare's lib/auth.ts.
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma, dbConfigured } from "./db";
import { isAdminEmail } from "./admin";
import { effectiveTier, type Tier } from "./premium";

const COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 60;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s || "dev-only-secret-change-me");
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  cookies().set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  tier: Tier;
  isAdmin: boolean;
  stripeCustomerId: string | null;
}

export async function getUser(): Promise<SessionUser | null> {
  if (!dbConfigured()) return null;
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const u = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, tier: true, premiumUntil: true, stripeCustomerId: true },
    });
    if (!u) return null;
    const isAdmin = isAdminEmail(u.email);
    return { id: u.id, email: u.email, name: u.name, tier: effectiveTier(u, isAdmin), isAdmin, stripeCustomerId: u.stripeCustomerId };
  } catch {
    return null;
  }
}
