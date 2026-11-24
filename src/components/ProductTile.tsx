import Link from "@/components/Link";
import type { Product } from "@/lib/site-types";
import { imageAt } from "@/lib/image";
import { money, pct } from "@/lib/format";
import { refCents, setById, summaryOf } from "@/lib/data";
import { shortName } from "@/lib/names";
import { GridControls } from "./GridControls";
import { CONTROLS_MIN } from "@/lib/grid-sort";

export function ProductTile({ p, change }: { p: Product; change?: number | null }) {
  const ref = refCents(p.id);
  const e = summaryOf(p.id);
  const ch = change !== undefined ? change : e.change7d;
  const stores = e.inStockSources;
  const set = setById(p.setId)?.name;
  // The tile's facts for the listing's sort and filter bar (GridControls, lib/grid-sort.ts; owner, 2026-11-23 UX review, P0 3):
  // the price shown, % under TCGplayer's market for the cheapest in-stock US store, the set's release date and name.
  const us = e.best.find((o) => o.market === "US" && o.currency === "USD" && o.inStock && !["ebay", "tcgplayer", "amazon"].includes(o.source));
  const under = ref && us && us.cents < ref ? Math.round((1 - us.cents / ref) * 100) : null;
  return (
    <Link
      href={`/card/${p.slug}`}
      data-gp={ref ?? ""}
      data-gu={under ?? ""}
      data-gn={setById(p.setId)?.releasedOn ?? ""}
      data-gs={set ?? ""}
      data-gk={stores > 0 ? "1" : "0"}
      // A plain click opens the quick view (QuickView.tsx); the link itself stays for crawlers and new tabs.
      data-qv={p.slug}
      data-qv-name={shortName(p.name)}
      data-qv-sub={[set, p.number].filter(Boolean).join(" · ") || undefined}
      data-qv-img={p.image ? imageAt(p.image, "400w")! : undefined}
      className="group card-surface flex flex-col overflow-hidden transition hover:border-brand/60">
      <div className="aspect-[5/7] bg-ink-850">
        {p.image ? (
          <img src={imageAt(p.image, "400w")!} alt={`${shortName(p.name)} ${p.kind === "card" ? "card" : ""}`} loading="lazy" className="h-full w-full object-contain p-1.5 transition group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-xs text-muted">No image yet</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="line-clamp-2 text-sm font-medium text-fg">{shortName(p.name)}</p>
        <p className="truncate text-xs text-muted">{set}{p.number ? ` · ${p.number}` : ""}</p>
        <div className="mt-auto flex items-baseline justify-between pt-1">
          <span className="font-bold text-brand-400">{money(ref)}<span className="ml-1 text-[10px] font-normal text-muted">market</span></span>
          {ch != null && <span className={`text-xs ${ch >= 0 ? "text-up" : "text-down"}`}>{pct(ch)}</span>}
        </div>
        <p className="text-[11px] text-muted">{e.listedSources} store{e.listedSources === 1 ? "" : "s"} · {stores} in stock</p>
      </div>
    </Link>
  );
}

/** `controls`: a full listing of 8+ products gets the sort and filter bar (owner, 2026-11-23 UX review, P0 3); the server HTML keeps the page's one order. */
export function TileGrid({ items, controls }: { items: Product[]; controls?: string }) {
  const bar = !!controls && items.length >= CONTROLS_MIN;
  const id = bar ? `grid-${controls}` : undefined;
  const sets = bar ? [...new Set(items.map((p) => setById(p.setId)?.name).filter((x): x is string => !!x))].sort() : [];
  return (
    <>
      {bar && <GridControls gridId={id!} sets={sets} />}
      <div id={id} className="tile-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((p) => <ProductTile key={p.id} p={p} />)}
      </div>
    </>
  );
}
