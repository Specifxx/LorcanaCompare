// Step 2: Google sends the visitor back with ?code&state. Check the state,
// swap the code for a token, read the verified email, find or create the
// account (the first 50 become founding members), and sign in.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma, dbConfigured } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { FOUNDING_LIMIT, FOUNDING_UNTIL } from "@/lib/premium";
import { notifyOwnerBounded } from "@/lib/email";
import { GOOGLE, STATE_COOKIE, googleConfigured, redirectUri, safeNext } from "@/lib/oauth";

export const dynamic = "force-dynamic";

function fail(req: Request, why: string) {
  console.warn(`[oauth] ${why}`);
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(why)}`, req.url));
}

export async function GET(req: Request) {
  if (!googleConfigured() || !dbConfigured()) return fail(req, "unavailable");
  const u = new URL(req.url);
  const code = u.searchParams.get("code");
  let saved: { state?: string; next?: string } = {};
  try {
    saved = JSON.parse(cookies().get(STATE_COOKIE)?.value ?? "{}");
  } catch {}
  cookies().delete(STATE_COOKIE);
  if (u.searchParams.get("error")) return fail(req, "cancelled");
  if (!code || !saved.state || saved.state !== u.searchParams.get("state")) return fail(req, "state");

  const tok = await fetch(GOOGLE.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(),
      grant_type: "authorization_code",
    }),
  });
  if (!tok.ok) return fail(req, "token");
  const { access_token } = (await tok.json()) as { access_token?: string };
  const info = await fetch(GOOGLE.userUrl, { headers: { Authorization: `Bearer ${access_token}` } });
  if (!info.ok) return fail(req, "profile");
  const p = (await info.json()) as { sub?: string; email?: string; email_verified?: boolean; name?: string };
  const email = p.email?.trim().toLowerCase();
  if (!p.sub || !email || !p.email_verified) return fail(req, "email");

  let user = await prisma.user.findFirst({ where: { OR: [{ googleId: p.sub }, { email }] }, select: { id: true, googleId: true } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date(), ...(user.googleId ? {} : { googleId: p.sub }) },
      select: { id: true },
    });
  } else {
    // First 50 non-admin accounts are founding members (Premium free).
    const founding = !isAdminEmail(email) && (await prisma.user.count({ where: { foundingMember: true } })) < FOUNDING_LIMIT;
    user = await prisma.user.create({
      data: {
        email,
        googleId: p.sub,
        name: p.name?.slice(0, 100) ?? null,
        lastSeenAt: new Date(),
        ...(founding ? { foundingMember: true, tier: "premium", premiumUntil: FOUNDING_UNTIL } : {}),
      },
      select: { id: true, googleId: true },
    });
    await notifyOwnerBounded(founding ? "New founding member" : "New account", email);
  }
  await createSession(user.id);
  return NextResponse.redirect(new URL(safeNext(saved.next), req.url));
}
