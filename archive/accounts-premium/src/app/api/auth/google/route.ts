// Step 1: send the visitor to Google with a random state bound to a cookie.
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { GOOGLE, STATE_COOKIE, googleConfigured, redirectUri, safeNext } from "@/lib/oauth";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  if (!googleConfigured()) return NextResponse.redirect(new URL("/login?error=unavailable", req.url));
  const next = safeNext(new URL(req.url).searchParams.get("next"));
  const state = crypto.randomBytes(24).toString("hex");
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: GOOGLE.scope,
    state,
    prompt: "select_account",
  });
  const res = NextResponse.redirect(`${GOOGLE.authUrl}?${q}`);
  res.cookies.set(STATE_COOKIE, JSON.stringify({ state, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
