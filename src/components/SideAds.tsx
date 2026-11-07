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
import { AdDock, DockGate, DockTile, DOCK_LINK, type DockSide } from "./AdDock";

/** From MIN_WIDTH a rail RAIL_W wide sits flush against each side of the window (globals.css narrows the column to make room). */
export const MIN_WIDTH = 1280;
export const RAIL_W = 136;
/** Vertical budget: the sticky header, the rail's own top line and note. */
const HDR = 55;
const HEAD = 30;
const NOTE = 34;
const PAD = 0;
/** One tile: a card-shaped (5:7) picture across the tile, a title line and a price line. */
export const TILE_H = 16 + Math.round(((RAIL_W - 1 - 16) * 7) / 5) + 4 + 18 + 20 + 1;
export const MAX_TILES = 10;
/** A market's own eBay tiles are shown from this many; fewer, and the rail shows eBay US (as the card ad pair does). */
const MIN_OWN = 4;
const EBAY_SEARCH_MARKETS = ["US", "UK", "AU", "CA"] as const;

/** Whether a window this tall holds a rail with at least one whole tile in view (the rest scroll). Pure, for the tests. */
export function railFits(innerHeight: number): boolean {
  return innerHeight - HDR - HEAD - NOTE - PAD >= TILE_H;
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
  const [narrow, setNarrow] = useState(false);
  const [data, setData] = useState<Payload | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const update = () => {
      setFit(mq.matches && railFits(window.innerHeight));
      setNarrow(!mq.matches);
    };
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
  // Too narrow for the rails (phones, tablets, a small window): the same tiles in the phone dock (AdDock.tsx), asked for only once
  // the visitor scrolls.
  if (narrow)
    return (
      <DockGate minWidth={MIN_WIDTH}>
        <PhoneDock />
      </DockGate>
    );
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

const RAIL = "side-rail fixed z-30 hidden flex-col border-ink-700/60 bg-ink-900 min-[1280px]:flex";
const LIST = "rail-scroll grid min-h-0 grid-cols-1 flex-1 content-start overflow-y-auto overscroll-contain border-y border-ink-700/60";
const TILE = "group flex flex-col border-b border-ink-700/60 px-2 py-2 transition-colors hover:bg-ink-950/50";

const railStyle = (side: "left" | "right", accent: string): CSSProperties => ({
  // Flush (owner, 2026-11-07: "I don't like how it's floating … no gap"): from the header to the window's foot, against the
  // navigation rail (left) or the window's edge (right), square, one hairline facing the page; tiles edge to edge.
  top: "var(--hdr)",
  bottom: 0,
  width: RAIL_W,
  [side]: side === "left" ? "var(--sidenav-w)" : 0,
  [side === "left" ? "borderRightWidth" : "borderLeftWidth"]: 1,
  ["--ad-accent" as string]: accent,
});

function Rail(props: { side: "left" | "right"; label: string; brand: ReactNode; accent: string; tiles: AdTile[]; tileHref: (t: AdTile) => string; allHref: string; allLabel: string; note: string; sub: string }) {
  const { side, label, brand, accent, tiles, tileHref, allHref, allLabel, note, sub } = props;
  return (
    <aside role="group" data-ad={`side-${side}`} aria-label={label} className={RAIL} style={railStyle(side, accent)}>
      <div className="flex h-[30px] shrink-0 items-center justify-between px-2">
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
      <p className="flex h-[34px] shrink-0 flex-col justify-center px-2 text-[10px] leading-[13px] text-muted">
        <a href={allHref} rel="sponsored nofollow noopener" target="_blank" className="truncate font-bold" style={{ color: accent === "#0064d2" ? "#4f9cf0" : "#4fa3ff" }}>
          {allLabel}
        </a>
        <span className="truncate">{note}</span>
      </p>
    </aside>
  );
}

/**
 * The phone dock (owner, 2026-11-06: the rails "on mobile … in the best way that doesn't interrupt user experience"): the rails'
 * tiles from the same /api/rails answer, eBay and TCGplayer taking turns, in one bar along the foot of a narrow screen. AdDock.tsx
 * has the rules; it yields to every ad unit ([data-ad]) and never shows on a card page (CardBuy's data-buybar).
 */
function PhoneDock() {
  const [data, setData] = useState<Payload | null>(null);
  const { market } = useMarket();
  useEffect(() => {
    let live = true;
    fetch("/api/rails")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Payload | null) => live && j && setData(j))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  if (!data) return null;
  const ebay = ebayTilesFor(data.ads, market);
  const us = market === "US";
  const tcgBrand = (
    <span className="font-black tracking-tight" aria-label="TCGplayer">
      <span className="text-fg">TCG</span>
      <span style={{ color: "#4fa3ff" }}>player</span>
    </span>
  );
  const sides: DockSide[] = [];
  const e = ebay.tiles.filter((t) => t.image);
  if (e.length >= 2)
    sides.push({
      key: "ebay",
      items: e.map((t) => (
        <a key={t.id} href={goHref({ url: t.url, source: "ebay", market: ebay.market }, t.id, "dock-ebay")} rel="sponsored nofollow noopener" target="_blank" className={DOCK_LINK} title={`${t.name} · ${money(t.cents, t.currency)}`}>
          <DockTile img={t.image!} alt={t.name} brand={<EbayWord className="text-[11px]" />} title={t.name} price={money(t.cents, t.currency)} cta="View" />
          <span className="sr-only">, eBay Buy It Now</span>
        </a>
      )),
    });
  const tcg = data.ads.tcgplayer.slice(0, MAX_TILES).filter((t) => t.image);
  if (tcg.length >= 2)
    sides.push({
      key: "tcgplayer",
      items: tcg.map((t) => (
        <a key={t.id} href={goHref({ url: t.url, source: "tcgplayer", market: "US" }, t.id, "dock-tcg")} rel="sponsored nofollow noopener" target="_blank" className={DOCK_LINK} title={`${t.name} · ${money(t.cents, t.currency)}`}>
          <DockTile img={t.image!} alt={t.name} brand={tcgBrand} title={t.name} price={us ? money(t.cents, t.currency) : `US${money(t.cents, t.currency)}`} cta="View" />
          <span className="sr-only">, TCGplayer market</span>
        </a>
      )),
    });
  if (sides.length === 0) return null;
  return <AdDock label={`Sponsored: ${SITE.gameShort} on eBay and TCGplayer`} sides={sides} placement="dock" minWidth={MIN_WIDTH} />;
}
