# Claude in Chrome setup prompt: Lorcana Compare + Gundam Compare

Paste everything in the box below into Claude in Chrome. It sets up **both**
sites in one session. The same file is in both repos.

The eBay keys are deliberately not in this repo (it is public). Where the prompt
says `<EBAY APP ID>` / `<EBAY CERT ID>`, use the copy with the keys filled in
from the Claude Code chat, or let Claude in Chrome copy them from the eBay
developer page (step 4 tells it how).

---

```text
You are helping me launch two websites:
  • Lorcana Compare: GitHub repo Specifxx/LorcanaCompare, domain lorcanacompare.com
  • Gundam Compare: GitHub repo Specifxx/GundamCompare, domain gundamcompare.com
Both domains were just bought in my Vercel account, so their DNS is managed by Vercel.
They are Next.js sites that copy riftcompare.com's setup.

Ground rules:
- I am signed in to GitHub, Vercel, Neon, eBay Developers, eBay Partner Network, Impact
  (TCGplayer affiliate), Google Search Console, Bing Webmaster Tools, Google AdSense and Resend.
  If a site asks me to log in, treat it as a blocker (below): leave the tab open and move on.
- Never buy anything or enter payment details. Never delete existing projects, keys, domains
  or sites. Don't change anything belonging to riftcompare.com or the TCGEmpire repo.
- Secrets go ONLY into the secret / environment-variable fields named below.
- For random values, run crypto.randomUUID().replaceAll("-","") in the browser console
  (32 hex characters; join two of them for 64).
- NEVER STOP ON A BLOCKER. If any step needs me (a login, a 2FA code, a CAPTCHA, a plan
  upgrade, an approval, a page that won't load, or anything you're unsure about), leave that
  tab OPEN exactly where you got stuck, note it, and move straight on to the next step. Later
  steps that depend on a skipped one: do whatever parts you still can, and note the rest.
  Don't close tabs you got stuck on.
- Keep a checklist as you go. At the very end, give me:
    1. DONE: every step completed.
    2. NEEDS YOU: every step you got stuck on, in order, each with the open tab's name and
       exactly what I need to do there (and any value I must paste, e.g. which secret).
    3. Then switch to the first "needs you" tab, so I can work through them one by one.

=== 1. Merge the code (GitHub) ===
For each repo:
a) Open a pull request from branch `claude/hopeful-bardeen-d4cuq3` into `main` and merge it. If
   the repo has no `main` yet, rename `claude/hopeful-bardeen-d4cuq3` to `main` in
   Settings → Branches and make it the default branch.
b) Settings → Actions → General → Workflow permissions: "Read and write permissions" → Save.

=== 2. Databases (console.neon.tech) ===
Create two free projects: "lorcana-compare" and "gundam-compare" (AWS us-east-1). For each,
copy the POOLED connection string (Connect → Pooled connection). That is the site's DATABASE_URL.

=== 3. Vercel projects + domains (vercel.com) ===
For each repo: Add New → Project → Import it. Framework: Next.js, default settings.
Environment Variables (Production AND Preview), per project:
  DATABASE_URL                  = that site's Neon pooled string
  AUTH_SECRET                   = new random 64-character string (different per site)
  NEXT_PUBLIC_SITE_URL          = https://lorcanacompare.com   (Gundam project: https://gundamcompare.com)
  EBAY_VERIFICATION_TOKEN       = new random 64-character string (the same value goes to eBay in step 4)
  EBAY_AFFILIATE_CAMPAIGN       = 5339155912
  TCGPLAYER_IMPACT_LINK         = https://partner.tcgplayer.com/c/7385758/1780961/21018
  NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-6842128782879909
  INDEXNOW_KEY                  = new random 32-character hex string (different per site; reused in step 5)
Settings → Git → Production Branch = main.
Settings → Domains (the domains are already in this Vercel account):
  • Lorcana project: add `lorcanacompare.com`, then add `www.lorcanacompare.com` and set it to
    "Redirect to lorcanacompare.com" (308).
  • Gundam project: add `gundamcompare.com`, then `www.gundamcompare.com` → redirect to the apex.
  Both should show "Valid Configuration" within a minute or two (Vercel DNS).
Deploy: the repo only builds commits whose subject contains "[deploy]". If the first deployment
shows "Build skipped" (or none appears), go to the GitHub repo → Actions → "Production deploy" →
Run workflow. That lands a [deploy] commit and Vercel builds it.
Check that https://lorcanacompare.com and https://gundamcompare.com load.
Web Analytics, for each project: open the project → "Analytics" tab → Enable Web Analytics
(the sites already include the Vercel Analytics script). Then redeploy (Deployments → latest →
⋯ → Redeploy), because analytics only starts on a deployment made after enabling it. The sites send
a custom event "buy_click" on every buy button, with properties retailer, retailer_key, market,
product, page and host. Custom events need the Vercel Pro plan. If the team is on Hobby, tell me
rather than upgrading (every click is also logged in each site's /admin dashboard either way).

=== 4. eBay developer keys + Marketplace Account Deletion (developer.ebay.com) ===
Go to your name (top right) → Application Keysets → the "BillYang-API3" app → Production.
a) Marketplace Account Deletion. eBay keeps a production keyset disabled until this is done.
   Open "Alerts & Notifications" (the link next to the Production keyset, or
   https://developer.ebay.com/my/push/?env=production&index=0) and choose
   "Marketplace Account Deletion":
     Email to notify if endpoint is down: bill.jyang101@gmail.com
     Notification endpoint URL:            https://lorcanacompare.com/api/ebay/account-deletion
     Verification token:                   the EBAY_VERIFICATION_TOKEN on the LORCANA Vercel project
   Save. eBay sends a challenge to the endpoint, and the site answers it automatically.
   Wait for "endpoint verified", then press "Send Test Notification" and confirm it succeeds.
   One endpoint covers the shared app; the Lorcana site handles it for both sites.
   If verification fails: confirm the Lorcana deployment includes the variable (redeploy after
   adding it), and that
   https://lorcanacompare.com/api/ebay/account-deletion?challenge_code=test returns JSON with
   "challengeResponse". As a last resort, switch on the exemption on that page ("I do not
   persist eBay data"), reason: the site stores no eBay user data.
b) Back on Application Keysets, confirm the Production keyset is now ENABLED, then copy the
   exact App ID (Client ID) and Cert ID (Client Secret) with the copy buttons. They should be:
     App ID:  <EBAY APP ID>
     Cert ID: <EBAY CERT ID>
   If the page's Cert ID differs, use the page's value (an earlier attempt was rejected as
   invalid_client).

=== 5. GitHub secrets & variables (BOTH repos) ===
Settings → Secrets and variables → Actions → New repository secret:
  EBAY_CLIENT_ID          = App ID from step 4
  EBAY_CLIENT_SECRET      = Cert ID from step 4
  EBAY_AFFILIATE_CAMPAIGN = 5339155912   (or that site's campaign from step 8)
  DATABASE_URL            = that site's Neon pooled string
  INDEXNOW_KEY            = the same value as that site's Vercel INDEXNOW_KEY
  RESEND_API_KEY          = from step 7 (come back to it)
  EMAIL_FROM              = Lorcana Compare <alerts@lorcanacompare.com>   /   Gundam Compare <alerts@gundamcompare.com>
Variables tab → New repository variable:
  SITE_URL = https://lorcanacompare.com   (Gundam repo: https://gundamcompare.com)

=== 6. Stripe: SKIP FOR NOW ===
Paid plans are "coming soon" on both sites (the first 50 accounts on each get Premium free),
so do nothing in Stripe. Leave STRIPE_* unset everywhere. (When I'm ready to charge, the steps
are in docs/SETUP.md, "Turning payments on".)

=== 6b. Google sign-in (the only sign-in method) ===
Google Cloud console → new project "Compare Sites Auth" → Google Auth Platform: External, app name
"Lorcana Compare", support email riftcompare@gmail.com (or bill.jyang101@gmail.com), authorised
domains lorcanacompare.com and gundamcompare.com, scopes openid / email / profile only →
Publish app (In production). Clients → Create client → Web application, one per site:
  Lorcana: origin https://lorcanacompare.com, redirect URI https://lorcanacompare.com/api/auth/google/callback
  Gundam:  origin https://gundamcompare.com,  redirect URI https://gundamcompare.com/api/auth/google/callback
Put each client's ID and secret into that Vercel project as GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET,
then redeploy. (The full version is docs/GOOGLE-OAUTH-PROMPT.md.)

=== 7. Email (resend.com) ===
Domains → Add domain: lorcanacompare.com, then gundamcompare.com. Add the DNS records Resend shows
in Vercel → Domains (account level) → the domain → DNS Records → Add, then press Verify in Resend.
API Keys → create one "Sending access" key → RESEND_API_KEY in both Vercel projects and both
GitHub repos. Set EMAIL_FROM in both Vercel projects as in step 5.

=== 8. Affiliate programs ===
a) eBay Partner Network (partnernetwork.ebay.com): add lorcanacompare.com and gundamcompare.com
   as websites/traffic sources. Campaigns → create "Lorcana Compare" and "Gundam Compare", and put
   each Campaign ID into that site's EBAY_AFFILIATE_CAMPAIGN (Vercel and GitHub).
b) Impact (app.impact.com), TCGplayer program: Settings → Properties → add both sites (Website,
   category Hobbies & Collectibles, "trading card price comparison"). Create a tracking link to
   https://www.tcgplayer.com for each property. If it differs from
   https://partner.tcgplayer.com/c/7385758/1780961/21018, set it as that project's TCGPLAYER_IMPACT_LINK.
c) TCGplayer prices: nothing to do (they come from tcgcsv.com; no API key needed).
d) Amazon Associates (optional): add both sites to the website list. If you can create the
   tracking ids "lorcanacompare-20" and "gundamcompare-20", set AMAZON_ASSOCIATE_TAG in each project.
e) Amazon: until per-site tags exist, the sites use the existing tag riftcompare-20. Add
   both domains to that Associates account's website list so those clicks are allowed.
f) Redeploy both Vercel projects (Deployments → latest → ⋯ → Redeploy) so every variable applies.

=== 9. First data import ===
In each GitHub repo: Actions → "Refresh prices" → Run workflow ("Spend eBay calls" ticked).
It takes about 5–10 minutes. Check that it finished green and that the log shows
"[ebay] app remaining … budget …" and then "[ebay] refreshed …". If it shows
"eBay token: HTTP 401 invalid_client", step 4 isn't finished. The run commits fresh data
and Vercel deploys it.
Then Actions → "Ops monitor" → Run workflow, and report anything marked FAIL.

=== 10. Google Search Console (search.google.com/search-console) ===
For each domain:
a) Add property → "Domain" → lorcanacompare.com. Copy the TXT record and add it in Vercel →
   Domains → lorcanacompare.com → DNS Records (type TXT, name @). Back in Search Console → Verify.
b) Sitemaps → submit https://lorcanacompare.com/sitemap.xml
c) URL inspection → "Request indexing" for each of:
     https://lorcanacompare.com/
     https://lorcanacompare.com/cards
     https://lorcanacompare.com/sets
     https://lorcanacompare.com/preorders
     https://lorcanacompare.com/sets/hyperia-city
     https://lorcanacompare.com/blog/hyperia-city-card-list-prices
     https://lorcanacompare.com/blog/most-expensive-lorcana-cards
     https://lorcanacompare.com/blog/into-the-inkdark-release-date-collector-boosters
     https://lorcanacompare.com/blog/where-to-buy-lorcana-cards-cheapest
Repeat for gundamcompare.com (sitemap https://gundamcompare.com/sitemap.xml), requesting indexing for:
     https://gundamcompare.com/
     https://gundamcompare.com/cards
     https://gundamcompare.com/sets
     https://gundamcompare.com/preorders
     https://gundamcompare.com/sets/stardust-trails
     https://gundamcompare.com/blog/gd06-stardust-trails-card-list-prices
     https://gundamcompare.com/blog/most-expensive-gundam-card-game-cards
     https://gundamcompare.com/blog/gundam-card-game-ban-list
     https://gundamcompare.com/blog/gundam-card-game-rarities-explained

=== 11. Bing Webmaster Tools (bing.com/webmasters) ===
Add site → "Import from Google Search Console" → choose both sites (or verify with Bing's DNS
record, added in Vercel DNS). Submit both sitemaps. Under IndexNow, confirm Bing finds the key at
https://lorcanacompare.com/indexnow-key.txt and https://gundamcompare.com/indexnow-key.txt.

=== 12. Google AdSense (adsense.google.com) ===
Sites → Add site → lorcanacompare.com, then gundamcompare.com. The sites already serve /ads.txt and
the AdSense script. Request review. If AdSense is already approved, create a Display ad unit
"home-top" per site and set its slot id as NEXT_PUBLIC_ADSENSE_SLOT_HOME in that Vercel project
(optionally NEXT_PUBLIC_ADSENSE_SLOT_CARD and NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE too), then redeploy.

=== 13. Test as a user ===
On each site: open /login → "Continue with Google" → sign in as bill.jyang101@gmail.com. Confirm "Admin"
shows top-right and /admin loads. Open a card, click Buy on a store row and confirm it opens the
store. Check the store URL: an eBay link must contain "campid=", and a TCGplayer link must
start at partner.tcgplayer.com. Then Vercel → that project → Analytics → Events should show
"buy_click" within a few minutes (filter by retailer). That's the admin account, so /account shows the plan "premium" (admins don't take a
founding place). Any other Google account you try first will show "★ Founding member". Open /premium and
confirm it shows the founding-members offer and "Coming soon" on the paid plans.

Then give me the DONE / NEEDS YOU summary from the ground rules, also listing: Neon project names, which secrets and variables were set where, the eBay keyset status and account-deletion verification, the
EPN campaign ids, whether Web Analytics and the buy_click events are showing, Google/Bing/AdSense status, and anything that failed or needs me.
```
