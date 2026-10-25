# Claude in Chrome prompt: Google sign-in for both sites

Paste the box into Claude in Chrome. It is self-contained: run it on its own,
or after the main setup prompt (CHROME-SETUP-PROMPT.md, which includes the
same step).

```text
Set up "Sign in with Google" for two websites I own: Lorcana Compare (lorcanacompare.com, Vercel
project for GitHub repo Specifxx/LorcanaCompare) and Gundam Compare (gundamcompare.com, Vercel
project for Specifxx/GundamCompare). Google is the only way to sign in on both.

Rules: I'm signed in to Google Cloud and Vercel as bill.jyang101@gmail.com. Don't buy anything,
don't delete anything, and don't touch any other project's OAuth clients. If you get stuck on a
step (a login, 2FA, a page that won't load), leave that tab open, note it, and carry on. At the
end, list DONE and NEEDS YOU (with each open tab and exactly what I must do there).

1. Google Cloud console (console.cloud.google.com): create a new project "Compare Sites Auth",
   or reuse it if it already exists. Select it.
2. Google Auth Platform (APIs & Services → OAuth consent screen) → Get started:
     App name: Lorcana Compare      (one app is fine for both sites)
     User support email: riftcompare@gmail.com if it's offered, else bill.jyang101@gmail.com
     Audience: External
     Developer contact email: bill.jyang101@gmail.com
   Branding → App domain: home page https://lorcanacompare.com, privacy policy
   https://lorcanacompare.com/privacy, terms https://lorcanacompare.com/terms.
   Authorised domains: lorcanacompare.com and gundamcompare.com.
   Data access → scopes: only openid, .../auth/userinfo.email, .../auth/userinfo.profile
   (no sensitive scopes, so no Google review is needed).
   Audience → Publish app → "In production" (so anyone can sign in, not just test users).
3. Clients → Create client → Web application, twice:
   a) Name "Lorcana Compare web"
        Authorised JavaScript origins: https://lorcanacompare.com
        Authorised redirect URIs:      https://lorcanacompare.com/api/auth/google/callback
   b) Name "Gundam Compare web"
        Authorised JavaScript origins: https://gundamcompare.com
        Authorised redirect URIs:      https://gundamcompare.com/api/auth/google/callback
   Copy each client's Client ID and Client secret. Paste them only into Vercel (step 4).
4. Vercel → Lorcana project → Settings → Environment Variables (Production and Preview):
     GOOGLE_CLIENT_ID     = Lorcana client ID
     GOOGLE_CLIENT_SECRET = Lorcana client secret
   Then set the same two names in the Gundam project, using the Gundam client.
   Check each project's NEXT_PUBLIC_SITE_URL is exactly https://lorcanacompare.com /
   https://gundamcompare.com (the redirect URI is built from it), and that AUTH_SECRET and
   DATABASE_URL are set. If not, list that under NEEDS YOU.
5. Redeploy both projects (Deployments → latest → ⋯ → Redeploy).
6. Test on each site: open /login → "Continue with Google" → choose bill.jyang101@gmail.com → you
   should land on /account signed in, with "Admin" in the header. If Google shows
   "redirect_uri_mismatch", fix the redirect URI in step 3 so it matches the one in the error
   exactly, then try again.
```
