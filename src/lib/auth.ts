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
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, tier: true, premiumUntil: true } });
  const isAdmin = isAdminEmail(u?.email);
  await writeCookie(userId, { email: u?.email ?? "", tier: effectiveTier(u ?? null, isAdmin), isAdmin });
}

// The cookie also carries a snapshot of the account (email, tier, admin) so
// /api/me — called on every page view by signed-in visitors — can answer
// without the database. The snapshot is re-read from Neon at most once a day
// (SNAPSHOT_MAX_AGE), and the Stripe webhook's changes reach it on that
// refresh. Pages that act on the account (/account, /admin, checkout) still
// read the database through getUser().
const SNAPSHOT_MAX_AGE = 24 * 3600;

export interface SessionSnapshot {
  email: string;
  tier: Tier;
  isAdmin: boolean;
}

async function writeCookie(userId: string, snap: SessionSnapshot) {
  const token = await new SignJWT({ sub: userId, snap })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  cookies().set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

/** For route handlers: the account snapshot from the cookie, refreshed from
 *  the database only when it is over a day old (and the cookie re-issued). */
export async function getSessionSnapshot(): Promise<SessionSnapshot | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const snap = payload.snap as SessionSnapshot | undefined;
    const age = Date.now() / 1000 - (payload.iat ?? 0);
    if (snap && age < SNAPSHOT_MAX_AGE) return snap;
    if (!payload.sub || !dbConfigured()) return snap ?? null;
    const u = await getUser();
    if (!u) return null;
    const fresh = { email: u.email, tier: u.tier, isAdmin: u.isAdmin };
    await writeCookie(u.id, fresh);
    return fresh;
  } catch {
    return null;
  }
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
