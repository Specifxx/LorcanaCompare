"use client";
// The two side rails (owner, 2026-11-06: "I really like what the Dex Compare and MTG Compare engine have, where the actual site is a
// little thinner and then you have the two ad banners, one for eBay, one for TCGplayer, on the sides"). Ported from DexCompare /
// MTG Compare (SideAds.tsx there): real cards and sealed product with today's prices, eBay Buy It Now in the visitor's market down
// the left (beside the navigation rail), TCGplayer's market price down the right, both fixed beside the page column.
//
//   • Browser only, from 1280px wide (every regular 16:9 and 16:10 screen). Nothing is in the server HTML: the rails mount after
//     hydration and only while the window is at least MIN_WIDTH wide, so crawlers, tablets and phones never see them (no SEO change,
//     CLS 0: a fixed element takes no space; the room beside the column is CSS, globals.css "The side rails"). The tiles come from
//     /api/rails (CDN-cached six hours), asked once a rail mounts.
//   • Each rail runs from under the header to the window's foot and scrolls through up to ten tiles, the newest sets' leading
//     products first (lib/card-ads.ts); a window too short for one whole tile shows no rail.
//   • Labelled "Ad" with the affiliate note, every link sponsored and through /go with its own tag (side-ebay-rail,
//     side-tcg-rail). Not a pop-up: nothing moves, covers content or asks for anything.
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { SITE } from "@/site.config";
import type { Market } from "@/lib/site-types";
import type { AdTile, CardAds } from "@/lib/card-ads";
import { ebaySearchUrl, goHref } from "@/lib/affiliate";
import { money } from "@/lib/format";
import { useMarket } from "./ClientPrefs";
import { EbayWord } from "./EbayCallout";

/** From MIN_WIDTH a rail RAIL_W wide sits GUTTER outside each side of the page column (globals.css narrows the column to make room). */
export const MIN_WIDTH = 1280;
export const RAIL_W = 136;
const GUTTER = 12;
/** The column's widest (Tailwind max-w-7xl, 80rem): from there the rails sit just outside it instead of at the window's edges. */
const COLUMN_MAX = 1280;
/** Vertical budget: the sticky header, a gutter above and below, the rail's own top line and note, its padding. */
const HDR = 55;
const HEAD = 30;
const NOTE = 34;
const PAD = 16;
/** One tile: a card-shaped (5:7) picture across the tile, a title line and a price line. */
export const TILE_H = 6 + Math.round(((RAIL_W - PAD - 12) * 7) / 5) + 4 + 18 + 20 + 6;
export const MAX_TILES = 10;
/** A market's own eBay tiles are shown from this many; fewer, and the rail shows eBay US (as the card ad pair does). */
const MIN_OWN = 4;
const EBAY_SEARCH_MARKETS = ["US", "UK", "AU", "CA"] as const;

/** Whether a window this tall holds a rail with at least one whole tile in view (the rest scroll). Pure, for the tests. */
export function railFits(innerHeight: number): boolean {
  return innerHeight - HDR - 2 * GUTTER - HEAD - NOTE - PAD >= TILE_H;
}

/** The eBay tiles a market's rail shows: its own when it has enough, else eBay US's. Pure, for the tests. */
export function ebayTilesFor(ads: CardAds, market: Market): { tiles: AdTile[]; market: Market } {
  const own = ads.ebay[market] ?? [];
  if (own.length >= MIN_OWN) return { tiles: own.slice(0, MAX_TILES), market };
  return { tiles: (ads.ebay.US ?? []).slice(0, MAX_TILES), market: "US" };
}

type Payload = { ads: CardAds; adSearch: { ebayQuery: string; tcgplayerUrl: string } };

