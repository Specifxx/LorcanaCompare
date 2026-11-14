// The search results' placeholder row (2026-11-14 review), shared by the server's Suspense fallback and CardSearch's
// loading state so they are the same height: a /cards?q= visit no longer jumps when the client takes over.
// No headings and no words here: the server HTML of /cards keeps exactly its indexed text and h2 outline.

const SHOW = ["", "", "hidden sm:block", "hidden md:block", "hidden lg:block", "hidden min-[1440px]:block"];

export function SearchPlaceholderTiles() {
  return (
    <>
      {SHOW.map((c, i) => (
        <div key={i} className={`card-surface overflow-hidden ${c}`} aria-hidden="true">
          <div className="qv-shimmer aspect-[5/7]" />
          <div className="h-[4.75rem] p-2.5" />
        </div>
      ))}
    </>
  );
}

/** The server's stand-in for CardSearch: hidden unless the boot script saw a ?q= on /cards (`html[data-search]`, globals.css). */
export function SearchSlot() {
  return (
    <div className="search-slot mt-8" aria-hidden="true">
      <p className="mb-3 sec-title">&nbsp;</p>
      <div className="tile-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"><SearchPlaceholderTiles /></div>
    </div>
  );
}
