// Every public page reads these committed files, never the database (the Rift
// Compare PUBLIC_DATA_MODE=files lesson, made the only mode here). They ship
// with the deployment (next.config.js outputFileTracingIncludes) and are read
// once per server instance.
import fs from "node:fs";
import path from "node:path";
import type { Catalog, EbayPick, Meta, PriceEntry, Prices, Product, SetInfo } from "./site-types";
import { referenceCents } from "./import/tcgcsv";
import type { Series } from "./series";

const DIR = path.join(process.cwd(), "data");

function read<T>(rel: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, rel), "utf8")) as T;
  } catch {
    return fallback;
  }
}

let cache: {
  catalog: Catalog;
  prices: Prices;
  meta: Meta | null;
  picks: EbayPick[];
  bySlug: Map<string, Product>;
  byId: Map<number, Product>;
  setBySlug: Map<string, SetInfo>;
  setById: Map<number, SetInfo>;
} | null = null;

function load() {
  if (cache) return cache;
  const catalog = read<Catalog>("public/catalog.json", { generatedAt: "", sets: [], products: [] });
  const prices = read<Prices>("public/prices.json", { generatedAt: "", byId: {} });
  cache = {
    catalog,
    prices,
    meta: read<Meta | null>("public/meta.json", null),
    picks: read<EbayPick[]>("public/ebay-picks.json", []),
    bySlug: new Map(catalog.products.map((p) => [p.slug, p])),
    byId: new Map(catalog.products.map((p) => [p.id, p])),
    setBySlug: new Map(catalog.sets.map((s) => [s.slug, s])),
    setById: new Map(catalog.sets.map((s) => [s.id, s])),
  };
  return cache;
}

export const sets = () => load().catalog.sets;
export const products = () => load().catalog.products;
export const meta = () => load().meta;
export const ebayPicks = () => load().picks;
export const productBySlug = (slug: string) => load().bySlug.get(slug) ?? null;
export const productById = (id: number) => load().byId.get(id) ?? null;
export const setBySlug = (slug: string) => load().setBySlug.get(slug) ?? null;
export const setById = (id: number) => load().setById.get(id) ?? null;

const EMPTY: PriceEntry = { tcg: {}, offers: [], change7d: null, change30d: null };
export const priceOf = (id: number): PriceEntry => load().prices.byId[id] ?? EMPTY;
export const refCents = (id: number): number | null => referenceCents(priceOf(id).tcg);

export function historyOf(p: Product): Series {
  const h = read<Record<string, Series>>(`history/${p.setId}.json`, {});
  return h[p.id] ?? [];
}

export function productsInSet(setId: number) {
  return products().filter((p) => p.setId === setId);
}

export function byValue(list: Product[]) {
  return list
    .map((p) => ({ p, v: refCents(p.id) ?? -1 }))
    .sort((a, b) => b.v - a.v)
    .map((x) => x.p);
}

/** Released sets, newest first, that have cards (no promo / token groups first). */
export function mainSets() {
  return sets().filter((s) => s.productCount > 0);
}

export function latestReleasedSet(): SetInfo | null {
  return (
    sets().find((s) => !s.upcoming && productsInSet(s.id).filter((p) => p.kind === "card").length > 60) ?? null
  );
}
export function nextUpcomingSet(): SetInfo | null {
  const up = sets().filter((s) => s.upcoming).sort((a, b) => (a.releasedOn ?? "").localeCompare(b.releasedOn ?? ""));
  return up[0] ?? null;
}

export interface Mover {
  p: Product;
  cents: number;
  change: number;
}
export function movers(days: 7 | 30 = 7, minCents = 200): { up: Mover[]; down: Mover[] } {
  const rows: Mover[] = [];
  for (const p of products()) {
    const e = priceOf(p.id);
    const c = days === 7 ? e.change7d : e.change30d;
    const cents = refCents(p.id);
    if (c == null || cents == null || cents < minCents) continue;
    rows.push({ p, cents, change: c });
  }
  return {
    up: rows.filter((r) => r.change > 0).sort((a, b) => b.change - a.change).slice(0, 50),
    down: rows.filter((r) => r.change < 0).sort((a, b) => a.change - b.change).slice(0, 50),
  };
}

export interface Deal {
  p: Product;
  offer: PriceEntry["offers"][number];
  market: number;
  saving: number; // percent below TCGplayer market
}
/** In-stock store/eBay offers below TCGplayer market (USD offers only, so the
 *  comparison is like-for-like). */
export function deals(limit = 40): Deal[] {
  const out: Deal[] = [];
  for (const p of products()) {
    const market = refCents(p.id);
    if (!market || market < 500) continue;
    for (const o of priceOf(p.id).offers) {
      if (o.source === "tcgplayer" || !o.inStock || o.currency !== "USD") continue;
      if (o.printing && o.printing !== "Normal" && priceOf(p.id).tcg.Normal) continue;
      const saving = Math.round((1 - o.cents / market) * 100);
      if (saving >= 8 && saving <= 60) out.push({ p, offer: o, market, saving });
    }
  }
  return out.sort((a, b) => b.market * b.saving - a.market * a.saving).slice(0, limit);
}
