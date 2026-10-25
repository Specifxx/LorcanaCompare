// eBay Browse API: the cheapest live Buy It Now listing for the products worth
// a call.
//
// THE BUDGET. One eBay developer app (5,000 Browse calls a day) is shared by
// Lorcana Compare and Gundam Compare, 2,500 each (owner, 2026-10-24). The app's
// remaining count (Developer Analytics API, free) is shared too, so each site
// also keeps ITS OWN count in data/state/ebay-usage.json and stops at its
// share, whichever limit comes first. The two sites run at different hours
// (SITE.ebay.runHourUtc) so neither starves the other mid-run.
//
// WHAT GETS A CALL (planEbayRefresh, pure and tested):
//   1. Nothing the market prices under SITE.ebay.minPriceUsd ($20). Under that
//      a buyer saves cents and the call is better spent elsewhere.
//   2. Each eligible product has a refresh interval set by value: $100+ daily,
//      $50–100 every 2 days, $20–50 every 4 days. Demand (affiliate clicks in
//      the last 30 days), chase rarities, booster boxes and new or upcoming
//      sets shorten it.
//   3. Products that are due are ranked by value × demand × how overdue they
//      are, and the budget is spent from the top. Anything left over refreshes
//      not-yet-due products in the same order.
//   4. A share of the budget goes to the UK and Australian eBay sites, for the
//      highest-ranked products only.
import { SITE } from "@/site.config";
import type { Market, Offer, Product } from "@/lib/site-types";
import { markersAgree, numbersInTitle } from "./match";
import { tokens } from "@/lib/slug";
import { sealedTypeOf } from "./tcgcsv";
import { shortName } from "@/lib/names";

export const MARKETPLACE: Partial<Record<Market, { id: string; currency: string }>> = {
  US: { id: "EBAY_US", currency: "USD" },
  UK: { id: "EBAY_GB", currency: "GBP" },
  AU: { id: "EBAY_AU", currency: "AUD" },
  CA: { id: "EBAY_CA", currency: "CAD" },
};

/** Share of the daily budget per eBay site. */
export const MARKET_SHARE: Partial<Record<Market, number>> = { US: 0.75, UK: 0.125, AU: 0.125 };

export interface EbayStateEntry {
  at: string; // last checked
  offer: Offer | null;
}
/** productId → market → last result */
export type EbayState = Record<string, Partial<Record<Market, EbayStateEntry>>>;

export interface PlanInput {
  products: Product[];
  refUsdCents: Map<number, number | null>;
  clicks30d: Map<number, number>;
  newSetIds: Set<number>;
  state: EbayState;
  budget: number;
  now: Date;
}

export interface PlannedCall {
  product: Product;
  market: Market;
  score: number;
  due: boolean;
}

export function intervalHours(usd: number, clicks: number, boosted: boolean): number {
  let h = usd >= 100 ? 24 : usd >= 50 ? 48 : 96;
  if (clicks >= 10) h = Math.min(h, 24);
  else if (clicks >= 3) h = Math.min(h, 48);
  if (boosted) h = Math.max(24, h / 2);
  return h;
}

