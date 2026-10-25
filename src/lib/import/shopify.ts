// Reads a Shopify store's collection through its public products.json — the
// same discovery path Rift Compare's importer uses for every Shopify store.
// 250 products a page; we stop at the first short page.
import type { StoreConfig } from "@/lib/site-types";
import { fetchJson, sleep } from "./http";

export interface ShopifyVariant {
  id: number;
  title: string;
  price: string;
  available: boolean;
  option1?: string | null;
}
export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  tags: string[] | string;
  product_type: string;
  variants: ShopifyVariant[];
}

export interface StoreItem {
  title: string;
  url: string;
  cents: number;
  inStock: boolean;
  variantTitle: string;
  tags: string[];
  productType: string;
}

const MAX_PAGES = 40;
// A variant title that is only a condition / language / finish choice. Any
// other variant title ("GD05 / R+") names a different printing and becomes
// its own item.
const CONDITION_ONLY = /^(default title|near mint|nm|nm-m|mint|lightly played|lp|moderately played|mp|heavily played|hp|damaged|dmg|played|excellent|good|english|en|foil|non-foil|normal|cold foil|holo|holofoil|[^/]*\b(nm|lp|mp|hp|near mint|played)\b[^/]*)$/i;
const BAD_CONDITION = /damaged|heavily|\bhp\b|\bdmg\b|poor|played\b(?!.*near)/i;

/** One offer per product: the cheapest in-stock Near Mint-ish variant, or the
 *  cheapest variant at all when nothing is in stock. */
export function pickVariant(p: ShopifyProduct): ShopifyVariant | null {
  const ok = p.variants.filter((v) => !BAD_CONDITION.test(v.title || ""));
  const pool = ok.length ? ok : p.variants;
  const inStock = pool.filter((v) => v.available);
  const list = (inStock.length ? inStock : pool).slice().sort((a, b) => Number(a.price) - Number(b.price));
  return list[0] ?? null;
}

export async function fetchStore(store: StoreConfig): Promise<StoreItem[]> {
  const seen = new Set<number>();
  const out: StoreItem[] = [];
  for (const handle of store.collections) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${store.base}/collections/${handle}/products.json?limit=250&page=${page}`;
      const data = await fetchJson<{ products: ShopifyProduct[] }>(url);
      for (const p of data.products) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        const tags = Array.isArray(p.tags) ? p.tags : String(p.tags || "").split(",").map((t) => t.trim());
        const printingVariants = p.variants.filter((v) => !CONDITION_ONLY.test((v.title || "").trim()));
        const groups: { title: string; variants: ShopifyVariant[] }[] =
          printingVariants.length > 1 && printingVariants.length === p.variants.length
            ? printingVariants.map((v) => ({ title: `${p.title} ${v.title}`, variants: [v] }))
            : [{ title: p.title, variants: p.variants }];
        for (const g of groups) {
          const v = pickVariant({ ...p, variants: g.variants });
          if (!v) continue;
          const cents = Math.round(Number(v.price) * 100);
          if (!Number.isFinite(cents) || cents <= 0) continue;
          out.push({
            title: g.title,
            url: `${store.base}/products/${p.handle}?variant=${v.id}`,
            cents,
            inStock: v.available,
            variantTitle: v.title === "Default Title" ? "" : v.title,
            tags,
            productType: p.product_type || "",
          });
        }
      }
      if (data.products.length < 250) break;
      await sleep(800);
    }
  }
  return out;
}
