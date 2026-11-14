"use client";
// The phone menu (below lg): a "Menu" button at the start of the section row opens a full-height sheet with every group of the
// rail (lib/nav.ts navGroups, one source list), the first group open and the rest folded. Native <dialog>: focus is trapped,
// Escape closes it. The links are plain <a> in the server HTML, so nothing here decides what crawlers or visitors can reach;
// the region is not asked first (owner, 2026-11-09).
import { useRef } from "react";
import Link from "@/components/Link";
import type { NavGroup } from "@/lib/nav";

export function MobileMenu({ groups }: { groups: NavGroup[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-ink-800 px-3.5 text-sm font-semibold text-fg transition-colors hover:bg-ink-700" aria-haspopup="dialog">
        ☰ Menu
      </button>
      <dialog ref={ref} aria-label="Site menu" onClick={(e) => { if (e.target === ref.current) close(); }} className="m-0 h-full max-h-none w-[min(22rem,92vw)] max-w-none bg-ink-950 p-0 text-fg backdrop:bg-black/60">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-800 bg-ink-950 px-4 py-3">
          <p className="font-display text-base font-black">Browse</p>
          <button type="button" onClick={close} className="rounded-full px-3 py-1 text-sm text-muted hover:bg-ink-800" aria-label="Close menu">Close ✕</button>
        </div>
        <div className="px-3 pb-10">
          {groups.map((g, i) => (
            <details key={g.title} open={i < 2} className="border-b border-ink-800/70 py-1">
              <summary className="cursor-pointer list-none px-2 py-3 text-xs font-bold uppercase tracking-wider text-muted">{g.title}</summary>
              <ul className="pb-2">
                {g.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} onClick={close} className="block rounded-lg px-2 py-2.5 text-[15px] text-fg/90 hover:bg-ink-800">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </dialog>
    </>
  );
}
