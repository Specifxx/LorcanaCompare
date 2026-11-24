// Typo-tolerant search (owner, 2026-11-23 UX review, P0 5: "charizard" found 15 products, "charizrd" none; ported from
// DexCompare). A word that matches nothing is replaced by the nearest word the catalogue knows: one edit for a 4-6 letter word,
// two for 7+, swapping two letters counts once; ties go to the word on the most products. Pure, for the tests.

/** Edit distance with adjacent swaps, giving up (max + 1) once it passes `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let best = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      best = Math.min(best, d[i][j]);
    }
    if (best > max) return max + 1;
  }
  return d[a.length][b.length];
}

export const allowedEdits = (w: string) => (w.length >= 7 ? 2 : w.length >= 4 ? 1 : 0);

/**
 * The query words with each word the catalogue does not know swapped for its closest known word, or null when every word is
 * known or one has no close match. `freq` is every catalogue word and how many products carry it; `known(w)` says whether a
 * word already matches (whole or as the start of a longer word).
 */
export function suggestWords(words: readonly string[], freq: ReadonlyMap<string, number>, known: (w: string) => boolean): string[] | null {
  if (!words.length) return null;
  let changed = false;
  const out: string[] = [];
  for (const w of words) {
    if (known(w)) {
      out.push(w);
      continue;
    }
    const max = allowedEdits(w);
    if (!max) return null;
    let pick: string | null = null;
    let pickD = max + 1;
    let pickF = 0;
    for (const [t, n] of freq) {
      if (t.length < 3) continue;
      const d = editDistance(w, t, max);
      if (d > max) continue;
      if (d < pickD || (d === pickD && n > pickF)) {
        pick = t;
        pickD = d;
        pickF = n;
      }
    }
    if (!pick) return null;
    out.push(pick);
    changed = true;
  }
  return changed ? out : null;
}

// Shorthand buyers type (owner's review: "synonyms (ETB, UPC, BB)"), expanded before the search. Only shorthand this game's
// products use (ETB and UPC are Pokémon's; "SD" is a Gunpla grade, so it stays as typed); a set code is never touched.
export const ALIASES: Record<string, string[]> = {
  bb: ["booster", "box"],
  boosterbox: ["booster", "box"],
  bbox: ["booster", "box"],
  boosters: ["booster"],
};
export function expandAliases(words: readonly string[]): string[] {
  return words.flatMap((w) => ALIASES[w] ?? [w]);
}
