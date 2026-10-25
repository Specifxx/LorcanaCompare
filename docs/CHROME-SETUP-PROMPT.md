# Claude in Chrome setup prompt — Lorcana Compare + Gundam Compare

Paste everything in the box below into Claude in Chrome. Do step 0 yourself first.
It covers **both** sites in one session. Each step says what to paste back to
Claude Code (or keep) afterwards. The identical file is in both repos.

**Step 0 (you): buy the domains.** The code assumes `lorcanacompare.app` and
`gundamcompare.app`, matching opcompare.app, dexcompare.app and mtgcompare.app.
If you buy different names, change `domain` in each repo's `src/site.config.ts`,
or just set `NEXT_PUBLIC_SITE_URL` in Vercel and the GitHub variable `SITE_URL`.
Buy them from Vercel (Domains → Buy) if you want DNS to set itself up.

---

```text
You are helping me launch two websites: Lorcana Compare (GitHub repo Specifxx/LorcanaCompare,
domain LORCANA_DOMAIN) and Gundam Compare (repo Specifxx/GundamCompare, domain GUNDAM_DOMAIN).
Replace LORCANA_DOMAIN / GUNDAM_DOMAIN below with: lorcanacompare.app and gundamcompare.app
(unless I tell you otherwise). They are Next.js sites that copy riftcompare.com's setup.

Ground rules:
- I am signed in to GitHub, Vercel, Neon, Stripe, eBay Developers, eBay Partner Network, Impact
  (TCGplayer affiliate), Google Search Console, Bing Webmaster Tools, Google AdSense and Resend.
  If a login is needed, stop and ask me.
- Never buy anything or enter payment details. Never delete existing projects, keys or sites.
  Don't change anything belonging to riftcompare.com or the TCGEmpire repo.
- Secrets go ONLY into the secret / environment-variable fields named below. Don't paste them
  anywhere else.
- Keep a checklist as you go and give me a summary at the end: what was done, what failed, and
  anything I must do myself.

=== 1. Merge the code (GitHub) ===
For each repo (Specifxx/LorcanaCompare, Specifxx/GundamCompare):
a) If `main` doesn't exist yet, open a pull request from branch `claude/hopeful-bardeen-d4cuq3`
   and merge it (or set that branch as default, rename it to main, and make main the default
   branch).
b) Settings → Actions → General → Workflow permissions: "Read and write permissions". Save.

=== 2. Databases (Neon, console.neon.tech) ===
Create two new projects on the free plan: "lorcana-compare" and "gundam-compare" (region
AWS us-east-1). For each, copy the POOLED connection string (Dashboard → Connect → "Pooled
connection"). These are each site's DATABASE_URL.

=== 3. eBay developer keys (developer.ebay.com → My Account → Application Keys) ===
App: "BillYang-API3", Production keyset.
a) If the keyset shows as disabled / "not enabled", click the link to set up
   "Marketplace Account Deletion" notifications. Choose the option saying I do NOT persist eBay
   user data (the exemption). Select reason "I do not store eBay user data", submit, and confirm
   the keyset is enabled.
b) Copy the exact App ID (Client ID) and Cert ID (Client Secret) from that page. Use the
   copy buttons, not retyping: the Cert ID I pasted earlier was rejected as invalid_client, so
   it may have been mistyped. (The keys are deliberately not stored in this repo; the copy
   of this prompt in the Claude Code chat has them for comparison.)
Both sites share this one key pair (each spends at most 2,500 of the 5,000 daily calls).

=== 4. GitHub secrets & variables (for BOTH repos) ===
Settings → Secrets and variables → Actions.
Secrets (New repository secret):
  EBAY_CLIENT_ID        = App ID from step 3
  EBAY_CLIENT_SECRET    = Cert ID from step 3
  EBAY_AFFILIATE_CAMPAIGN = 5339155912   (or the new campaign id from step 8, per site)
  DATABASE_URL          = that site's Neon pooled string (step 2)
  RESEND_API_KEY        = from step 7 (come back and add it)
  EMAIL_FROM            = "Lorcana Compare <alerts@LORCANA_DOMAIN>" / "Gundam Compare <alerts@GUNDAM_DOMAIN>"
  INDEXNOW_KEY          = a random 32-character hex string (different per site; generate one)
  STRIPE_SECRET_KEY     = from step 6 (optional here, used by the health monitor)
Variables tab (New repository variable):
  SITE_URL = https://LORCANA_DOMAIN   (Gundam repo: https://GUNDAM_DOMAIN)

=== 5. Vercel (vercel.com) ===
For each repo: Add New → Project → Import the GitHub repo. Framework Next.js, defaults.
Before the first deploy, add Environment Variables (Production AND Preview):
  DATABASE_URL                 = Neon pooled string for that site
  AUTH_SECRET                  = a random 64-character hex string (different per site)
  NEXT_PUBLIC_SITE_URL         = https://LORCANA_DOMAIN  (or https://GUNDAM_DOMAIN)
  EBAY_AFFILIATE_CAMPAIGN      = 5339155912 (or the per-site campaign from step 8)
  TCGPLAYER_IMPACT_LINK        = https://partner.tcgplayer.com/c/7385758/1780961/21018 (or per-site link from step 8)
  NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-6842128782879909
  RESEND_API_KEY / EMAIL_FROM  = same as GitHub
  INDEXNOW_KEY                 = same as that repo's GitHub secret
  STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_* = from step 6
Settings → Git: Production Branch = main. Then Deploy.
Note: the repo only builds commits whose message starts a line with "[deploy]". If the first
import shows "Build skipped", go to the GitHub repo → Actions → "Production deploy" → Run workflow.
Domains: Settings → Domains → add LORCANA_DOMAIN and www.LORCANA_DOMAIN (redirect www → apex).
If the domain was bought outside Vercel, show me the DNS records to add at the registrar (or add
them yourself if the registrar is open in another tab and I'm signed in).
Check https://LORCANA_DOMAIN and https://GUNDAM_DOMAIN load.

=== 6. Stripe (dashboard.stripe.com, live mode) ===
a) Products: create "Lorcana Compare Plus" with recurring prices US$2.99/month and US$23.99/year,
   and "Lorcana Compare Premium" with US$9.99/month and US$79.99/year. Do the same for "Gundam
   Compare Plus" / "Gundam Compare Premium". Copy each price id (price_...) into Vercel for the
   matching project:
     STRIPE_PRICE_PLUS_MONTHLY, STRIPE_PRICE_PLUS_YEARLY, STRIPE_PRICE_PREMIUM_MONTHLY, STRIPE_PRICE_PREMIUM_YEARLY
   (Optional: without them the site creates the same prices inline at checkout.)
b) Developers → API keys: copy the Secret key → Vercel STRIPE_SECRET_KEY (both projects), and
   also the GitHub secret STRIPE_SECRET_KEY.
c) Developers → Webhooks → Add endpoint, once per site:
     URL: https://LORCANA_DOMAIN/api/stripe/webhook   (and https://GUNDAM_DOMAIN/api/stripe/webhook)
     Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted
   Copy each endpoint's Signing secret (whsec_...) → that project's STRIPE_WEBHOOK_SECRET.
d) Settings → Billing → Customer portal: enable it (cancel + switch plans allowed). Save.
e) In Vercel, Redeploy both projects so the new variables apply (Deployments → ⋯ → Redeploy).

=== 7. Email (resend.com) ===
Domains → Add domain, once per site (LORCANA_DOMAIN, GUNDAM_DOMAIN). Add the DNS records it shows
(in Vercel → Domains → DNS if the domain is on Vercel), then Verify. API Keys → Create one
"sending" key → RESEND_API_KEY in both Vercel projects and both GitHub repos.

=== 8. Affiliate programs ===
a) eBay Partner Network (partnernetwork.ebay.com): Account → Websites/Traffic sources: add both
   domains. Campaigns: create "Lorcana Compare" and "Gundam Compare" campaigns and give me their
   Campaign IDs. If you create them, put each id in that site's EBAY_AFFILIATE_CAMPAIGN (Vercel and
   GitHub). Otherwise leave 5339155912.
b) Impact (app.impact.com), TCGplayer program: Account → Properties: add both sites as new
   properties (type Website, category Hobbies/Collectibles, describe them as price-comparison
   sites). Then Create a tracking link to tcgplayer.com for each property; if it differs from
   https://partner.tcgplayer.com/c/7385758/1780961/21018, put it in that site's
   TCGPLAYER_IMPACT_LINK in Vercel.
c) TCGplayer: nothing else needed — prices come from tcgcsv.com, no API key.
d) Amazon Associates (optional): add both sites to the existing account (Account → Edit
   Account Information → Website list). If it offers per-site tracking IDs, create
   "lorcanacompare-20" and "gundamcompare-20" and set AMAZON_ASSOCIATE_TAG in each Vercel project.

=== 9. First data import ===
In each GitHub repo: Actions → "Refresh prices" → Run workflow (leave "Spend eBay calls" ticked).
It takes about 3–5 minutes. Confirm it finished green and its log shows a line like
"[ebay] app remaining ... budget 2500". If it says "eBay token: HTTP 401 invalid_client", go back
to step 3. The run commits data and triggers a production build automatically.
Then Actions → "Ops monitor" → Run workflow, and report anything it lists as FAIL.

=== 10. Search engines ===
a) Google Search Console: Add property → Domain → LORCANA_DOMAIN. Add the TXT record it gives
   (Vercel → Domains → DNS) and Verify. Then Sitemaps → submit "sitemap.xml". Repeat for
   GUNDAM_DOMAIN. Then URL Inspection → request indexing for the homepage, /cards, /sets,
   /preorders and each /blog/... post.
b) Bing Webmaster Tools: Add site → "Import from Google Search Console" for both sites (or
   verify by DNS). Submit https://LORCANA_DOMAIN/sitemap.xml and https://GUNDAM_DOMAIN/sitemap.xml.
   Under IndexNow, confirm the key file is found at /indexnow-key.txt.
c) Google AdSense: Sites → Add site → each domain. The sites already serve /ads.txt and the
   AdSense script. Request review. Once approved, create a Display ad unit "home-top" per site and
   put its slot id in Vercel NEXT_PUBLIC_ADSENSE_SLOT_HOME (optionally NEXT_PUBLIC_ADSENSE_SLOT_CARD
   and NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE too), then redeploy.

=== 11. Check it as a user ===
On each site: create an account with bill.jyang101@gmail.com (any password), confirm the
"Admin" link appears top-right and /admin loads. Open a card, click Buy on a row and confirm it
lands on the store. Open /premium, click Monthly on Plus, and confirm Stripe Checkout opens.
Close it without paying.

At the end, list for me: the Neon project names, which secrets/variables were set where,
the Stripe price ids and webhook endpoints, the EPN campaign ids, verification status in
Google/Bing/AdSense, and every step that failed or needs me.
```
