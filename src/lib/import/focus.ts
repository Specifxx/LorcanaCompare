// The store focus (SITE.catalogFocus; BandaiCompare, owner 2026-11-08: "a bit large"). The price floor
// (catalogMinCardCents) runs on TCGplayer's listing alone; this runs after the store pass, on what the
// stores actually sell, and keeps a product only when there is something to compare or someone to look:
//
// - a card: in stock at `minStores` stores in one market, or worth `keepListedCents` with any store
//   listing it, or worth `keepCents` outright (the chase cards people search for whoever sells them);
// - sealed: in stock anywhere, listed by `minStores` stores, from a set released in the last 120 days
//   or not out yet (pre-orders), or a booster box or case with a TCGplayer market price (the set's
//   headline product). Inserts (accessories) only on the card rule's store test;
// - any page Search Console shows people finding (the demand branch), whatever the rule says.
//
// Hysteresis: a product the last focused import kept stays while `minStores` stores in one market still
// LIST it (in stock or not), so a page doesn't flap between a 301 and a 200 with one store's stock.
// Matching ran on the whole catalogue first, so a listing never lands on the wrong card because its own
// card was culled. Slugs were settled before either cull, so a kept page's URL never changes.
import type { Offer, Product, SetInfo, SiteConfig, TcgPrice } from "@/lib/site-types";
import { referenceCents } from "./tcgcsv";

export type FocusRule = NonNullable<SiteConfig["catalogFocus"]>;

const NOT_STORES = new Set(["tcgplayer", "ebay", "amazon"]);
const HEADLINE_SEALED = new Set(["Booster Box", "Case"]);
const DAY = 86_400_000;

/** The most distinct stores in any one market, counting only in-stock offers or every listing. */
export function storesInOneMarket(offers: readonly Offer[], inStockOnly: boolean): number {
  const per = new Map<string, Set<string>>();
  for (const o of offers) {
    if (NOT_STORES.has(o.source) || (inStockOnly && !o.inStock)) continue;
    if (!per.has(o.market)) per.set(o.market, new Set());
    per.get(o.market)!.add(o.source);
  }
  return Math.max(0, ...[...per.values()].map((s) => s.size));
}

export function focusCatalog(args: {
  products: Product[];
  sets: SetInfo[];
  offers: ReadonlyMap<number, readonly Offer[]>;
  tcg: Record<number, Record<string, TcgPrice>>;
  rule: FocusRule;
  now: Date;
  /** Slugs with Search Console demand (lib/import/demand.ts). */
  demand?: ReadonlySet<string>;
  /** Ids the last focused import kept; empty on the first run, so hysteresis starts from today. */
  previous?: ReadonlySet<number>;
}): Product[] {
  const { products, sets, offers, tcg, rule, now, demand = new Set(), previous = new Set() } = args;
  const fresh = new Set(
    sets.filter((s) => s.upcoming || (s.releasedOn && now.getTime() - new Date(s.releasedOn).getTime() < 120 * DAY)).map((s) => s.id),
  );
  return products.filter((p) => {
    if (demand.has(p.slug)) return true;
    const o = offers.get(p.id) ?? [];
    const inStock = storesInOneMarket(o, true);
    const listed = storesInOneMarket(o, false);
    if (inStock >= rule.minStores) return true;
    if (previous.has(p.id) && listed >= rule.minStores) return true;
    if (p.kind === "sealed" && p.sealedType === "Insert") return false;
    const ref = referenceCents(tcg[p.id]) ?? 0;
    if (p.kind === "card") return ref >= rule.keepCents || (ref >= rule.keepListedCents && listed >= 1);
    return inStock >= 1 || listed >= rule.minStores || fresh.has(p.setId) || (HEADLINE_SEALED.has(p.sealedType ?? "") && ref > 0);
  });
}
