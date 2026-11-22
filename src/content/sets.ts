import type { SetInfo, SetPageCopy } from "@/lib/site-types";

// Copy for /sets/<slug> (facts: research/news.md, 2026-10-24, and its sources:
// disneylorcana.com's rotation notice and the 14 Jul 2026 tournament rules,
// TCGCSV's group list). A fact we can't source is left out; the page answers
// its other questions (most valuable card, cheapest box) from today's data.

const ROTATION_SET = "Attack of the Vine!";
const FIRST_CORE_SET = 9; // Fabled
const QUESTS: Record<string, { n: string; prior: string }> = {
  Q1: { n: "first", prior: "" },
  Q2: { n: "second", prior: "after Deep Trouble (May 2024)" },
  Q3: { n: "third", prior: "after Deep Trouble (May 2024) and Palace Heist (June 2025)" },
};

/** Core Constructed status of a main set, from the 2026 rotation. */
function rotation(name: string, n: number): SetPageCopy {
  const core = n >= FIRST_CORE_SET;
  return {
    facts: [
      { label: "Set", value: `Set ${n}` },
      { label: "Core Constructed", value: core ? "Legal" : "Rotated out" },
      { label: "Infinity Constructed", value: "Legal (ban list aside)" },
    ],
    faq: [
      core
        ? { q: `Is ${name} legal in Core Constructed?`, a: `Yes. Since ${ROTATION_SET} (17 July 2026), Core Constructed allows Fabled (Set 9) and every later set, so ${name} cards are Core legal. Infinity Constructed allows every card except its ban list.` }
        : { q: `Is ${name} legal in Core Constructed?`, a: `No, not since the rotation that took effect with ${ROTATION_SET} (17 July 2026): Core allows only Fabled (Set 9) and later. A card from ${name} stays Core legal only if it was reprinted in Fabled or later with the same full name. Every card is still legal in Infinity Constructed, except its ban list.` },
      ...(core ? [] : [{ q: `Did ${name} cards drop in price after the rotation?`, a: `Playable cards from Sets 1 to 8 have generally fallen since they left Core, while collector demand has held up their Enchanted cards. The table above shows each ${name} card's TCGplayer market price today and its 7-day change.` }]),
    ],
  };
}

/** Facts and questions of one set's own, beyond its rotation status. */
const OWN: Record<string, SetPageCopy> = {
  "attack-of-the-vine": {
    facts: [{ label: "Released", value: "17 July 2026" }],
    faq: [
      { q: `What changed with ${ROTATION_SET}?`, a: "It brought Disney Lorcana's first Core Constructed rotation into effect: from this set on, Core allows only Fabled (Set 9) and later sets, and an older card stays legal only if it was reprinted in Fabled or later with the same full name. The tournament rules were updated on 14 July 2026." },
    ],
  },
  "hyperia-city": {
    facts: [
      { label: "Core set", value: "204 cards" },
      { label: "Iconic", value: "2" },
      { label: "Enchanted / Epic", value: "18 / 18" },
    ],
    faq: [
      { q: "What are the Hyperia City Iconic cards?", a: "Mickey Mouse, Best in Town and Cinderella, Unintentional Icon. With 18 Enchanted and 18 Epic cards they are the set's chase cards; the most valuable cards above show today's TCGplayer market price for each." },
      { q: "What is new in Hyperia City?", a: "Pixar's Coco joins the game and the set brings the ink drops mechanic. Prerelease events started on 16 October 2026 and the general release was 23 October 2026." },
    ],
  },
};

export function setCopy(s: Pick<SetInfo, "slug" | "code" | "name">): SetPageCopy | null {
  const quest = s.code ? QUESTS[s.code] : undefined;
  if (quest) {
    const name = s.name.replace(/^Illumineer's Quest:\s*/, "");
    return {
      facts: [{ label: "Product line", value: `Illumineer's Quest, the ${quest.n}` }],
      faq: [{ q: `What is ${s.name}?`, a: `The ${quest.n} Illumineer's Quest release${quest.prior ? `, ${quest.prior}` : ""}. TCGplayer lists ${name} as its own set; the cards and sealed product above are the ones it prices today.` }],
    };
  }
  const n = s.code && /^\d+$/.test(s.code) ? Number(s.code) : null;
  const base = n != null && n <= 14 ? rotation(s.name, n) : null;
  const own = OWN[s.slug];
  if (!base && !own) return null;
  return { facts: [...(base?.facts ?? []), ...(own?.facts ?? [])], faq: [...(own?.faq ?? []), ...(base?.faq ?? [])] };
}