export function planEbayRefresh(input: PlanInput): { calls: PlannedCall[]; eligible: number } {
  const minCents = SITE.ebay.minPriceUsd * 100;
  const ranked: { product: Product; score: number; interval: number }[] = [];
  for (const p of input.products) {
    const ref = input.refUsdCents.get(p.id);
    if (ref == null || ref < minCents) continue;
    const clicks = input.clicks30d.get(p.id) ?? 0;
    const chase = !!p.rarity && SITE.chaseRarities.includes(p.rarity);
    const box = p.kind === "sealed" && /Booster Box|Case|Trove/.test(p.sealedType ?? "");
    const fresh = input.newSetIds.has(p.setId);
    const boosted = chase || box || fresh;
    const value = Math.log10(ref / 100);
    const demand = 1 + Math.log2(1 + clicks);
    const boost = (chase ? 1.3 : 1) * (box ? 1.4 : 1) * (fresh ? 1.5 : 1);
    ranked.push({ product: p, score: value * demand * boost, interval: intervalHours(ref / 100, clicks, boosted) });
  }
  ranked.sort((a, b) => b.score - a.score);

  const calls: PlannedCall[] = [];
  for (const [market, share] of Object.entries(MARKET_SHARE) as [Market, number][]) {
    const slots = Math.floor(input.budget * share);
    // Secondary markets only look at the top of the ranking.
    const pool = market === "US" ? ranked : ranked.slice(0, Math.max(slots * 2, 50));
    const withAge = pool.map((r) => {
      const last = input.state[r.product.id]?.[market]?.at;
      const ageH = last ? (input.now.getTime() - new Date(last).getTime()) / 3_600_000 : Infinity;
      const overdue = Math.min(3, ageH / r.interval);
      return { ...r, due: ageH >= r.interval, priority: r.score * (Number.isFinite(overdue) ? overdue : 3) };
    });
    withAge.sort((a, b) => Number(b.due) - Number(a.due) || b.priority - a.priority);
    for (const r of withAge.slice(0, slots)) {
      // A not-due product checked in the last 12 hours is never worth a call.
      const last = input.state[r.product.id]?.[market]?.at;
      if (!r.due && last && input.now.getTime() - new Date(last).getTime() < 12 * 3_600_000) continue;
      calls.push({ product: r.product, market, score: r.priority, due: r.due });
    }
  }
  return { calls, eligible: ranked.length };
}

// ── API ─────────────────────────────────────────────────────────────────────

export function ebayCredentials(): { id: string; secret: string } | null {
  const id = process.env.EBAY_CLIENT_ID;
  const secret = process.env.EBAY_CLIENT_SECRET;
  return id && secret ? { id, secret } : null;
}

export async function ebayToken(): Promise<string> {
  const c = ebayCredentials();
  if (!c) throw new Error("EBAY_CLIENT_ID / EBAY_CLIENT_SECRET not set");
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${c.id}:${c.secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
  });
  if (!res.ok) throw new Error(`eBay token: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

/** The app's remaining Browse calls today (shared by both sites), or null. */
export async function ebayRemaining(token: string): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.ebay.com/developer/analytics/v1_beta/rate_limit/?api_name=browse&api_context=buy",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return null;
    const d = (await res.json()) as {
      rateLimits?: { resources?: { name: string; rates?: { remaining: number }[] }[] }[];
    };
    for (const rl of d.rateLimits ?? [])
      for (const r of rl.resources ?? []) if (/item_summary|buy\.browse$/.test(r.name)) return r.rates?.[0]?.remaining ?? null;
    return null;
  } catch {
    return null;
  }
}

interface ItemSummary {
  title: string;
  price?: { value: string; currency: string };
  shippingOptions?: { shippingCost?: { value: string } }[];
  itemWebUrl: string;
  itemAffiliateWebUrl?: string;
  buyingOptions?: string[];
  condition?: string;
}

const JUNK = /\b(proxy|custom|orica|fan ?made|replica|lot of|lot|set of \d+|bundle of \d+|choose|pick|you pick|select|playset|x[2-9]|[2-9]x|graded|slab|gem ?mint|empty|opened|digital|code card|sleeve|sleeves|playmat|binder|deck box)\b/i;
// Graded copies: "PSA 10", "PSA10", "P SA10", "BGS 9.5", "CGC", "TAG 10", "ACE 10".
const GRADED = /\b(p\s?sa|bgs|cgc|tag|ace|sgc|beckett)\s?-?\d{1,2}(\.5)?\b|\b(psa|bgs|cgc|beckett|sgc)\b/i;
// Non-English copies, in the ways sellers write them.
const FOREIGN_LISTING = /\b(japanese|japan|jpn|jp|ja|chinese|simplified chinese|traditional chinese|korean|french|german|deutsch|italian|italiano|spanish|español|portuguese|asia|asian)\b|\(jp\)|\[jp\]|日本|中文/i;

export function queryFor(p: Product): string {
  // Variant words in parentheses ("(LR+)", "(Enchanted)") are left out: sellers
  // word them differently, and listingMatches() tells the variants apart.
  const name = shortName(p.name).replace(/\([^)]*\)/g, " ").replace(/[[\]:,]/g, " ");
  return `${SITE.ebay.query} ${name} ${p.kind === "card" ? p.number ?? "" : ""}`.replace(/\s+/g, " ").trim();
}

/** Does an eBay listing title describe this product? */
export function listingMatches(p: Product, title: string): boolean {
  if (GRADED.test(title) || FOREIGN_LISTING.test(title)) return false;
  if (JUNK.test(title) && !(p.kind === "sealed" && /\bcase\b/i.test(p.name) && /\bcase\b/i.test(title) && !/sleeve|deck box|playmat/i.test(title)))
    return false;
  const have = new Set(tokens(title));
  if (p.kind === "card") {
    if (!p.number) return false;
    const nums = numbersInTitle(title, SITE.numberStyle);
    const want = numbersInTitle(p.number, SITE.numberStyle)[0] ?? p.number.toUpperCase();
    // Lorcana sellers often write only "207" — accept "#207" or " 207 " when the
    // set's total is absent, but never a different fraction.
    const bare = SITE.numberStyle === "fraction" ? p.number.split("/")[0] : null;
    const numOk = nums.length ? nums.includes(want) : !!bare && new RegExp(`(^|[#\\s])0*${bare}($|\\s)`).test(title);
    if (!numOk) return false;
    const base = tokens(p.name.replace(/\([^)]*\)/g, " ")).filter((t) => t.length > 1);
    const ok = base.filter((t) => have.has(t)).length / Math.max(1, base.length);
    return ok >= 0.6 && markersAgree(p.name, p.rarity, title);
  }
  if (sealedTypeOf(title) !== sealedTypeOf(p.name)) return false;
  const need = tokens(shortName(p.name)).filter((t) => t.length > 1 && !["disney", "the", "of"].includes(t));
  return need.filter((t) => have.has(t)).length / Math.max(1, need.length) >= 0.8;
}

