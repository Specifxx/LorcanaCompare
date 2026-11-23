// The set page's read-out, written from the set's own rows (Rift Compare's set template: its
// "About <set>" narrative and "How to read <set> prices", DECISIONS.md 2026-11-24). Pure and
// game-agnostic: the page hands in each card's name, rarity, TCGplayer market price and whether any
// seller we track has it in stock today, and gets back sentences only this set can have. A sentence
// that would read the same on every set page is left to the page's method paragraph.
import { money } from "./format";

export interface ReadoutCard {
  name: string;
  rarity: string | null;
  /** TCGplayer market price, US cents; null when TCGplayer has none. */
  cents: number | null;
  /** At least one seller we track has it in stock today. */
  inStock: boolean;
}

export interface SetReadout {
  /** "About <set> prices": value, concentration, the middle of the list, stock. */
  about: string[];
  /** The dearest and cheapest priced card and the rarity that fills the top ten, for "How to read". */
  facts: string | null;
}

const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

const label = (c: ReadoutCard & { cents: number }) => `${c.name}${c.rarity && !c.name.includes(`(${c.rarity})`) ? ` (${c.rarity})` : ""}`;

export function setReadout(setName: string, cards: readonly ReadoutCard[]): SetReadout {
  const priced = cards.filter((c): c is ReadoutCard & { cents: number } => c.cents != null).sort((a, b) => b.cents - a.cents);
  if (!priced.length) return { about: [], facts: null };
  const about: string[] = [];
  const total = priced.reduce((a, c) => a + c.cents, 0);
  const top = priced.slice(0, 10);
  const topShare = Math.floor((top.reduce((a, c) => a + c.cents, 0) / total) * 100);
  const lead = priced.slice(0, 3).map((c) => `${label(c)} at ${money(c.cents)}`);
  about.push(
    `${priced.length} of ${setName}'s ${cards.length} cards have a TCGplayer market price today, and one of each comes to ${money(total)}. ` +
      (priced.length > 10 ? `The ten most valuable make up ${topShare}% of that, ` : "") +
      `led by ${lead[0]}${lead.length > 1 ? `, then ${lead.slice(1).join(" and ")}` : ""}.`,
  );
  const mid = median(priced.map((c) => c.cents));
  const cheap = priced.filter((c) => c.cents <= 100).length;
  if (mid != null && priced.length >= 5) {
    about.push(
      `The middle card of the set costs ${money(mid)}` +
        (cheap ? `, and ${cheap} of the priced cards are ${money(100)} or less, so most of the set costs little and its value sits in the chase cards at the top of the list.` : "."),
    );
  }
  const stocked = cards.filter((c) => c.inStock).length;
  if (cards.length) {
    about.push(
      stocked === cards.length
        ? `Every ${setName} card is in stock at one or more of the sellers we track today.`
        : `${stocked} of the ${cards.length} cards are in stock at one or more of the sellers we track today; the rest show TCGplayer's market price until a store lists them.`,
    );
  }
  const tally = new Map<string, number>();
  for (const c of top) if (c.rarity) tally.set(c.rarity, (tally.get(c.rarity) ?? 0) + 1);
  const [rarity, n] = [...tally].sort((x, y) => y[1] - x[1])[0] ?? [null, 0];
  const low = priced.length > 1 ? priced[priced.length - 1] : null;
  const facts =
    `The most valuable ${setName} card today is ${label(priced[0])}, at ${money(priced[0].cents)}` +
    (low ? `; the cheapest priced one is ${label(low)}, at ${money(low.cents)}` : "") +
    "." +
    (rarity && priced.length >= 10 && n >= 5 ? ` ${n} of the ten most valuable are ${rarity} cards.` : "");
  return { about, facts };
}
