import type { MetadataRoute } from "next";
import { meta, products, refCents, sets } from "@/lib/data";
import { posts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

// Cards worth listing: anything priced, plus every sealed product. Unpriced
// commons from old sets stay crawlable through the set pages but out of the
// sitemap (Rift Compare: thin pages in the sitemap slow indexing of the rest).
export default function sitemap(): MetadataRoute.Sitemap {
  const at = meta()?.updatedAt ? new Date(meta()!.updatedAt) : new Date();
  const fixed = ["", "/cards", "/sets", "/sealed", "/movers", "/deals", "/preorders", "/blog", "/about", "/methodology", "/stores"];
  return [
    ...fixed.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: at, changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.8 })),
    ...posts().map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.date), priority: 0.7 })),
    ...sets().filter((s) => s.productCount > 0).map((s) => ({ url: `${SITE_URL}/sets/${s.slug}`, lastModified: at, priority: 0.7 })),
    ...products()
      .filter((p) => p.kind === "sealed" || (refCents(p.id) ?? 0) >= 50)
      .map((p) => ({ url: `${SITE_URL}/card/${p.slug}`, lastModified: at, priority: 0.5 })),
  ];
}
