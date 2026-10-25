// Matches a store's product title to a catalogue product. Pure (no I/O), so
// tests/match.test.ts can pin it against real store titles.
//
// The rule that matters most is the same one Rift Compare learned the hard way:
// a WRONG match is worse than no match. A wrong match puts a $3 common's price
// on a $300 Enchanted card's page with a buy button on it. So every match needs
// the card number AND the name, and a tie between two products is no match.
import type { Product, SetInfo } from "@/lib/site-types";
import { tokens } from "@/lib/slug";
import { sealedTypeOf } from "./tcgcsv";

const STOP = new Set([
  "the", "a", "of", "and", "disney", "lorcana", "tcg", "card", "game", "gundam", "single", "singles",
  "english", "en", "nm", "near", "mint", "foil", "holo", "holofoil", "cold", "normal", "non",
  "booster", "set", "chapter",
]);

// Words that mark a variant printing on the product name itself. A title that
// lacks the product's marker (or carries one the product lacks) is a different
// product — "Elsa (Enchanted)" vs "Elsa", "Gundam (LR+)" vs "Gundam".
const VARIANT_MARKERS = [
  "enchanted", "iconic", "epic", "promo", "alternate", "alt", "parallel", "lr+", "lr++", "r+", "u+",
  "c+", "c++", "oversized", "jumbo", "serialized", "signature", "showcase",
];

export interface MatchIndex {
  byNumber: Map<string, Product[]>;
  /** "setId|n" → products, for titles that give "(0017)" and name the set elsewhere. */
  bySetNumber: Map<string, Product[]>;
  /** "setId|full normalised name" → products, for titles with no number at all. */
  bySetName: Map<string, Product[]>;
  /** set code ("13", "Q1") and name initials ("TFC") → set ids */
  setByCode: Map<string, number[]>;
  sealed: Product[];
  setName: Map<number, string[]>;
  style: "fraction" | "code";
}

export function numberKey(n: string, style: "fraction" | "code"): string | null {
  if (style === "code") {
    const m = n.toUpperCase().match(/\b([A-Z]{1,4}\d{0,2}[A-Z]?)-(\d{2,3}[A-Z]?)\b/);
    return m ? `${m[1]}-${m[2].padStart(3, "0")}` : null;
  }
  const m = n.match(/(\d{1,3})[a-z]?\s*\/\s*(P?\d{1,3})/i);
  if (m) return `${parseInt(m[1], 10)}/${m[2].toUpperCase().replace(/^0+/, "")}`;
  return null;
}

/** Every number-looking token in a store title. */
export function numbersInTitle(title: string, style: "fraction" | "code"): string[] {
  const out = new Set<string>();
  if (style === "code") {
    for (const m of title.toUpperCase().matchAll(/\b([A-Z]{1,4}\d{0,2}[A-Z]?)-(\d{2,3}[A-Z]?)\b/g))
      out.add(`${m[1]}-${m[2].padStart(3, "0")}`);
  } else {
    for (const m of title.matchAll(/(\d{1,3})[a-z]?\s*\/+\s*(P?\d{1,3}|[A-Z]{1,3}\d{0,3})(?![A-Za-z])/gi))
      out.add(`${parseInt(m[1], 10)}/${m[2].toUpperCase().replace(/^0+/, "")}`);
  }
  return [...out];
}

function baseName(name: string): string[] {
  const all = tokens(name.replace(/\([^)]*\)/g, " ").replace(/\[[^\]]*\]/g, " "));
  const kept = all.filter((t) => !STOP.has(t));
  // "Gundam" alone is a real card name: never let the stop list empty it.
  return kept.length ? kept : all;
}

function markers(s: string): Set<string> {
  const lower = s.toLowerCase();
  const out = new Set<string>();
  for (const m of VARIANT_MARKERS) {
    const re = m.includes("+")
      ? new RegExp(`(^|[^a-z+])${m.replace(/\+/g, "\\+")}(?!\\+)`)
      : new RegExp(`\\b${m}\\b`);
    if (re.test(lower)) out.add(m);
  }
  return out;
}

const GENERIC_ALT = ["parallel", "alt", "alternate"];

/** Do the title's variant words describe this product's variant? A generic
 *  "parallel" / "alt art" in the title stands for whichever "+" rarity the
 *  product carries (Gundam's LR+, R+…). */
