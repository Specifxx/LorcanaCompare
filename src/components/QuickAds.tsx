"use client";
// The quick view's ad pair (owner, 2026-11-18: "ads can show in the quick view"): a slim box of real eBay Buy It Now
// listings (the visitor's market, else eBay US) and TCGplayer market prices from the product's own set, under the
// quick view's price rows. The quick view opens only when a visitor clicks a product, so this is shown after they
// engage and is never in a page's crawled HTML. Labelled "Ad", every link rel sponsored through /go under
// `quickview-mini-ebay` / `quickview-mini-tcg` (and `-all`). Never Amazon, never a price row, never "the cheapest".
import { SITE } from "@/site.config";
import type { AdTile } from "@/lib/card-ads";
import { ebayTilesFor, searchMarketOf, type AdPayload } from "@/lib/ad-pick";
import { ebaySearchUrl, goHref } from "@/lib/affiliate";
import { money } from "@/lib/format";
import { useMarket } from "./ClientPrefs";

/** A row shows from this many tiles; fewer, and that retailer's row is left out. */
const MIN_TILES = 3;
const LIMIT = 6;

function Row({ brand, accent, all, tiles, tileHref, sub }: { brand: string; accent: string; all: string; tiles: AdTile[]; tileHref: (t: AdTile) => string; sub: string }) {
  return (
    <div className="flex min-w-0 items-stretch gap-2">
      <a href={all} rel="sponsored nofollow noopener" target="_blank" className="flex w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-md text-center" aria-label={`See all on ${brand}`}>
        <span className="text-[13px] font-black leading-none tracking-tight" style={{ color: accent }}>{brand}</span>
        <span className="text-[10px] font-bold text-muted">All →</span>
      </a>
      <div className="flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto pb-1">
        {tiles.map((t) => (
          <a
            key={t.id}
            href={tileHref(t)}
            rel="sponsored nofollow noopener"
            target="_blank"
            title={`${t.name} · ${money(t.cents, t.currency)} · ${sub}`}
            aria-label={`${t.name}, ${money(t.cents, t.currency)}, ${sub}`}
            className="flex w-[60px] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-ink-700 hover:opacity-90"
          >
            <span className="relative block aspect-[5/7] overflow-hidden bg-ink-850">
              {t.image && <img src={t.image} alt={t.name} loading="lazy" decoding="async" className="h-full w-full object-contain p-0.5" />}
            </span>
            <span className="truncate px-1 py-0.5 text-center text-[10px] font-black tabular-nums text-white" style={{ background: accent }}>
              {money(t.cents, t.currency)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function QuickAds({ ads, adSearch }: AdPayload) {
  const { market } = useMarket();
  const eb = ebayTilesFor(ads, market);
  const ebay = eb.tiles.slice(0, LIMIT);
  const tcg = ads.tcgplayer.slice(0, LIMIT);
  const showEbay = ebay.length >= MIN_TILES;
  const showTcg = tcg.length >= MIN_TILES;
  if (!showEbay && !showTcg) return null;
  const sm = searchMarketOf(market);
  return (
    <aside data-ad aria-label="Sponsored listings on eBay and TCGplayer" className="grid gap-2 rounded-xl border border-ink-700/60 p-2">
      {showEbay && (
        <Row
          brand="eBay"
          accent="#0064d2"
          all={goHref({ url: ebaySearchUrl(adSearch.ebayQuery, sm), source: "ebay", market: sm }, undefined, "quickview-mini-ebay-all")}
          tiles={ebay}
          tileHref={(t) => goHref({ url: t.url, source: "ebay", market: eb.market }, t.id, "quickview-mini-ebay")}
          sub="eBay Buy It Now"
        />
      )}
      {showTcg && (
        <Row
          brand="TCGplayer"
          accent="#1f6fe5"
          all={goHref({ url: adSearch.tcgplayerUrl, source: "tcgplayer", market: "US" }, undefined, "quickview-mini-tcg-all")}
          tiles={tcg}
          tileHref={(t) => goHref({ url: t.url, source: "tcgplayer", market: "US" }, t.id, "quickview-mini-tcg")}
          sub="TCGplayer market"
        />
      )}
      <p className="flex items-center gap-2 text-[10px] leading-tight text-muted">
        <span className="rounded border border-ink-700 px-1 font-bold">Ad</span>
        <span>
          {SITE.name} may earn a commission from eBay and TCGplayer purchases, at no cost to you.
          {showEbay && eb.market !== market ? " eBay tiles from eBay US." : ""}
          {showTcg && market !== "US" ? " TCGplayer prices in US$." : ""}
        </span>
      </p>
    </aside>
  );
}
