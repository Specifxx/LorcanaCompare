"use client";
// The gutter column (owner, 2026-11-25: "Why are the display ads at the very bottom of the site? … there's so much space on the left and
// the right side of the website"). The left side of a desktop page is the menu (SideNav), so only the RIGHT side of a wide window has
// room: ONE labelled TCGplayer column there, from the same CDN-held /api/rails answer the banners and the dock read. Unlike the old
// rails, the page column keeps its full width.
//
//   • Only where it fits: from GUTTER_MIN px wide, sized to the empty space right of the page (globals.css `.gutter-ads`), never over
//     the page, the header or the footer: it sits absolutely inside <main>, just past the page's right edge, and its card is sticky under the header.
//   • Browser only: nothing in the server HTML (no SEO change), absolutely placed, so nothing moves when it mounts (CLS 0).
//   • Labelled "Ad", rel sponsored through /go under `gutter-tcg` (and `-all`). TCGplayer only, never Amazon. Ad-free members get
//     nothing (html[data-adfree] [data-ad]), and neither do the ad-free pages (AdRouteGate).
//   • Static: nothing animates, opens or covers anything; the tiles scroll inside the card on a short window.
import { useEffect, useState } from "react";
import { goHref } from "@/lib/affiliate";
import type { AdTile } from "@/lib/card-ads";
import type { AdPayload } from "@/lib/ad-pick";
import { money } from "@/lib/format";
import { useMarket } from "./ClientPrefs";
import { BANNER_TILES } from "./InlineAds";

/** The narrowest window with room for the column right of the menu (15rem) and the 1280px page (about 110px, 14px clear of it). */
export const GUTTER_MIN = 1800;
const MAX = 8;

/** The tiles after the banner's own, so a page never shows the same product twice side by side; all of them when too few are left. Pure. */
export function pastBanner<T>(tiles: T[]): T[] {
  const rest = tiles.slice(BANNER_TILES);
  return (rest.length >= MAX / 2 ? rest : tiles).slice(0, MAX);
}

export function GutterAds() {
  const { market } = useMarket();
  const [wide, setWide] = useState(false);
  const [data, setData] = useState<AdPayload | null>(null);
  useEffect(() => {
    if (document.documentElement.matches("[data-adfree], .capacitor-native")) return;
    const mq = window.matchMedia(`(min-width: ${GUTTER_MIN}px)`);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!wide) return;
    let live = true;
    fetch("/api/rails")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: AdPayload | null) => live && setData(j))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [wide]);
  if (!wide || !data) return null;
  const tiles: AdTile[] = pastBanner(data.ads.tcgplayer.filter((t) => t.image));
  if (tiles.length < 2) return null;
  const us = market === "US";
  return (
    <div className="gutter-ads">
      <aside data-ad aria-label="Sponsored: TCGplayer" className="gutter-card rounded-xl border border-ink-700/60 bg-ink-900">
        <p className="flex shrink-0 items-center gap-1.5">
          <span className="rounded border border-ink-700 px-1.5 text-[11px] font-bold leading-[18px] text-muted">Ad</span>
          <span className="truncate text-sm font-bold tracking-tight">TCGplayer</span>
        </p>
        <p className="mt-0.5 shrink-0 truncate text-[11px] leading-4 text-muted">{us ? "Market prices" : "Prices in US$"}</p>
        <ul role="list" className="gutter-list">
          {tiles.map((t) => (
            <li key={t.id}>
              <a href={goHref({ url: t.url, source: "tcgplayer", market: "US" }, t.id, "gutter-tcg")} rel="sponsored nofollow noopener" target="_blank" className="group block" title={`${t.name} · ${money(t.cents, t.currency)}`}>
                <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-ink-850">
                  <img src={t.image!} alt={t.name} width={160} height={120} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-1" />
                </span>
                <span className="mt-1 line-clamp-2 block text-[11px] font-semibold leading-4 group-hover:underline">{t.name}</span>
                <span className="block truncate text-sm font-bold leading-[18px] tabular-nums">{us ? money(t.cents, t.currency) : `US${money(t.cents, t.currency)}`}</span>
                <span className="block truncate text-[10px] uppercase leading-[14px] tracking-wide text-muted">Market price</span>
              </a>
            </li>
          ))}
        </ul>
        <a href={goHref({ url: data.adSearch.tcgplayerUrl, source: "tcgplayer", market: "US" }, undefined, "gutter-tcg-all")} rel="sponsored nofollow noopener" target="_blank" className="mt-2 block shrink-0 rounded-full bg-fg px-2 py-1.5 text-center text-xs font-semibold text-ink-950 hover:opacity-85">
          See all <span aria-hidden="true">→</span>
          <span className="sr-only"> on TCGplayer</span>
        </a>
      </aside>
    </div>
  );
}
