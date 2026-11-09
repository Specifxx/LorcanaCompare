import Link from "@/components/Link";
import type { MenuItem } from "@/lib/shop-nav";

// The header's dropdowns (xl and up; the left rail carries the same places from lg and the phone menu below it). CSS only: a
// panel opens on hover and while focus is inside it (tab to the heading and on into its links), so every link is a plain <a> in
// the server HTML for crawlers and no client state decides what a visitor can reach. The heading itself is a link too.
export function HeaderMenus({ menus }: { menus: MenuItem[] }) {
  return (
    <>
      {menus.map((m) => (
        <div key={m.label} className="group hidden xl:block">
          <Link href={m.href} className="rounded-full px-3 py-1.5 text-sm text-fg/85 hover:bg-ink-800 group-focus-within:bg-ink-800">
            {m.label} <span aria-hidden className="text-[10px] text-muted">▾</span>
          </Link>
          <div className="invisible absolute inset-x-4 top-full z-50 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
            <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-2xl border border-ink-700 bg-ink-900 p-5 shadow-lg" data-menu={m.label.toLowerCase()}>
              {m.columns.map((c) => (
                <div key={c.title} className="min-w-[10rem]">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{c.title}</p>
                  <ul className="space-y-0.5">
                    {c.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link href={l.href} className="block whitespace-nowrap rounded-lg px-2 py-1.5 text-sm text-fg hover:bg-ink-800">{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
