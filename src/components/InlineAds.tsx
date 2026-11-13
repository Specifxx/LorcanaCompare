"use client";
// The one ad block (owner, 2026-11-13: the side rails came off; "one bigger, subtler horizontal ad block inside the page content
// that looks native to the site"). A full-column-width card with one row of larger tiles: eBay Buy It Now in the visitor's market
// first, TCGplayer's market price second, each group with its logo word, sideways-scrolling when the column is narrow. The site's
// own surface, border and muted tokens; "Ad" in small muted type; no pop-up, nothing floating, no side space.
//
//   • Browser only: the server HTML holds an empty, aria-hidden box of the block's exact height (so CLS is 0 and nothing is indexed);
//     once the box nears the viewport the tiles are asked from /api/rails (CDN-cached six hours, the data the rails used) and drawn
//     into it. No tiles (or a failed fetch): the box closes, below the content it was always only the foot of the page.
//   • One per page, always below the main content or the price table: never beside a buy button, above a price or in the quick view.
//   • eBay and TCGplayer only; every link rel sponsored, through /go with the placements inline-ebay and inline-tcg.
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/site.config";
import { goHref, ebaySearchUrl } from "@/lib/affiliate";
import type { AdTile } from "@/lib/card-ads";
import { ebayTilesFor, MAX_TILES, searchMarketOf, type AdPayload } from "@/lib/ad-pick";
import { money } from "@/lib/format";
import { useMarket } from "./ClientPrefs";
import { EbayWord } from "./EbayCallout";

/** The block's height on every screen: bar 36 + group head 28 + tile 244 + padding 22 (sideways scrolling, never wrapping, so it never changes). */
export const BLOCK_H = 330;
/** Tile picture width, in the 140 to 170px the owner asked for. */
export const PIC_W = 150;

export function TcgWord({ className = "" }: { className?: string }) {
  return (
    <span className={`font-black tracking-tight ${className}`} aria-label="TCGplayer">
      <span className="text-fg">TCG</span>
      <span style={{ color: "#4fa3ff" }}>player</span>
    </span>
  );
}

function Group({ brand, all, tiles, href, sub }: { brand: React.ReactNode; all: { href: string; label: string }; tiles: AdTile[]; href: (t: AdTile) => string; sub: string }) {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-l border-ink-700/60 pl-3 first:border-l-0 first:pl-0">
      <div className="flex h-[28px] items-center justify-between gap-3">
        {brand}
        <a href={all.href} rel="sponsored nofollow noopener" target="_blank" className="text-xs font-semibold text-muted hover:text-fg hover:underline">
          {all.label}
        </a>
      </div>
      <ul role="list" className="flex gap-3">
        {tiles.map((t) => (
          <li key={t.id} className="shrink-0" style={{ width: PIC_W }}>
            <a href={href(t)} rel="sponsored nofollow noopener" target="_blank" className="group block" title={`${t.name} · ${money(t.cents, t.currency)} · ${sub}`}>
              <span className="relative block overflow-hidden rounded-md bg-ink-850" style={{ width: PIC_W, height: 160 }}>
                {t.image && <img src={t.image} alt={t.name} width={PIC_W} height={160} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-1" />}
              </span>
              <span className="mt-1.5 line-clamp-2 block h-9 text-xs font-medium leading-[18px] group-hover:underline">{t.name}</span>
              <span className="block h-6 truncate text-sm font-bold leading-6 tabular-nums">{money(t.cents, t.currency)}</span>
              <span className="sr-only">, {sub}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InlineAds({ page = "page" }: { page?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AdPayload | null>(null);
  const [gone, setGone] = useState(false);
  const { market } = useMarket();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let live = true;
    const ask = () =>
      fetch("/api/rails")
        .then((r) => (r.ok ? r.json() : null))
        .then((j: AdPayload | null) => live && (j ? setData(j) : setGone(true)))
        .catch(() => live && setGone(true));
    if (typeof IntersectionObserver === "undefined") {
      ask();
      return () => {
        live = false;
      };
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          ask();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      live = false;
      io.disconnect();
    };
  }, []);
  if (gone) return null;
  const ebay = data ? ebayTilesFor(data.ads, market) : null;
  const tcg = data ? data.ads.tcgplayer.slice(0, MAX_TILES) : [];
  const showEbay = !!ebay && ebay.tiles.length >= 2;
  const showTcg = tcg.length >= 2;
  if (data && !showEbay && !showTcg) return null;
  const empty = !data;
  return (
    <div ref={ref} style={{ height: BLOCK_H }} aria-hidden={empty ? true : undefined}>
      {data && (
        <aside data-ad aria-label={`Sponsored: ${SITE.gameShort} on eBay and TCGplayer`} className="flex h-full flex-col overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900">
          <div className="flex h-9 shrink-0 items-center gap-2 px-3 text-[11px] text-muted">
            <span className="rounded bg-ink-800 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide">Ad</span>
            <span className="truncate">
              {SITE.name} may earn a commission from eBay and TCGplayer purchases, at no cost to you.
              {showEbay && ebay!.market !== market ? " eBay tiles from eBay US." : ""}
              {showTcg && market !== "US" ? " TCGplayer prices in US$." : ""}
            </span>
          </div>
          <div className="ad-scroll flex min-h-0 flex-1 gap-3 overflow-x-auto overflow-y-hidden px-3 pb-3">
            {showEbay && (
              <Group
                brand={<EbayWord className="text-lg" />}
                all={{ label: "All on eBay →", href: goHref({ url: ebaySearchUrl(data.adSearch.ebayQuery, searchMarketOf(ebay!.market)), source: "ebay", market: searchMarketOf(ebay!.market) }, undefined, `${page}-inline-ebay-all`) }}
                tiles={ebay!.tiles.slice(0, 6)}
                href={(t) => goHref({ url: t.url, source: "ebay", market: ebay!.market }, t.id, `${page}-inline-ebay`)}
                sub="eBay Buy It Now"
              />
            )}
            {showTcg && (
              <Group
                brand={<TcgWord className="text-[15px]" />}
                all={{ label: "All on TCGplayer →", href: goHref({ url: data.adSearch.tcgplayerUrl, source: "tcgplayer", market: "US" }, undefined, `${page}-inline-tcg-all`) }}
                tiles={tcg.slice(0, 6)}
                href={(t) => goHref({ url: t.url, source: "tcgplayer", market: "US" }, t.id, `${page}-inline-tcg`)}
                sub="TCGplayer market"
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
