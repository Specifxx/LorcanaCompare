import Link from "@/components/Link";
import { SearchBox } from "@/components/SearchBox";

// A friendly dead end (2026-11-14): say what happened in one line, offer the search, and give the main ways back in.
const WAYS = [
  { href: "/", label: "Home" },
  { href: "/cards", label: "All cards" },
  { href: "/sets", label: "Sets" },
  { href: "/sealed", label: "Sealed" },
  { href: "/blog", label: "Guides" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-12 text-center sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-muted">404</p>
      <h1 className="page-title mt-2">Page not found</h1>
      <p className="page-lede mx-auto">That page has moved or never existed. Search for the card instead:</p>
      <div className="mt-6 text-left"><SearchBox big /></div>
      <nav aria-label="Ways back" className="mt-8 flex flex-wrap justify-center gap-2">
        {WAYS.map((w) => <Link key={w.href} href={w.href} className="btn-ghost">{w.label}</Link>)}
      </nav>
    </div>
  );
}