export async function searchLowest(
  token: string,
  p: Product,
  market: Market,
  refUsdCents: number,
  fxUsd: number,
): Promise<Offer | null> {
  const mp = MARKETPLACE[market];
  if (!mp) return null;
  const ref = (refUsdCents / 100) * fxUsd; // in the marketplace currency
  // Under half of market is far likelier a fake, a damaged or foreign copy
  // than a real bargain on a card this valuable.
  const lo = Math.max(1, Math.floor(ref * 0.5));
  const hi = Math.ceil(ref * 3);
  const params = new URLSearchParams({
    q: queryFor(p),
    category_ids: p.kind === "card" ? SITE.ebay.singlesCategoryId : SITE.ebay.sealedCategoryId,
    filter: `buyingOptions:{FIXED_PRICE},price:[${lo}..${hi}],priceCurrency:${mp.currency}`,
    sort: "price",
    limit: "25",
  });
  const campaign = process.env.EBAY_AFFILIATE_CAMPAIGN || "5339155912";
  const res = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": mp.id,
      "X-EBAY-C-ENDUSERCTX": `affiliateCampaignId=${campaign},affiliateReferenceId=${SITE.key}-${p.id}`,
    },
  });
  if (res.status === 429) throw Object.assign(new Error("eBay quota exhausted (429)"), { quota: true });
  if (!res.ok) throw new Error(`eBay search ${res.status}`);
  const d = (await res.json()) as { itemSummaries?: ItemSummary[] };
  let best: Offer | null = null;
  for (const it of d.itemSummaries ?? []) {
    if (!it.price || it.price.currency !== mp.currency) continue;
    if (!listingMatches(p, it.title)) continue;
    const cents = Math.round(Number(it.price.value) * 100);
    const ship = it.shippingOptions?.[0]?.shippingCost?.value;
    const shippingCents = ship != null ? Math.round(Number(ship) * 100) : null;
    const total = cents + (shippingCents ?? 0);
    if (!best || total < best.cents + (best.shippingCents ?? 0)) {
      best = {
        source: "ebay",
        market,
        currency: mp.currency,
        cents,
        shippingCents,
        inStock: true,
        url: it.itemAffiliateWebUrl || it.itemWebUrl,
        title: it.title,
      };
    }
  }
  return best;
}
