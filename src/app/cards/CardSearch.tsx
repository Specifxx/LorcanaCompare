"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FamilySearch } from "@/components/FamilySearch";

interface Hit { slug: string; href?: string; name: string; set: string; image: string | null; price: string; number: string | null; rarity: string | null }

export function CardSearch() {
  const q = useSearchParams().get("q") ?? "";
  const [hits, setHits] = useState<Hit[] | null>(null);
  useEffect(() => {
    if (!q) return setHits(null);
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=60`).then((r) => r.json()).then((d: { hits: Hit[] }) => setHits(d.hits));
  }, [q]);
  if (!q) return null;
  return (
    <section className="mt-8" aria-live="polite">
      <h2 className="mb-3 sec-title">Results for “{q}”</h2>
      {hits?.length === 0 && (
        // A friendly dead end (2026-11-14): what to try, then the main ways in.
        // As tall as the row of placeholder tiles it replaces, so the page below does not jump up.
        <div className="card-surface flex min-h-[20.5rem] flex-col justify-center p-5 sm:p-6">
          <p className="font-semibold">No cards match “{q}”.</p>
          <p className="mt-1 text-sm text-muted">Try fewer words, a character&apos;s name, or a card number like 12/204. Or browse:</p>
          <p className="mt-4 flex flex-wrap gap-2">
            <a className="btn-ghost" href="/sets">Every set</a>
            <a className="btn-ghost" href="/sealed">Sealed products</a>
            <a className="btn-ghost" href="/blog">Guides</a>
          </p>
        </div>
      )}
      <div className="tile-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {/* While the search runs, one row of empty tiles holds the place, so the results do not push the page down twice. */}
        {hits === null && Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`card-surface overflow-hidden ${["", "", "hidden sm:block", "hidden md:block", "hidden lg:block", "hidden min-[1440px]:block"][i]}`} aria-hidden="true">
            <div className="qv-shimmer aspect-[5/7]" />
            <div className="h-[4.75rem] p-2.5" />
          </div>
        ))}
        {hits?.map((h) => (
          <a key={h.href ?? h.slug} href={h.href ?? `/card/${h.slug}`} className="card-surface overflow-hidden transition-colors hover:border-brand/60">
            <div className="aspect-[5/7] bg-ink-850">{h.image && <img src={h.image.replace("_200w", "_400w")} alt={h.name} className="h-full w-full object-contain p-1.5" loading="lazy" />}</div>
            <div className="p-2.5">
              <p className="line-clamp-2 text-sm">{h.name}</p>
              <p className="truncate text-xs text-muted">{h.set}{h.number ? ` · ${h.number}` : ""}</p>
              <p className="font-bold text-brand-400">{h.price}</p>
            </div>
          </a>
        ))}
      </div>
      {hits === null && <p className="sr-only">Searching…</p>}
      {/* The same words on the other card-game sites (2026-10-28). */}
      {hits !== null && <FamilySearch q={q} className="mt-4" />}
    </section>
  );
}
