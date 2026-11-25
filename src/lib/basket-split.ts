// BEST BASKET'S SHIPPING-AWARE SPLIT (owner, 2026-11-25: Best Basket "on all the sites as premium"). The free tool prices each card
// where it is cheapest and lists one-store orders before postage (lib/tools.ts priceBasket). This adds what RiftCompare's Premium
// basket does: the cheapest way to buy the whole list INCLUDING each store's shipping, splitting across stores only when that is
// cheaper (lib/basket-optimize.ts, Rift's solver ported unchanged, as on DexCompare, MTG Compare, YGO Compare and TCG Prices).
// Everyone sees the delivered total and the saving; the store-by-store plan is a Premium member's (app/api/basket/route.ts).
//
// Rows: the free tool's own (basketUsable: in stock, not a pre-order, from a store read in the last 48 hours), in this market only,
// stores only (never TCGplayer, eBay or Amazon: each store is its own checkout). Shipping: the sister sites' weekly checkout
// measurements of the same shops (lib/borrowed-shipping.ts, data/shipping/borrowed.json), the DEAREST address, "up to" when
// addresses differ or the order holds more than one item. A store nobody measured is left out and counted, never priced at zero.
import fs from "node:fs";
import path from "node:path";
import { planBasket, type BasketAlternatives, type BasketCard, type BasketListing, type BasketPlan, type BasketStores } from "./basket-optimize";
import type { PostageCart, PostageQuote } from "./postage";
import { EMPTY_BORROWED, validBorrowed, type BorrowedShipping } from "./borrowed-shipping";
import { quoteAt, type ShipQuote } from "./shipping-quote";
import { meta, priceOf, productById } from "./data";
import { basketUsable } from "./tools";
import { goHref } from "./affiliate";
import type { Market, Offer } from "./site-types";
import { SITE } from "@/site.config";

const MARKETPLACE = /^(ebay|tcgplayer|amazon)/;
const PREORDER = /\bpre[-\s]?orders?\b/i;

let cached: BorrowedShipping | null = null;
function shipping(): BorrowedShipping {
  if (cached) return cached;
  try {
    cached = validBorrowed(JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/shipping/borrowed.json"), "utf8")));
  } catch {
    cached = EMPTY_BORROWED;
  }
  return cached;
}

/** A store's measured postage for a basket order, or null when no sister measured it in this market. */
export function measuredPostage(storeKey: string, market: string, snap: BorrowedShipping = shipping()): ((cart: PostageCart) => PostageQuote) | null {
  const s = snap.stores[storeKey];
  if (!s || s.market !== market) return null;
  const ids = (snap.addresses[market] ?? []).map((a) => a.id);
  const addressIds = ids.length ? ids : [...new Set(s.points.flatMap((p) => Object.keys(p.rates)))];
  const lowest = s.points.reduce((m, p) => Math.min(m, p.subtotalCents), Infinity);
  const quote = (cents: number): ShipQuote | null => quoteAt(s, addressIds, cents);
  if (!Number.isFinite(lowest) || !quote(lowest)) return null;
  return (cart) => {
    // Under the store's cheapest measured item there is nothing to read from: its cheapest measured cart's figure stands in.
    const exact = quote(cart.subtotalCents);
    const q = (exact ?? quote(lowest))!;
    return {
      cents: q.maxCents,
      label: q.maxCents === 0 ? "Free shipping" : "Measured shipping",
      tracked: null,
      basis: exact ? "measured" : "estimate",
      free: q.maxCents === 0,
      upTo: q.minCents !== q.maxCents,
      ...(q.freeAtCents != null && q.freeAtCents > cart.subtotalCents ? { freeFromCents: q.freeAtCents } : {}),
      ...(cart.items > 1 && q.maxCents > 0 ? { beyondMeasured: true } : {}),
      measuredAt: q.measuredAt.slice(0, 10),
    };
  };
}

/** A card's offers the split may use: the free tool's rule, this market, stores only, cheapest per store. */
export function splitListings(offers: Offer[], market: Market, stores: Record<string, { at: string }> | undefined, now = Date.now()): BasketListing[] {
  const best = new Map<string, BasketListing>();
  for (const o of offers) {
    if (o.market !== market || MARKETPLACE.test(o.source) || !(o.cents > 0) || !basketUsable(o, stores, now)) continue;
    if (!stores?.[o.source]?.at) continue; // never read: no freshness to vouch for
    if (PREORDER.test(o.title) || PREORDER.test(o.url)) continue;
    const cur = best.get(o.source);
    if (!cur || o.cents < cur.priceCents) best.set(o.source, { retailer: o.source, priceCents: o.cents, url: o.url, condition: null });
  }
  return [...best.values()];
}

export function splitStores(cards: BasketCard[], market: string, postageFor: (key: string, market: string) => ((cart: PostageCart) => PostageQuote) | null = measuredPostage): BasketStores {
  const names = new Map(SITE.stores.map((s) => [s.key, s.name]));
  const stores: BasketStores = {};
  for (const c of cards) {
    for (const l of c.listings) {
      if (stores[l.retailer]) continue;
      const name = names.get(l.retailer) ?? l.retailer;
      const postage = postageFor(l.retailer, market);
      stores[l.retailer] = postage
        ? { name, postage }
        : { name, postage: () => ({ cents: 0, label: "", tracked: null, basis: "estimate", free: false, upTo: false }), unavailable: "We haven't measured its shipping yet" };
    }
  }
  return stores;
}

export interface SplitSummary {
  currency: string;
  totalCents: number;
  itemsCents: number;
  shippingCents: number;
  storeCount: number;
  naiveTotalCents: number;
  savedCents: number;
  matchedCards: number;
  unbuyable: { name: string; qty: number }[];
  leftOut: number;
  estimated: boolean;
}

export interface Split {
  summary: SplitSummary;
  plan: BasketPlan;
  alternatives: BasketAlternatives;
}

/** The shipping-aware split of a priced list in one market. */
export function splitBasket(lines: { qty: number; id: number | null }[], market: Market, currency: string, now = Date.now()): Split {
  const read = meta()?.stores as Record<string, { at: string }> | undefined;
  const cards: BasketCard[] = [];
  const qty = new Map<number, number>();
  for (const l of lines) if (l.id) qty.set(l.id, (qty.get(l.id) ?? 0) + l.qty);
  for (const [id, q] of qty) {
    const p = productById(id);
    if (!p) continue;
    cards.push({ cardId: String(p.id), name: p.name, slug: p.slug, qty: q, listings: splitListings(priceOf(p.id).offers, market, read, now) });
  }
  const { plan, alternatives } = planBasket(cards, splitStores(cards, market), {
    link: (url, key) => goHref({ url, source: key, market, inStock: true }, undefined, "best-basket"),
  });
  return {
    summary: {
      currency,
      totalCents: plan.totalCents,
      itemsCents: plan.itemsCents,
      shippingCents: plan.shippingCents,
      storeCount: plan.storeCount,
      naiveTotalCents: plan.naiveTotalCents,
      savedCents: plan.savedCents,
      matchedCards: plan.matchedCards,
      unbuyable: plan.unbuyable,
      leftOut: plan.excludedStores.length,
      estimated: plan.stores.some((s) => s.postage.basis === "estimate" || s.postage.beyondMeasured || s.postage.upTo),
    },
    plan,
    alternatives,
  };
}