export function markersAgree(productName: string, rarity: string | null, title: string): boolean {
  const pm = markers(productName);
  const tm = markers(title);
  const rarityWord = (rarity ?? "").toLowerCase();
  const generic = GENERIC_ALT.some((g) => tm.has(g));
  for (const g of GENERIC_ALT) tm.delete(g);
  const productPlus = [...pm].filter((m) => m.includes("+"));
  const productAlt = GENERIC_ALT.some((g) => pm.has(g));
  for (const g of GENERIC_ALT) pm.delete(g);
  if (generic) {
    if (!productPlus.length && !productAlt) return false;
    if (![...tm].some((m) => m.includes("+"))) for (const m of productPlus) tm.add(m);
  } else if (productAlt) {
    return false;
  }
  for (const m of pm) if (!tm.has(m)) return false;
  for (const m of tm) if (!pm.has(m) && m !== rarityWord) return false;
  return true;
}

export function buildIndex(products: Product[], sets: SetInfo[], style: "fraction" | "code"): MatchIndex {
  const byNumber = new Map<string, Product[]>();
  const bySetNumber = new Map<string, Product[]>();
  const bySetName = new Map<string, Product[]>();
  const sealed: Product[] = [];
  for (const p of products) {
    if (p.kind === "sealed") {
      sealed.push(p);
      continue;
    }
    const nk = `${p.setId}|${tokens(p.name).join(" ")}`;
    if (!bySetName.has(nk)) bySetName.set(nk, []);
    bySetName.get(nk)!.push(p);
    const k = p.number ? numberKey(p.number, style) : null;
    if (!k) continue;
    if (!byNumber.has(k)) byNumber.set(k, []);
    byNumber.get(k)!.push(p);
    const bare = parseInt(k, 10);
    if (style === "fraction" && bare) {
      const sk = `${p.setId}|${bare}`;
      if (!bySetNumber.has(sk)) bySetNumber.set(sk, []);
      bySetNumber.get(sk)!.push(p);
    }
  }
  const setName = new Map(sets.map((s) => [s.id, tokens(s.name).filter((t) => !STOP.has(t))]));
  const setByCode = new Map<string, number[]>();
  const addCode = (c: string, id: number) => {
    const k = c.toUpperCase();
    if (!k) return;
    if (!setByCode.has(k)) setByCode.set(k, []);
    if (!setByCode.get(k)!.includes(id)) setByCode.get(k)!.push(id);
  };
  for (const st of sets) {
    addCode(st.code, st.id);
    const words = st.name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
    if (words.length >= 2) addCode(words.map((w) => w[0]).join(""), st.id);
  }
  return { byNumber, bySetNumber, bySetName, setByCode, sealed, setName, style };
}

function overlap(need: string[], have: Set<string>): number {
  if (!need.length) return 0;
  return need.filter((t) => have.has(t)).length / need.length;
}

export interface MatchResult {
  product: Product;
  score: number;
}

// Non-English product. The catalogue (TCGplayer) is English; a Japanese box
// at a third of the price on an English box's page is the classic bad match.
const FOREIGN = /\b(japanese|japan|jp|chinese|simplified|traditional|french|fran[cç]ais|german|deutsch|italian|italiano|spanish|espa[nñ]ol|korean|portuguese|\(fr\)|\(de\)|\(it\)|\(jp\)|\(cn\))\b/i;
export const isForeign = (title: string) => FOREIGN.test(title);

// Multiples: "(Pair)", "Bundle of 2", "Set of 4", "x2". A title and a product
// must agree on whether they are a multiple.
const MULTI = /\b(pair|bundle of \d+|set of \d+|\d+\s*x|x\s*\d+|\d+[- ]pack bundle|lot of)\b/i;
const isMulti = (s: string) => MULTI.test(s.replace(/\b\d+\s*packs?\)/i, ""));

/** Titles that give the card's number in the set but not "n/total":
 *    "99 Puppies (3-024)"            set code - number
 *    "Ariel - On Human Legs [TFC-1]" set initials - number
 *    "1TFC-059, L, Ursula" / "[14HPC-132]"  code + initials - number
 *    "Elsa - The Fifth Spirit (48)"  bare number; the set comes from the
 *                                    tags / product type (its name or code)
 *  The name check in matchCard still has to pass. */
