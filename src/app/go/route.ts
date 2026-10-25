// Every outbound buy link: tag it, log the click (best effort, never blocks the
// redirect), send the visitor on. Only known shop hosts are allowed, so /go is
// not an open redirect.
import { NextResponse } from "next/server";
import { SITE } from "@/site.config";
import { prisma, dbConfigured } from "@/lib/db";
import { subId, tagged } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

const ALLOWED = [
  /(^|\.)ebay\.(com|co\.uk|com\.au|ca|de|fr|it|es)$/i,
  /(^|\.)tcgplayer\.com$/i,
  /(^|\.)amazon\.(com|co\.uk|ca|com\.au)$/i,
  ...SITE.stores.map((s) => new RegExp(`(^|\\.)${new URL(s.base).hostname.replace(/^www\./, "").replace(/\./g, "\\.")}$`, "i")),
];

export async function GET(req: Request) {
  const u = new URL(req.url);
  const dest = u.searchParams.get("u") ?? "";
  let host = "";
  try {
    host = new URL(dest).hostname;
  } catch {}
  if (!host || !ALLOWED.some((r) => r.test(host)) || !/^https:\/\//.test(dest)) return NextResponse.redirect(new URL("/", req.url));
  const source = (u.searchParams.get("s") ?? "").slice(0, 40);
  const market = (u.searchParams.get("m") ?? "US").slice(0, 4);
  const pid = Number(u.searchParams.get("p")) || null;
  const page = (u.searchParams.get("from") ?? "").slice(0, 40) || null;
  if (dbConfigured() && !/bot|crawl|spider|slurp|preview/i.test(req.headers.get("user-agent") ?? "")) {
    await prisma.clickEvent.create({ data: { productId: pid, source, market, page }, select: { id: true } }).catch(() => {});
  }
  const res = NextResponse.redirect(tagged(dest, subId(page, pid)), 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
