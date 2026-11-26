// BEST BASKET READS THE SHORTLIST (QA guard, 2026-11-27). A visitor who saves store rows to the shortlist and then opens
// /tools/best-basket used to find an empty paste box: the tool only priced a pasted list. Now the shortlist's products
// (each line's own product page, `/card/<slug>`) are priced on arrival, one product per slug with the quantities summed.
// Pure: the browser read is `readCart()` in Basket.tsx, the lookup `productBySlug` in /api/basket.
import type { CartLine } from "./cart-list";

export const SHORTLIST_MAX = 100;

/** The products on the shortlist, by our own page slug, quantities summed. Lines added from another page are skipped. */
export function shortlistSlugs(lines: readonly Pick<CartLine, "page" | "qty">[]): { slug: string; qty: number }[] {
  const out = new Map<string, number>();
  for (const l of lines) {
    const m = /^\/card\/([a-z0-9][a-z0-9-]*)\/?$/i.exec(String(l.page ?? "").split(/[?#]/)[0]);
    if (!m) continue;
    const qty = Number.isFinite(l.qty) && l.qty > 0 ? Math.floor(l.qty) : 1;
    out.set(m[1], Math.min(99, (out.get(m[1]) ?? 0) + qty));
  }
  return [...out].slice(0, SHORTLIST_MAX).map(([slug, qty]) => ({ slug, qty }));
}

/** The request body's `slugs`, checked: well-formed slugs only, at most SHORTLIST_MAX. */
export function readSlugs(v: unknown): { slug: string; qty: number }[] | null {
  if (!Array.isArray(v)) return null;
  return v
    .filter((x): x is { slug: string; qty: number } => !!x && typeof x.slug === "string" && /^[a-z0-9][a-z0-9-]{0,200}$/i.test(x.slug))
    .slice(0, SHORTLIST_MAX)
    .map((x) => ({ slug: x.slug, qty: Number.isInteger(x.qty) && x.qty > 0 ? Math.min(99, x.qty) : 1 }));
}
