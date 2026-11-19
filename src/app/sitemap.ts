import { LINES } from "@/lib/lines";
import type { MetadataRoute } from "next";
import { meta, priceOf, products, refCents, setById, sets, storeCountOf } from "@/lib/data";
import { cardAsksIndex } from "@/lib/indexing";
import { searchFound } from "@/lib/search-demand";
import { posts } from "@/lib/posts";
import { attrFacets, preorderSetList, rarityHubs, sealedHubs } from "@/lib/hubs";
import { preorderPath } from "@/lib/preorders";
import { SITE_URL } from "@/lib/site";
import { creatorsOn } from "@/lib/creators";
import { SITE } from "@/site.config";
import { gradeHubs, kits } from "@/lib/kits";
import { withoutOffSeasonSales } from "@/lib/sale-seasons";

export const revalidate = 86400;

// Cards worth listing: anything priced, plus every sealed product. Unpriced
// commons from old sets stay crawlable through the set pages but out of the
// sitemap (Rift Compare: thin pages in the sitemap slow indexing of the rest).
// So are sealed "Insert" products (Lorcana's puzzle inserts and ink drops,
// a few cents each: 157 of Lorcana's 1,364 sitemap URLs on 2026-10-28); their
// pages are noindex too (card/[slug]).
// Pages whose words do not change with the day's prices carry no lastmod: dating them "today" on every build is the
// re-dating to look fresh that Google's guidance calls search-engine-first (search-engine-first audit, 2026-11-19).
const PROSE_PAGES = new Set(["/about", "/methodology", "/list-your-store", "/how-we-pick-stores", "/creators", "/embed", "/tools/selling-fees"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const at = meta()?.updatedAt ? new Date(meta()!.updatedAt) : new Date();
  const fixed = ["", "/cards", "/sets", "/sealed", "/movers", "/hot-100", "/price-report", "/black-friday", "/cyber-monday", ...withoutOffSeasonSales(["/boxing-day", "/january-sales"], new Date().toISOString().slice(0, 10)), "/embed", "/tools", "/daily", "/tools/deal-finder", "/tools/is-this-a-good-price", "/tools/rising", "/tools/demand", "/tools/best-basket", "/tools/trade", "/tools/selling-fees", "/preorders", "/blog", "/about", "/methodology", "/stores", "/how-we-pick-stores", "/list-your-store", ...(creatorsOn() ? ["/creators"] : [])];
  return [
    ...fixed.map((p) => ({ url: `${SITE_URL}${p}`, ...(PROSE_PAGES.has(p) ? {} : { lastModified: at }), changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.8 })),
    ...preorderSetList().map((s) => ({ url: `${SITE_URL}${preorderPath(s)}`, lastModified: at, changeFrequency: "daily" as const, priority: 0.8 })),
    ...posts().map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.date), priority: 0.7 })),
    ...rarityHubs().map((h) => ({ url: `${SITE_URL}/cards/rarity/${h.slug}`, lastModified: at, priority: 0.6 })),
    ...sealedHubs().map((h) => ({ url: `${SITE_URL}/sealed/${h.slug}`, lastModified: at, priority: 0.6 })),
    // Attribute hubs (SITE.cardHubs): each facet's index and every value with enough cards.
    ...attrFacets().flatMap((f) => [
      { url: `${SITE_URL}/cards/${f.cfg.facet}`, lastModified: at, priority: 0.6 },
      ...f.hubs.map((h) => ({ url: `${SITE_URL}/cards/${f.cfg.facet}/${h.slug}`, lastModified: at, priority: 0.6 })),
    ]),
    // Multi-game sites (SITE.lines): the games index and one hub per game.
    ...(LINES.length ? ["/games", ...LINES.map((l) => `/games/${l.slug}`)].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: at, changeFrequency: "daily" as const, priority: 0.9 })) : []),
    ...sets().filter((s) => s.productCount > 0).map((s) => ({ url: `${SITE_URL}/sets/${s.slug}`, lastModified: at, priority: 0.7 })),
    ...products()
      .filter((p) => (p.kind === "sealed" ? p.sealedType !== "Insert" : (refCents(p.id) ?? 0) >= (SITE.sitemapMinCardCents ?? 50)))
      // Only pages that ask to be indexed (lib/indexing.ts cardAsksIndex, 2026-11-19).
      .filter((p) => cardAsksIndex(p, refCents(p.id), priceOf(p.id).offers.length, storeCountOf(p.id), setById(p.setId), searchFound(`/card/${p.slug}`)))
      .map((p) => ({ url: `${SITE_URL}/card/${p.slug}`, lastModified: at, priority: 0.5 })),
    // Model kits (SITE.kits): the hub, a page per grade and per kit.
    ...(SITE.kits && kits().length
      ? [
          { url: `${SITE_URL}/kits`, lastModified: at, changeFrequency: "daily" as const, priority: 0.8 },
          ...gradeHubs().map((h) => ({ url: `${SITE_URL}/kits/grade/${h.slug}`, lastModified: at, priority: 0.6 })),
          ...kits().map((k) => ({ url: `${SITE_URL}/kit/${k.slug}`, lastModified: at, priority: 0.5 })),
        ]
      : []),
  ];
}
