// TCGplayer catalogue and prices through TCGCSV (tcgcsv.com), which mirrors
// TCGplayer's catalog API as static JSON once a day (~20:00 UTC). No key, no
// quota: three requests per set.
import { SITE } from "@/site.config";
import type { Product, SetInfo, TcgPrice } from "@/lib/site-types";
import { slugify } from "@/lib/slug";
import { fetchJson, sleep } from "./http";

const BASE = "https://tcgcsv.com/tcgplayer";

interface Group {
  groupId: number;
  name: string;
  abbreviation: string | null;
  publishedOn: string;
}
interface RawProduct {
  productId: number;
  name: string;
  imageUrl: string;
  groupId: number;
  url: string;
  presaleInfo?: { isPresale: boolean; releasedOn: string | null };
  extendedData: { name: string; value: string }[];
}
interface RawPrice {
  productId: number;
  lowPrice: number | null;
  midPrice: number | null;
  marketPrice: number | null;
  subTypeName: string;
}

const KEEP_ATTRS = new Set([
  "InkType",
  "CardType",
  "Cost Ink",
  "Property",
  "Classification",
  "Color",
  "Cost",
  "Level",
  "Trait",
  "Attack Points",
  "Hit Points",
  "Zone",
]);

export function sealedTypeOf(name: string): string {
  const n = name.toLowerCase();
  // Pack fillers TCGplayer lists as products (puzzle pieces, lore cards, ink
  // drop and other tokens): not sealed product, never worth an eBay call.
  if (/puzzle insert|lore card|ink drop|\btokens?\b|\binsert\b|code card/.test(n)) return "Insert";
  if (/\bcase\b/.test(n)) return "Case";
  if (/trove/.test(n)) return "Illumineer's Trove";
  if (/starter (deck|set)|starter decks/.test(n)) return "Starter Deck";
  if (/prerelease/.test(n)) return "Prerelease";
  if (/booster (box|display)|collector booster display/.test(n)) return "Booster Box";
  if (/sleeved booster/.test(n)) return "Sleeved Pack";
  if (/booster pack|\bpack\b/.test(n)) return "Booster Pack";
  if (/gift|collection|bundle|set of|tin/.test(n)) return "Collection";
  if (/deck/.test(n)) return "Deck";
  return "Other";
}

function cents(v: number | null | undefined): number | null {
  return v == null || !Number.isFinite(v) ? null : Math.round(v * 100);
}


export async function loadTcgcsv(now = new Date()): Promise<{
  sets: SetInfo[];
  products: Product[];
  tcg: Record<number, Record<string, TcgPrice>>;
}> {
  const cat = SITE.tcgcsvCategoryId;
  const groups = (await fetchJson<{ results: Group[] }>(`${BASE}/${cat}/groups`)).results;
  const sets: SetInfo[] = [];
  const products: Product[] = [];
  const tcg: Record<number, Record<string, TcgPrice>> = {};
  const usedSlugs = new Set<string>();

  for (const g of groups) {
    const [prods, prices] = await Promise.all([
      fetchJson<{ results: RawProduct[] }>(`${BASE}/${cat}/${g.groupId}/products`),
      fetchJson<{ results: RawPrice[] }>(`${BASE}/${cat}/${g.groupId}/prices`),
    ]);
    const setSlug = slugify(g.name);
    const released = g.publishedOn ? g.publishedOn.slice(0, 10) : null;
    sets.push({
      id: g.groupId,
      name: g.name,
      code: g.abbreviation || setSlug,
      slug: setSlug,
      releasedOn: released,
      productCount: prods.results.length,
      upcoming: !!released && new Date(released) > now,
    });
    const printings = new Map<number, Set<string>>();
    for (const p of prices.results) {
      (tcg[p.productId] ??= {})[p.subTypeName] = {
        market: cents(p.marketPrice),
        low: cents(p.lowPrice),
        mid: cents(p.midPrice),
      };
      if (!printings.has(p.productId)) printings.set(p.productId, new Set());
      printings.get(p.productId)!.add(p.subTypeName);
    }
    for (const p of prods.results) {
      const ext = Object.fromEntries(p.extendedData.map((e) => [e.name, e.value]));
      const isCard = !!ext.Number;
      let slug = slugify(p.name) || String(p.productId);
      if (usedSlugs.has(slug)) slug = `${slug}-${setSlug}`;
      if (usedSlugs.has(slug)) slug = `${slug}-${p.productId}`;
      usedSlugs.add(slug);
      const attrs: Record<string, string> = {};
      for (const [k, v] of Object.entries(ext)) if (KEEP_ATTRS.has(k) && v) attrs[k] = String(v).replace(/<[^>]+>/g, "");
      products.push({
        id: p.productId,
        slug,
        name: p.name,
        kind: isCard ? "card" : "sealed",
        setId: g.groupId,
        number: ext.Number ?? null,
        rarity: ext.Rarity && ext.Rarity !== "None" ? ext.Rarity : null,
        attrs,
        sealedType: isCard ? null : sealedTypeOf(p.name),
        image: p.imageUrl || null,
        tcgUrl: p.url,
        printings: [...(printings.get(p.productId) ?? [])],
      });
    }
    await sleep(150);
  }
  sets.sort((a, b) => (b.releasedOn ?? "").localeCompare(a.releasedOn ?? ""));
  return { sets, products, tcg };
}

/** The headline USD price of a product: the lowest printing's market price,
 *  falling back to mid then low. Normal printing first when it is priced. */
export function referenceCents(t: Record<string, TcgPrice> | undefined): number | null {
  if (!t) return null;
  const pick = (p: TcgPrice) => p.market ?? p.mid ?? p.low;
  if (t.Normal && pick(t.Normal) != null) return pick(t.Normal);
  const vals = Object.values(t)
    .map(pick)
    .filter((v): v is number => v != null);
  return vals.length ? Math.min(...vals) : null;
}
