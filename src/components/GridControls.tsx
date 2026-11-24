"use client";
// The sort and filter bar over a product grid (owner, 2026-11-23 UX review, P0 3; rules in lib/grid-sort.ts). Browser only: it
// reorders the grid's tiles with CSS `order` and hides the ones a filter leaves out. Nothing moves until the visitor picks.
import { useEffect, useRef, useState } from "react";
import { BAND_LABELS, GRID_SORTS, PRICE_BANDS, gridKeep, gridOrder, type GridFilter, type GridItem, type GridSort } from "@/lib/grid-sort";

const num = (v: string | undefined) => (v == null || v === "" ? null : Number(v));
type Row = GridItem & { stock: boolean };

export function GridControls({ gridId, sets, setsLabel = "sets" }: { gridId: string; sets: string[]; setsLabel?: string }) {
  const [sort, setSort] = useState<GridSort>("default");
  const [f, setF] = useState<GridFilter>({});
  const [shown, setShown] = useState<number | null>(null);
  const items = useRef<{ el: HTMLElement; it: Row }[]>([]);
  const total = useRef(0);

  useEffect(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    items.current = [...grid.querySelectorAll<HTMLElement>("[data-gp]")].map((el, i) => ({
      el,
      it: { i, price: num(el.dataset.gp), under: num(el.dataset.gu), date: el.dataset.gn || null, set: el.dataset.gs || "", stock: el.dataset.gk !== "0" },
    }));
    total.current = items.current.length;
  }, [gridId]);

  const active = sort !== "default" || !!(f.set || f.band || f.inStock);
  useEffect(() => {
    if (!items.current.length) return;
    const order = gridOrder(items.current.map((x) => x.it), sort);
    const pos = new Map(order.map((it, n) => [it.i, n]));
    let n = 0;
    for (const { el, it } of items.current) {
      const keep = gridKeep(it, f);
      if (keep) n++;
      el.style.display = keep ? "" : "none"; // not `hidden`: the tile's own `flex` class would win over it
      el.style.order = active ? String(pos.get(it.i)) : "";
    }
    setShown(active ? n : null);
  }, [sort, f, active]);

  const sel = "grid-ctl"; // globals.css: the site's own field look
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Sort and filter">
      <label className="flex items-center gap-1.5 text-sm text-muted">
        Sort
        <select className={sel} value={sort} onChange={(e) => setSort(e.target.value as GridSort)}>
          {GRID_SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      {sets.length > 1 && (
        <select aria-label={setsLabel} className={sel} value={f.set ?? ""} onChange={(e) => setF({ ...f, set: e.target.value || undefined })}>
          <option value="">All {setsLabel}</option>
          {sets.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      <select
        aria-label="Price"
        className={sel}
        value={f.band ? String(PRICE_BANDS.findIndex((b) => b[0] === f.band![0])) : ""}
        onChange={(e) => setF({ ...f, band: e.target.value === "" ? null : PRICE_BANDS[Number(e.target.value)] })}
      >
        <option value="">Any price</option>
        {BAND_LABELS.map((label, i) => (
          <option key={label} value={String(i)}>
            {label}
          </option>
        ))}
      </select>
      <label className="flex min-h-10 items-center gap-1.5 text-sm text-muted">
        <input type="checkbox" checked={!!f.inStock} onChange={(e) => setF({ ...f, inStock: e.target.checked || undefined })} />
        In stock only
      </label>
      {active && (
        <>
          <span className="text-sm text-muted" aria-live="polite">
            {shown} of {total.current}
          </span>
          <button type="button" className="text-sm font-semibold text-muted underline-offset-2 hover:text-ink hover:underline" onClick={() => (setSort("default"), setF({}))}>
            Reset
          </button>
        </>
      )}
    </div>
  );
}
