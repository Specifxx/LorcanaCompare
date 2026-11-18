"use client";
// The two big ad banners (owner, 2026-11-14: "separate big ad banners for TCGplayer and eBay"), replacing the one mixed block of
// 2026-11-13. One banner for eBay and one for TCGplayer, side by side from lg and stacked below it, each with its own "Ad" label,
// a big "Browse on …" button and up to four real listings (eBay Buy It Now in the visitor's market, TCGplayer's market price).
//
//   • At the TOP of every page: directly under the hero on the home page, under the page header elsewhere (owner, 2026-11-14).
//   • Browser only: the server HTML holds two empty, aria-hidden boxes of the banners' exact height (CLS 0, nothing indexed); once a
//     box nears the viewport the tiles are asked from /api/rails (CDN-cached six hours) and drawn into it. A side with no tiles keeps
//     its height and shows the button alone; a failed fetch closes the boxes.
//   • One of each per page, never beside a buy button, never in the quick view, no pop-up, nothing floating, only these two retailers, eBay never
//     marked best. Every link is rel sponsored, through /go under `<page>-banner-ebay` / `<page>-banner-tcg` (and `-all`).
import { useEffect, useRef, useState } from "react";
import { applyAdLook } from "@/lib/ad-look";
import { SITE } from "@/site.config";
import { goHref, ebaySearchUrl } from "@/lib/affiliate";
import type { AdTile } from "@/lib/card-ads";
import { ebayTilesFor, searchMarketOf, type AdPayload } from "@/lib/ad-pick";
import { money } from "@/lib/format";
import { useMarket } from "./ClientPrefs";

/** The banner's height, reserved in the server HTML: head 44 + tiles 148 + note 14 + padding and gaps. */
export const BANNER_H = 252;
/** Tiles a banner draws. */
export const BANNER_TILES = 4;

function Banner({ brand, headline, cta, ctaHref, note, tiles, tileHref, line }: { brand: string; headline: string; cta: string; ctaHref: string; note: string; tiles: AdTile[]; tileHref: (t: AdTile) => string; line: string }) {
  return (
    <aside data-ad aria-label={`Sponsored: ${headline}`} className="flex flex-col overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 p-3 sm:p-4" style={{ height: BANNER_H }}>
      <div className="flex h-11 shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2">
            <span className="rounded border border-ink-700 px-1.5 text-[11px] font-bold leading-[18px] text-muted">Ad</span>
            <span className="text-base font-bold tracking-tight">{brand}</span>
          </p>
          <p className="mt-0.5 truncate text-xs text-muted">{headline}</p>
        </div>
        <a href={ctaHref} rel="sponsored nofollow noopener" target="_blank" className="shrink-0 whitespace-nowrap rounded-full bg-fg px-4 py-2 text-xs font-semibold text-ink-950 hover:opacity-85 sm:text-sm">
          {cta} →
        </a>
      </div>
      <ul role="list" className="ad-scroll mt-3 flex h-[148px] shrink-0 gap-3 overflow-x-auto overflow-y-hidden">
        {tiles.map((t) => (
          <li key={t.id} className="w-[128px] shrink-0">
            <a href={tileHref(t)} rel="sponsored nofollow noopener" target="_blank" className="group flex h-full flex-col" title={`${t.name} · ${money(t.cents, t.currency)}`}>
              <span className="relative block h-[76px] w-full overflow-hidden rounded-md bg-ink-850">
                {t.image && <img src={t.image} alt={t.name} width={120} height={76} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-1" />}
              </span>
              <span className="mt-1 line-clamp-2 block h-8 text-[11px] font-semibold leading-4 group-hover:underline">{t.name}</span>
              <span className="block h-[18px] truncate text-sm font-bold leading-[18px] tabular-nums">{money(t.cents, t.currency)}</span>
              <span className="block h-3.5 truncate text-[10px] uppercase leading-[14px] tracking-wide text-muted">{line}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-auto h-3.5 truncate text-[11px] leading-[14px] text-muted">{note}</p>
    </aside>
  );
}

export function InlineAds({ page = "page" }: { page?: string }) {
  useEffect(() => applyAdLook(), []);
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
  const tcg = data ? data.ads.tcgplayer.filter((t) => t.image).slice(0, BANNER_TILES) : [];
  const eTiles = ebay ? ebay.tiles.filter((t) => t.image).slice(0, BANNER_TILES) : [];
  const sm = ebay ? searchMarketOf(ebay.market) : "US";
  return (
    <div ref={ref} className="grid gap-3 lg:grid-cols-2" aria-hidden={data ? undefined : true}>
      {data ? (
        <>
          <Banner
            brand="eBay"
            headline={`${SITE.gameShort} on eBay · live Buy It Now listings`}
            cta="Browse on eBay"
            ctaHref={goHref({ url: ebaySearchUrl(data.adSearch.ebayQuery, sm), source: "ebay", market: sm }, undefined, `${page}-banner-ebay-all`)}
            note={`Sponsored: ${SITE.name} may earn a commission from eBay purchases, at no cost to you.${ebay!.market !== market ? " Listings from eBay US." : ""}`}
            tiles={eTiles}
            tileHref={(t) => goHref({ url: t.url, source: "ebay", market: ebay!.market }, t.id, `${page}-banner-ebay`)}
            line="Buy It Now"
          />
          <Banner
            brand="TCGplayer"
            headline={`${SITE.gameShort} on TCGplayer · market prices`}
            cta="Browse on TCGplayer"
            ctaHref={goHref({ url: data.adSearch.tcgplayerUrl, source: "tcgplayer", market: "US" }, undefined, `${page}-banner-tcg-all`)}
            note={`Sponsored: ${SITE.name} may earn a commission from TCGplayer purchases, at no cost to you.${market !== "US" ? " Prices in US$." : ""}`}
            tiles={tcg}
            tileHref={(t) => goHref({ url: t.url, source: "tcgplayer", market: "US" }, t.id, `${page}-banner-tcg`)}
            line="Market price"
          />
        </>
      ) : (
        <>
          <div style={{ height: BANNER_H }} />
          <div style={{ height: BANNER_H }} />
        </>
      )}
    </div>
  );
}