function fractionFallback(title: string, context: string, idx: MatchIndex): Product[] {
  const out: Product[] = [];
  const add = (setIds: number[] | undefined, n: number) => {
    for (const id of setIds ?? []) for (const p of idx.bySetNumber.get(`${id}|${n}`) ?? []) if (!out.includes(p)) out.push(p);
  };
  const coded = title.match(/(?:^|[\s(\[])(\d{1,2})?([A-Z]{2,5})?-(\d{1,3})(?=[\s)\],]|$)/);
  if (coded && (coded[1] || coded[2])) {
    const n = parseInt(coded[3], 10);
    if (coded[1]) add(idx.setByCode.get(coded[1]), n);
    if (!out.length && coded[2]) add(idx.setByCode.get(coded[2]), n);
    if (out.length) return out;
  }
  const bare = title.match(/\((\d{1,4})\)|#(\d{1,4})\b/);
  const n = bare ? parseInt(bare[1] ?? bare[2], 10) : 0;
  if (!n) return out;
  const ctxText = `${title} ${context}`;
  const ctx = new Set(tokens(ctxText));
  for (const [setId, setTokens] of idx.setName)
    if (setTokens.length && setTokens.every((t) => ctx.has(t))) add([setId], n);
  if (!out.length) {
    // A tag that is exactly a set code ("12"), as some stores tag the set.
    for (const tag of context.split(/\s{2,}|,|\|/).map((t) => t.trim())) add(idx.setByCode.get(tag.toUpperCase()), n);
    for (const t of context.split(/\s+/)) if (/^(\d{1,2}|Q\d)$/i.test(t)) add(idx.setByCode.get(t.toUpperCase()), n);
  }
  return out;
}

/** `context` is extra text that may name the set (Shopify product_type / tags). */
export function matchCard(title: string, idx: MatchIndex, context = ""): MatchResult | null {
  if (isForeign(title)) return null;
  const have = new Set(tokens(title));
  const scored: MatchResult[] = [];
  let candidates = [...new Set(numbersInTitle(title, idx.style).flatMap((n) => idx.byNumber.get(n) ?? []))];
  if (!candidates.length && idx.style === "fraction") candidates = fractionFallback(title, context, idx);
  if (!candidates.length && !numbersInTitle(title, idx.style).length) {
    // No number anywhere: only an EXACT full-name match inside a set the
    // tags / product type name, and only when exactly one product fits.
    const ctx = new Set(tokens(context));
    const want = tokens(title).join(" ");
    const hits: Product[] = [];
    for (const [setId, setTokens] of idx.setName)
      if (setTokens.length && setTokens.every((t) => ctx.has(t))) hits.push(...(idx.bySetName.get(`${setId}|${want}`) ?? []));
    return hits.length === 1 ? { product: hits[0], score: 1 } : null;
  }
  {
    for (const p of candidates) {
      const nameScore = overlap(baseName(p.name), have);
      if (nameScore < 0.6) continue;
      if (!markersAgree(p.name, p.rarity, title)) continue;
      const setScore = overlap(idx.setName.get(p.setId) ?? [], have);
      scored.push({ product: p, score: nameScore + 0.5 * setScore });
    }
  }
  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  if (scored.length > 1 && Math.abs(scored[0].score - scored[1].score) < 0.01) return null;
  return scored[0];
}

export function matchSealed(title: string, idx: MatchIndex): MatchResult | null {
  if (isForeign(title)) return null;
  const have = new Set(tokens(title).filter((t) => !STOP.has(t) || t === "booster"));
  const type = sealedTypeOf(title);
  const scored: MatchResult[] = [];
  for (const p of idx.sealed) {
    if (sealedTypeOf(p.name) !== type) continue;
    if (isMulti(p.name) !== isMulti(title)) continue;
    const setTokens = idx.setName.get(p.setId) ?? [];
    if (setTokens.length && overlap(setTokens, have) < 1) continue;
    const need = tokens(p.name).filter((t) => !STOP.has(t));
    const s = overlap(need, have);
    // Near-complete: "Collector Booster Display" must not take a plain
    // "Booster Display" (one missing word of four is 0.75).
    if (s < (need.length >= 6 ? 0.8 : 0.99)) continue;
    // Penalise title words the product name lacks (e.g. "case", "bundle of 4").
    const extra = [...have].filter((t) => !need.includes(t) && !/^\d+$/.test(t) && !STOP.has(t)).length;
    scored.push({ product: p, score: s - 0.05 * extra });
  }
  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  if (scored.length > 1 && Math.abs(scored[0].score - scored[1].score) < 0.01) return null;
  return scored[0];
}

export function printingOf(title: string, variantTitle = ""): string {
  const s = `${title} ${variantTitle}`.toLowerCase();
  if (/cold\s*foil/.test(s)) return "Cold Foil";
  if (/non[-\s]?foil/.test(s)) return "Normal";
  if (/\bfoil\b|holo/.test(s)) return "Foil";
  return "Normal";
}

export function isPreorder(title: string, tags: string[] = []): boolean {
  return /pre[-\s]?order|presale|pre[-\s]?sale/i.test(`${title} ${tags.join(" ")}`);
}

export function looksSealed(title: string, productType = ""): boolean {
  return /booster|display|\bbox\b|\bcase\b|\bpack\b|starter|deck|trove|gift set|collection|bundle|prerelease/i.test(
    `${title} ${productType}`,
  ) && !numbersInTitle(title, "fraction").length && !numbersInTitle(title, "code").length;
}
