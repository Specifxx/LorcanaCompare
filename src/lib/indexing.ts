// Which card pages ask to be indexed, and how long a price in JSON-LD is good for.
//
// Zero-data rule (Gemini SEO research, 2026-11-04; Google's scaled-content and
// soft-404 guidance): a programmatic page with nothing of its own, no TCGplayer
// reference price and no store or eBay listing, is a template with a name in it.
// It stays reachable (noindex, follow: crawlers still walk its links) but out of
// the index, so the thin long tail does not drag the rest of the domain down.
// Cards in an upcoming set are kept: they have no price yet because the set is
// not out, and reveal-week searches are exactly when people look for them.
// Nothing is deleted and no URL changes (owner, 2026-11-03: narrow, never delete).
export function cardIndexable(p: { kind: "card" | "sealed"; sealedType: string | null }, refCents: number | null, offerCount: number, set: { upcoming: boolean } | null | undefined): boolean {
  if (p.sealedType === "Insert") return false; // pack inserts, as before (DECISIONS.md, 2026-10-28)
  if (set?.upcoming) return true;
  return refCents != null || offerCount > 0;
}

/**
 * The stricter rule after the November 2026 core update (2026-11-19): on one site of this engine 1,499 card pages asked to be
 * indexed and Search Console showed people finding 49 of them in 56 days; the long tail of cheap singles with no store
 * listing reads as a template. A single now asks to be indexed when it is in an upcoming set, when search already finds
 * it (lib/search-demand.ts), or when it is worth CARD_INDEX_MIN_CENTS+ on TCGplayer AND a store sells it. Sealed products
 * keep the zero-data rule. The rest stay live, linked, noindex, follow. DECISIONS.md, 2026-11-19.
 */
export const CARD_INDEX_MIN_CENTS = 500;
export function cardAsksIndex(
  p: { kind: "card" | "sealed"; sealedType: string | null },
  refCents: number | null,
  offerCount: number,
  storeCount: number,
  set: { upcoming: boolean } | null | undefined,
  found: boolean,
): boolean {
  if (!cardIndexable(p, refCents, offerCount, set)) return false;
  if (p.kind === "sealed" || set?.upcoming || found) return true;
  return (refCents ?? 0) >= CARD_INDEX_MIN_CENTS && storeCount > 0;
}

/** Store prices refresh on the daily import, so a price in JSON-LD is good until tomorrow (schema.org priceValidUntil, YYYY-MM-DD). */
export function priceValidUntil(now = Date.now()): string {
  return new Date(now + 86400e3).toISOString().slice(0, 10);
}