export function SideAds() {
  const [fit, setFit] = useState(false);
  const [data, setData] = useState<Payload | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const update = () => setFit(mq.matches && railFits(window.innerHeight));
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    if (!fit || data) return;
    let live = true;
    fetch("/api/rails")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Payload | null) => live && j && setData(j))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [fit, data]);
  const { market } = useMarket();
  if (!fit || !data) return null;
  const ebay = ebayTilesFor(data.ads, market);
  const tcg = data.ads.tcgplayer.slice(0, MAX_TILES);
  const searchMarket = (EBAY_SEARCH_MARKETS as readonly string[]).includes(market) ? (market as (typeof EBAY_SEARCH_MARKETS)[number]) : "US";
  return (
    <>
      {ebay.tiles.length >= 2 && (
        <Rail
          side="left"
          label={`Sponsored: ${SITE.gameShort} on eBay`}
          brand={<EbayWord className="text-lg" />}
          accent="#0064d2"
          tiles={ebay.tiles}
          tileHref={(t) => goHref({ url: t.url, source: "ebay", market: ebay.market }, t.id, "side-ebay-rail")}
          allHref={goHref({ url: ebaySearchUrl(data.adSearch.ebayQuery, searchMarket), source: "ebay", market: searchMarket }, undefined, "side-ebay-rail-all")}
          allLabel="All on eBay →"
          note={ebay.market !== market ? "Ad · eBay US listings" : "Ad · we may earn"}
          sub="eBay Buy It Now"
        />
      )}
      {tcg.length >= 2 && (
        <Rail
          side="right"
          label={`Sponsored: ${SITE.gameShort} on TCGplayer`}
          brand={
            <span className="text-[15px] font-black tracking-tight" aria-label="TCGplayer">
              <span className="text-fg">TCG</span>
              <span style={{ color: "#4fa3ff" }}>player</span>
            </span>
          }
          accent="#1f6fe5"
          tiles={tcg}
          tileHref={(t) => goHref({ url: t.url, source: "tcgplayer", market: "US" }, t.id, "side-tcg-rail")}
          allHref={goHref({ url: data.adSearch.tcgplayerUrl, source: "tcgplayer", market: "US" }, undefined, "side-tcg-rail-all")}
          allLabel="All on TCGplayer →"
          note={market !== "US" ? "Ad · prices in US$" : "Ad · we may earn"}
          sub="TCGplayer market"
        />
      )}
    </>
  );
}

const RAIL = "side-rail fixed z-30 hidden flex-col rounded-2xl border border-ink-700/60 bg-ink-900 p-2 min-[1280px]:flex";
const LIST = "rail-scroll grid min-h-0 grid-cols-1 flex-1 content-start gap-2 overflow-y-auto overscroll-contain";
const TILE = "group flex flex-col rounded-xl border border-ink-700 bg-ink-950/40 p-1.5 transition-colors hover:border-[var(--ad-accent)]";

const railStyle = (side: "left" | "right", accent: string): CSSProperties => ({
  top: `calc(var(--hdr) + ${GUTTER}px)`,
  bottom: GUTTER,
  width: RAIL_W,
  // Just outside the column: GUTTER from it, and never closer than GUTTER to the navigation rail or the window's edge. 100% is the
  // window's width without its scrollbar (a fixed element's containing block), as the column's is.
  [side]: `calc(${side === "left" ? "var(--sidenav-w) + " : ""}max(${GUTTER}px, (100% - var(--sidenav-w)) / 2 - ${COLUMN_MAX / 2 + GUTTER + RAIL_W}px))`,
  ["--ad-accent" as string]: accent,
});

function Rail(props: { side: "left" | "right"; label: string; brand: ReactNode; accent: string; tiles: AdTile[]; tileHref: (t: AdTile) => string; allHref: string; allLabel: string; note: string; sub: string }) {
  const { side, label, brand, accent, tiles, tileHref, allHref, allLabel, note, sub } = props;
  return (
    <aside role="group" data-ad={`side-${side}`} aria-label={label} className={RAIL} style={railStyle(side, accent)}>
      <div className="mb-2 flex h-[22px] shrink-0 items-center justify-between px-1">
        {brand}
        <span className="rounded bg-ink-950/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Ad</span>
      </div>
      <ul role="list" className={LIST}>
        {tiles.map((t) => (
          <li key={t.id}>
            <a href={tileHref(t)} rel="sponsored nofollow noopener" target="_blank" className={TILE} title={`${t.name} · ${money(t.cents, t.currency)} · ${sub}`}>
              <span className="relative block aspect-[5/7] w-full overflow-hidden rounded-md bg-ink-850">
                {t.image && <img src={t.image} alt={t.name} width={112} height={157} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-0.5" />}
              </span>
              <span className="mt-1 block h-[18px] truncate text-xs font-semibold leading-[18px] group-hover:text-[var(--ad-accent)]">{t.name}</span>
              <span className="block tabular-nums h-5 truncate text-[15px] font-bold leading-5">{money(t.cents, t.currency)}</span>
              <span className="sr-only">, {sub}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex h-[26px] shrink-0 flex-col justify-center px-1 text-[10px] leading-[13px] text-muted">
        <a href={allHref} rel="sponsored nofollow noopener" target="_blank" className="truncate font-bold" style={{ color: accent === "#0064d2" ? "#4f9cf0" : "#4fa3ff" }}>
          {allLabel}
        </a>
        <span className="truncate">{note}</span>
      </p>
    </aside>
  );
}
