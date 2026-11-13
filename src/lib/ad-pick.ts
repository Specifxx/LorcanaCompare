// What the in-page ad block and the phone dock share (pure, safe for the browser: types only from card-ads.ts, which reads files).
// Both read /api/rails: the leading products on eBay (per market) and TCGplayer.
import type { Market } from "./site-types";
import type { AdTile, CardAds } from "./card-ads";

export const MAX_TILES = 10;
/** A market's own eBay tiles are shown from this many; fewer, and the block shows eBay US. */
export const MIN_OWN = 4;
export const EBAY_SEARCH_MARKETS = ["US", "UK", "AU", "CA"] as const;
export type SearchMarket = (typeof EBAY_SEARCH_MARKETS)[number];

export type AdPayload = { ads: CardAds; adSearch: { ebayQuery: string; tcgplayerUrl: string } };

/** The eBay tiles a market shows: its own when it has enough, else eBay US's. Pure, for the tests. */
export function ebayTilesFor(ads: CardAds, market: Market): { tiles: AdTile[]; market: Market } {
  const own = ads.ebay[market] ?? [];
  if (own.length >= MIN_OWN) return { tiles: own.slice(0, MAX_TILES), market };
  return { tiles: (ads.ebay.US ?? []).slice(0, MAX_TILES), market: "US" };
}

export function searchMarketOf(market: Market): SearchMarket {
  return (EBAY_SEARCH_MARKETS as readonly string[]).includes(market) ? (market as SearchMarket) : "US";
}
