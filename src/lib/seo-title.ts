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

/**
 * "<Card> <number> Price: $X — <set>" when the card has a TCGplayer market price (2026-11-24, page scorecard Job D: card
 * pages ranking 3rd to 9th with no clicks in 28 days; Gundam Compare's titles carry the price since 2026-11-10), stepping
 * down to the card and its price, then the card without its number, then the old price-less ladder.
 */
export function cardTitleCandidates(name: string, number: string | null, setName: string | null, sealed: boolean, price: string | null = null): string[] {
  const g = SITE.gameShort;
  // Store names often carry the number already ("Jagd Doga (GD05-057)"): say it once.
  const bare = number ? name.replace(` (${number})`, "") : name;
  const head = number && !sealed && !bare.includes(number) ? `${bare} ${number}` : bare;
  const named = setName && !bare.includes(setName);
  const out: string[] = [];
  if (price) {
    if (named) out.push(`${head} Price: ${price} — ${g} ${setName}`, `${head} Price: ${price} — ${setName}`);
    out.push(`${head} Price: ${price}`);
    if (head !== bare) out.push(`${bare} Price: ${price}`);
  }
  if (named) out.push(`${head} Price — ${g} ${setName}`, `${head} Price — ${setName}`);
  out.push(`${head} Price — ${g}`, `${head} Price`, head);
  return out;
}

const IN_MARKET: Record<string, string> = { US: "in the US", UK: "in the UK", CA: "in Canada", AU: "in Australia", EU: "in Europe", SG: "in Singapore" };

/**
 * A card or sealed page's meta description (2026-11-24, page scorecard Job D; ported from Gundam Compare #247). The old
 * one read "Mulan - Martial Arts Master (Enchanted) (Hyperia City, Enchanted) is worth about $99.52 today. Compare 53
 * live prices from TCGplayer, eBay and Lorcana stores": the rarity twice and a count mixing eBay, TCGplayer and every
 * market. It now leads with the cheapest in-stock STORE price, US first, else the first market with stock (named), and
 * how many stores have it in stock there, then TCGplayer's market as the reference, then set and rarity (said once).
 * Stores only in the lead: never eBay, TCGplayer, Amazon or a pre-order. Longest first; `firstThatFits` takes the
 * first that fits.
 */
export function cardDescriptionCandidates(o: {
  name: string;
  number: string | null;
  setName: string | null;
  rarity: string | null;
  sealed: boolean;
  /** TCGplayer market price, formatted ("$99.52"). */
  ref: string | null;
  /** The cheapest in-stock store price and its market, formatted. */
  lead: { price: string; market: string; inStockStores: number } | null;
  /** Stores that list it at all (any market, in stock or not). */
  stores: number;
}): string[] {
  const g = SITE.gameShort;
  const bare = o.number ? o.name.replace(` (${o.number})`, "") : o.name;
  const head = o.number && !o.sealed && !bare.includes(o.number) ? `${bare} ${o.number}` : bare;
  // Say the rarity once: names already carry it ("Mulan - Martial Arts Master (Enchanted)").
  const rarity = o.rarity && !bare.includes(`(${o.rarity})`) ? o.rarity : null;
  const where = [o.setName, rarity].filter(Boolean).join(", ");
  const what = o.sealed ? `${g} sealed product` : `${g} card`;
  const about = where ? `${what} from ${where}` : what;
  const n = (k: number, w: string) => `${k} ${w}${k === 1 ? "" : "s"}`;
  const ref = o.ref ? `TCGplayer market ${o.ref}` : null;
  const out: string[] = [];
  if (o.lead) {
    const lead = `${head} from ${o.lead.price} ${IN_MARKET[o.lead.market] ?? `in ${o.lead.market}`}, in stock at ${n(o.lead.inStockStores, "store")}`;
    const refPart = ref ? `; ${ref}` : "";
    out.push(
      `${lead}${refPart}. ${about}, compared across ${n(o.stores, "store")} with price history.`,
      `${lead}${refPart}. ${about}, with price history.`,
      `${lead}${refPart}. ${about}.`,
      `${lead}${refPart}.`,
      `${lead}.`,
    );
  } else if (ref) {
    const lead = `${head} price: ${ref}`;
    const stock = o.stores > 0 ? `Sold out at the ${n(o.stores, "store")} we track` : "Not in stock at any store we track yet";
    out.push(`${lead}. ${stock}; eBay listings and price history below. ${about}.`, `${lead}. ${stock}; eBay listings and price history below.`, `${lead}. ${about}.`, `${lead}.`);
  } else {
    out.push(`${head}: no TCGplayer market price yet. ${about}; store and eBay listings as they appear.`, `${head}: no TCGplayer market price yet. ${about}.`, `${head}: no TCGplayer market price yet.`);
  }
  return out;
}

/** The first description candidate that fits 160 characters (else the last); pages still pass it through `fitDescription`. */
export function firstThatFits(candidates: string[], max = DESC_MAX): string {
  return candidates.find((d) => d.length <= max) ?? candidates[candidates.length - 1];
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
