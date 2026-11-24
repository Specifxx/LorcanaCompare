// Sort and filter on every listing (owner, 2026-11-23 UX review, P0 3 and 4; ported from DexCompare). Each tile carries its facts
// as data attributes (ProductTile: data-gp price in cents, data-gu % under TCGplayer's market, data-gn release date, data-gs set);
// GridControls reorders and hides the tiles in the browser. The server HTML keeps the page's one order, so crawlers and the first
// paint see one continuous list. Pure, for the tests.
export type GridSort = "default" | "price" | "price-desc" | "under" | "new";
export const GRID_SORTS: { key: GridSort; label: string }[] = [
  { key: "default", label: "Recommended" },
  { key: "price", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "under", label: "% under TCGplayer" },
  { key: "new", label: "Newest set" },
];

export interface GridItem {
  i: number; // the server order
  price: number | null;
  under: number | null; // percent under TCGplayer's market, positive = cheaper
  date: string | null;
  set: string;
}

export interface GridFilter {
  set?: string;
  /** [min, max) in cents; max null = no top. */
  band?: [number, number | null] | null;
  inStock?: boolean;
}

export function gridKeep(it: GridItem & { stock?: boolean }, f: GridFilter): boolean {
  if (f.set && it.set !== f.set) return false;
  if (f.inStock && it.stock === false) return false;
  if (f.band) {
    if (it.price == null) return false;
    if (it.price < f.band[0]) return false;
    if (f.band[1] != null && it.price >= f.band[1]) return false;
  }
  return true;
}

/** Items with no value for the chosen sort go last, in server order. */
export function gridOrder<T extends GridItem>(items: readonly T[], sort: GridSort): T[] {
  const val = (it: GridItem): number | null => {
    switch (sort) {
      case "default":
        return it.i;
      case "price":
        return it.price;
      case "price-desc":
        return it.price == null ? null : -it.price;
      case "under":
        return it.under == null || it.under <= 0 ? null : -it.under;
      case "new":
        return it.date ? -Date.parse(it.date) : null;
    }
  };
  return [...items].sort((a, b) => {
    const va = val(a);
    const vb = val(b);
    if (va == null && vb == null) return a.i - b.i;
    if (va == null) return 1;
    if (vb == null) return -1;
    return va - vb || a.i - b.i;
  });
}

/** Price bands in cents (US$ for TCGplayer's market): under 10, 10-50, 50-100, 100-250, 250 and up. */
export const PRICE_BANDS: [number, number | null][] = [
  [0, 1000],
  [1000, 5000],
  [5000, 10000],
  [10000, 25000],
  [25000, null],
];
export const BAND_LABELS = ["Under $10", "$10 to $50", "$50 to $100", "$100 to $250", "$250 and up"];

/** Listings this long or longer get the sort and filter bar. */
export const CONTROLS_MIN = 8;
