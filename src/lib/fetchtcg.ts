// Fetch TCG's price of a Disney Lorcana card in Australia (owner, 2026-11-11; Fetch's partner feed). Read by the card
// page and drawn as a labelled marketplace row after eBay and Amazon: never a store, never the cheapest, a deal, an
// alert, the feed, history or a basket line.
//
// Fetch's terms (Dhanish Semar, 2026-10-28): the feed is for showing Fetch's prices with a link back, and may not be
// passed on. So the 95 MB feed is NEVER committed (data/ is public with the source): scripts/fetch-fetchtcg.ts runs
// first in every build, keeps only Lorcana and writes data/fetch-live/au.json, git-ignored, which this file reads.
// Links are used exactly as Fetch sends them (they already carry our referral tag).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export interface FetchLiveCard {
  /** set name as Fetch writes it */
  s: string;
  /** collector number, "100/204" */
  no: string;
  /** card name */
  n: string;
  /** "Normal" | "Cold Foil" */
  f: string;
  /** condition the price is for (Near Mint, else the best raw condition) */
  c: string;
  /** AUD cents */
  p: number;
  /** Fetch's own page, tracked, used as sent */
  u: string;
}
export interface FetchLiveFile {
  fetchedAt: string;
  cards: FetchLiveCard[];
}
export interface FetchRow {
  /** "Normal" | "Cold Foil" */
  finish: string;
  condition: string;
  priceCents: number;
  url: string;
}
export interface FetchRows {
  rows: FetchRow[];
  /** ISO time the build fetched the feed */
  at: string;
}

export const FETCH_LIVE_FILE = path.join("data", "fetch-live", "au.json");
/** Fetch's prices are ignored once the file is older than this (the page copy is kept a day plus a day by the CDN). */
export const FETCH_MAX_AGE_MS = 3 * 86400e3;

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9+]+/g, "");

/** "001/204" and "1/204" are the same number. */
const numKey = (n: string) => n.toUpperCase().replace(/\s+/g, "").replace(/(^|\/)0+(?=\d)/g, "$1");

let cache: { index: Map<string, FetchLiveCard[]>; at: string } | null | undefined;

function load(): typeof cache {
  if (cache !== undefined) return cache;
  cache = null;
  try {
    const file = path.join(process.cwd(), FETCH_LIVE_FILE);
    if (!existsSync(file)) return cache;
    const f = JSON.parse(readFileSync(file, "utf8")) as FetchLiveFile;
    if (!f || !Array.isArray(f.cards) || typeof f.fetchedAt !== "string") return cache;
    if (Date.now() - Date.parse(f.fetchedAt) > FETCH_MAX_AGE_MS) return cache;
    const index = new Map<string, FetchLiveCard[]>();
    for (const c of f.cards) {
      const k = numKey(c.no);
      const a = index.get(k);
      if (a) a.push(c);
      else index.set(k, [c]);
    }
    cache = { index, at: f.fetchedAt };
  } catch {
    cache = null;
  }
  return cache;
}

/**
 * Fetch's listings of exactly this card: the same collector number in the same set AND the same name. One row per finish
 * (Normal, Cold Foil), each the cheapest in-stock Fetch listing; two Fetch cards on one number with different names is
 * no row: a wrong price is worse than none.
 */
export function fetchRowsFor(card: { name: string; number: string | null; setName: string | null }): FetchRows | null {
  const l = load();
  if (!l || !card.number || !card.setName) return null;
  const hits = l.index.get(numKey(card.number));
  if (!hits) return null;
  const named = hits.filter((h) => norm(h.s) === norm(card.setName!));
  if (!named.length || named.some((h) => norm(h.n) !== norm(card.name))) return null;
  const rows: FetchRow[] = [];
  for (const finish of ["Normal", "Cold Foil"]) {
    const h = named.filter((x) => x.f === finish).sort((a, b) => a.p - b.p)[0];
    if (h && h.p > 0) rows.push({ finish, condition: h.c, priceCents: h.p, url: h.u });
  }
  return rows.length ? { rows, at: l.at } : null;
}

const GRADED = /^(psa|cgc|becketts|tag|pcg)\b/i;

/** Cents from Fetch's AUD price (a number in dollars). */
export const cents = (dollars: number) => Math.round(dollars * 100);

/** Near Mint if listed, else the cheapest raw (not graded, not Damaged) condition. */
export function pickCondition(conds: { condition: string; price: number }[]): { condition: string; price: number } | null {
  const raw = conds.filter((c) => c && typeof c.price === "number" && c.price > 0 && !GRADED.test(c.condition) && !/damaged/i.test(c.condition));
  const nm = raw.filter((c) => /^(near mint|mint)$/i.test(c.condition)).sort((a, b) => a.price - b.price)[0];
  return nm ?? raw.sort((a, b) => a.price - b.price)[0] ?? null;
}
