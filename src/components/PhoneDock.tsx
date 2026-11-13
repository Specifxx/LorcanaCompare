"use client";
// The phone dock (owner, 2026-11-06): the eBay and TCGplayer tiles in one bar along the foot of a screen narrower than MIN_WIDTH,
// after a scroll, never on a card page. AdDock.tsx has the rules; it yields to every ad unit ([data-ad], the in-page block included).
// The side rails this file once held are gone (owner, 2026-11-13); wide screens get the in-page block (InlineAds.tsx) instead.
import { useEffect, useState } from "react";
import { SITE } from "@/site.config";
import { goHref } from "@/lib/affiliate";
import { money } from "@/lib/format";
import { ebayTilesFor, MAX_TILES, type AdPayload } from "@/lib/ad-pick";
import { useMarket } from "./ClientPrefs";
import { EbayWord } from "./EbayCallout";
import { AdDock, DockGate, DockTile, DOCK_LINK, type DockSide } from "./AdDock";

/** Narrower than this the phone dock is used; wider, the page's own block. */
export const MIN_WIDTH = 1280;

type Payload = AdPayload;

export function PhoneDockAds() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const update = () => setNarrow(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (!narrow) return null;
  return (
    <DockGate minWidth={MIN_WIDTH}>
      <PhoneDock />
    </DockGate>
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
