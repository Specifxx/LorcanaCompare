import { SITE } from "@/site.config";

// Titles the way Rift Compare writes them (its card and set pages, DECISIONS.md
// "Titles that fit"): Google cuts a title around 60 characters, so each page
// offers a ladder of candidates, longest and most specific first, and takes the
// first that fits. Each candidate is tried with " | <site>" and then bare, so a
// title keeps the brand when it fits and never gives up words people search for it.

export const TITLE_MAX = 60;

/** The first candidate that fits, as an absolute title (the layout's template would add the brand again). */
export function fitTitle(candidates: string[], max = TITLE_MAX): { absolute: string } {
  const suffix = ` | ${SITE.name}`;
  for (const t of candidates) {
    if (`${t}${suffix}`.length <= max) return { absolute: `${t}${suffix}` };
    if (t.length <= max) return { absolute: t };
  }
  return { absolute: candidates[candidates.length - 1] };
}

/** "Card List: All 120 Cards + Prices" for a set page, the phrase Rift Compare's set pages rank for. */
export function setTitleCandidates(setName: string, cardCount: number, upcoming = false): string[] {
  const g = SITE.gameShort;
  const named = setName.toLowerCase().includes(g.toLowerCase()) ? setName : `${g} ${setName}`;
  // Spoiler season (Rift Compare's best non-brand searches, "riftbound legacy spoilers"): until release day a set with
  // revealed cards is titled for the spoiler search; release day turns it back into the card list at the same URL.
  if (upcoming && cardCount > 0)
    return [`${named} Spoilers: ${cardCount} Cards Revealed + Prices`, `${named} Spoilers: ${cardCount} Cards Revealed`, `${setName} Spoilers: ${cardCount} Cards Revealed`, `${setName} Spoilers`];
  return [
    ...(cardCount > 0 ? [`${named} Card List: All ${cardCount} Cards + Prices`, `${setName} Card List: All ${cardCount} Cards + Prices`] : []),
    `${named} Card List & Prices`,
    `${setName} Card List & Prices`,
    `${setName} Card List`,
  ];
}

/** "<Card> <number> Price — <game> <set>", stepping down to the card and its number. */
export function cardTitleCandidates(name: string, number: string | null, setName: string | null, sealed: boolean): string[] {
  const g = SITE.gameShort;
  // Store names often carry the number already ("Jagd Doga (GD05-057)"): say it once.
  const bare = number ? name.replace(` (${number})`, "") : name;
  const head = number && !sealed && !bare.includes(number) ? `${bare} ${number}` : bare;
  const out: string[] = [];
  if (setName && !bare.includes(setName)) out.push(`${head} Price — ${g} ${setName}`, `${head} Price — ${setName}`);
  out.push(`${head} Price — ${g}`, `${head} Price`, head);
  return out;
}

// Meta descriptions (2026-11-07, Bing's "meta description too short" in the owner's SEO audit): search engines show
// about 120–160 characters, so every page's description is fitted into that window. A short one gains true sentences
// about the site (the first that are not already said and still fit); a long one ends at its last full sentence inside
// 160, or at a word with an ellipsis. Never invents a fact about the page itself.
export const DESC_MIN = 120;
export const DESC_MAX = 160;

/** Site-wide facts a short description can end with, each skipped when the text already says it. */
export function descriptionTails(): { text: string; said: RegExp }[] {
  return [
    { text: `Compare ${SITE.stores.length} ${SITE.gameShort} stores, TCGplayer and eBay.`, said: /\bstores?\b/i },
    { text: "Prices updated daily, in your currency.", said: /\bdaily\b/i },
    { text: "Cheapest in-stock price first.", said: /cheapest/i },
    { text: "Free, no account needed.", said: /\bfree\b|no account/i },
    { text: `${SITE.name}: ${SITE.game} price comparison.`, said: new RegExp(SITE.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
  ];
}

/** `base` fitted to 120–160 characters (DESC_MIN–DESC_MAX). */
export function fitDescription(base: string, tails = descriptionTails()): string {
  let out = base.replace(/\s+/g, " ").trim();
  if (out && !/[.!?…]$/.test(out)) out += ".";
  for (const t of tails) {
    if (out.length >= DESC_MIN) break;
    if (t.said.test(out)) continue;
    const next = out ? `${out} ${t.text}` : t.text;
    if (next.length <= DESC_MAX) out = next;
  }
  if (out.length <= DESC_MAX) return out;
  const cut = out.slice(0, DESC_MAX + 1);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (stop + 1 >= DESC_MIN) return out.slice(0, stop + 1);
  return `${out.slice(0, DESC_MAX - 1).replace(/[\s,;:—–-]+\S*$/, "")}…`;
}
