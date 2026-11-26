// Best Basket: price a pasted list, or a shared list's product ids (/list), for one market. Since 2026-11-25 the answer also
// carries the shipping-aware split (lib/basket-split.ts): its totals for everyone, its store-by-store plan only when RiftCompare's
// sister-premium status says this browser's token is a Premium member right now, so the plan is withheld in the RESPONSE.
import { NextResponse } from "next/server";
import { bestMatch, parseLine } from "@/lib/lookup";
import { priceBasket } from "@/lib/tools";
import { productById, productBySlug } from "@/lib/data";
import { decodeList } from "@/lib/share";
import { readSlugs } from "@/lib/shortlist-basket";
import { splitBasket } from "@/lib/basket-split";
import { PREMIUM_SERVICE } from "@/lib/premium-member";
import { SITE_URL } from "@/lib/site";
import { CURRENCY, MARKETS, type Market } from "@/lib/site-types";

export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

/** Is this browser's token a Premium member right now? false on any doubt (the visitor still gets the totals). */
async function isPremium(token: unknown): Promise<boolean> {
  if (typeof token !== "string" || token.length > 4096 || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) return false;
  try {
    const r = await fetch(`${PREMIUM_SERVICE}/api/sister-premium/status`, {
      method: "POST",
      // RiftCompare answers only this site's origin (exact-origin rule); the token itself is what it checks.
      headers: { "Content-Type": "application/json", Origin: new URL(SITE_URL).origin },
      body: JSON.stringify({ token }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const j = (await r.json().catch(() => ({}))) as { ok?: boolean; premium?: boolean };
    return r.ok && j.ok === true && j.premium === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const { text, ids, slugs, market, token } = (await req.json().catch(() => ({}))) as { text?: string; ids?: string; slugs?: unknown; market?: string; token?: unknown };
  const m: Market = MARKETS.includes(market as Market) ? (market as Market) : "US";
  const shortlist = readSlugs(slugs);
  const lines = shortlist
    ? shortlist.map((l) => {
        const p = productBySlug(l.slug);
        return { qty: l.qty, id: p?.id ?? null, query: p?.name ?? l.slug };
      })
    : typeof ids === "string"
      ? decodeList(ids).map((l) => ({ qty: l.qty, id: l.id, query: productById(l.id)?.name ?? `#${l.id}` }))
      : String(text ?? "")
          .split(/\r?\n/)
          .slice(0, 100)
          .map(parseLine)
          .filter((x): x is { qty: number; query: string } => !!x)
          .map((l) => ({ ...l, id: bestMatch(l.query)?.id ?? null }));
  const priced = priceBasket(lines, m);
  const premium = await isPremium(token);
  const s = splitBasket(lines, m, CURRENCY[m]);
  const split = premium ? { premium: true, summary: s.summary, plan: s.plan, alternatives: s.alternatives } : { premium: false, summary: s.summary };
  return NextResponse.json({ ...priced, split }, { headers });
}
