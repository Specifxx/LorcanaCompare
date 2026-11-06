// The side rails' tiles (components/SideAds.tsx): the site's ten leading products on eBay (per market) and TCGplayer, the same
// selection as the card ad pair (lib/card-ads.ts: newest sets first, then value). Asked by the browser only once a rail is
// mounted on a wide screen, never in the server HTML. A function response held by Vercel's CDN for six hours, like the pages;
// the data only changes with a release.
import { NextResponse } from "next/server";
import { adSearch, cardAds } from "@/lib/card-ads";

export const dynamic = "force-dynamic";

/** Tiles per rail (owner, 2026-11-06: "scrollable … up to 10 products"). */
const RAIL_TILES = 10;

export function GET() {
  return NextResponse.json({ ads: cardAds({ limit: RAIL_TILES }), adSearch: adSearch() }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
}
