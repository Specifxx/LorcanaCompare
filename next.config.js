/** @type {import('next').NextConfig} */
// Cost notes (mirrors Rift Compare, DECISIONS.md "Cached pages refresh every 6
// to 24 hours"): public pages read committed JSON under data/, never the
// database, so the data files must ship with every server function.
// One CDN copy per catalogue URL (site review X5, 2026-11-10; OP Compare since 2026-10-17, Gundam, YGO and BandaiCompare since
// their engine ports): the card, kit, set, sealed, hub and pre-order pages are `dynamic = "force-dynamic"` and Vercel's CDN keeps
// each rendered copy for a day, serving it stale for another day while one render refreshes it. No ISR write, no data-cache
// entry per page, nothing prerendered at build. The header never covers /go (a redirect per click) or /api.
const CDN_CACHE = "public, s-maxage=86400, stale-while-revalidate=86400";
const CDN_PAGES = ["/card/:slug", "/kit/:slug", "/sets/:slug", "/sealed/:type", "/cards/rarity/:slug", "/cards/:facet", "/cards/:facet/:slug", "/games/:slug", "/kits/grade/:grade", "/preorders/:slug"];

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Card art is served straight from TCGplayer's CDN at the size we ask for;
    // Vercel image optimisation is billed per source image, so it stays off.
    unoptimized: true,
  },
  experimental: {
    outputFileTracingIncludes: {
      // data/amazon: ASINs from the daily refresh; data/amazon-live: the prices this build fetched (lib/amazon-live.ts).
      "/**": ["./data/public/**/*", "./data/history/**/*", "./data/amazon/*.json", "./data/amazon-live/*.json"],
    },
  },
  async redirects() {
    return [{ source: "/deals", destination: "/tools/deal-finder", permanent: true }];
  },
  async headers() {
    return [
      ...CDN_PAGES.map((source) => ({ source, headers: [{ key: "Vercel-CDN-Cache-Control", value: CDN_CACHE }] })),
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
