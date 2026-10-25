// Google sign-in (the only sign-in method; owner, 2026-10-25), the same
// authorization-code flow as Rift Compare's lib/oauth.ts. The redirect URI
// registered in Google Cloud must be exactly redirectUri().
import { SITE_URL } from "./site";

export const GOOGLE = {
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userUrl: "https://openidconnect.googleapis.com/v1/userinfo",
  scope: "openid email profile",
};

export const googleConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const redirectUri = () => `${SITE_URL}/api/auth/google/callback`;
export const STATE_COOKIE = "oauth_state";

/** Only same-site paths survive the round trip (no open redirect). */
export function safeNext(next: string | null | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next.slice(0, 200) : "/account";
}
