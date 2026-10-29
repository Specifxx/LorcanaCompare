import type { PreorderCopy } from "@/lib/site-types";

// Copy for /preorders and /preorders/<set slug> (facts: research/news.md,
// 2026-10-24). A fact we can't source is left out; a set without copy here
// still gets a page from its data.
export const PREORDER_COPY: PreorderCopy = {
  intro:
    "Every upcoming Disney Lorcana release, each with its own page comparing every store's booster box, Illumineer's Trove and sealed pre-order price, cheapest first in your currency. Sets stay listed for six weeks after release, when the most people shop for a box.",
  faq: [
    { q: "When do Lorcana pre-orders open?", a: "Some European stores list a new set months ahead; most US stores open pre-orders six to eight weeks before release. Each release page adds a store as soon as its listing appears, and refreshes every store daily." },
    { q: "Why does TCGplayer show no price yet?", a: "Before release TCGplayer carries placeholder listings. We only show a TCGplayer price once it has a real market price, so the store pre-order prices are the ones to compare." },
    { q: "Is pre-ordering cheaper?", a: "For recent Lorcana sets, store pre-orders at or near MSRP have usually beaten release-week prices. Compare the stores on each release's page; it refreshes every morning." },
  ],
  sets: {
    "into-the-inkdark": {
      intro:
        "Every store listing <b>Into the Inkdark</b> (Set 15), the first Disney Lorcana set with Collector Boosters and the 23-copy Illustrious rarity, compared cheapest first in your currency. TCGplayer lists it for 5 February 2027.",
      facts: [
        { label: "Expected release", value: "5 Feb 2027 (TCGplayer listing)" },
        { label: "Set", value: "Set 15" },
        { label: "New product", value: "Collector Booster displays" },
        { label: "New rarity", value: "Illustrious, 23 copies each" },
      ],
      faq: [
        { q: "What is a Lorcana Collector Booster?", a: "A new pack type that starts with Into the Inkdark: a 12-pack display, with 12 premium foil cards in each pack. The Illustrious cards are found only in Collector Boosters." },
        { q: "How rare are Illustrious cards?", a: "Only 23 numbered copies of each Illustrious card exist worldwide. An Illustrious Evil Queen is the first one revealed." },
        { q: "When do Into the Inkdark pre-orders open?", a: "Some European stores list Collector Booster displays already. Most US stores open pre-orders six to eight weeks before release; this page adds each store as soon as its listing appears." },
      ],
    },
    "hyperia-city": {
      intro:
        "Every store with <b>Hyperia City</b> (Set 14) booster boxes, Illumineer's Troves and sealed product, compared cheapest first in your currency. Prerelease events ran from 16 October 2026 and the general release was 23 October.",
      facts: [
        { label: "General release", value: "23 October 2026" },
        { label: "Set", value: "Set 14 · 204 cards" },
        { label: "Iconic cards", value: "2 (Mickey, Cinderella)" },
        { label: "Enchanted", value: "18" },
      ],
      faq: [
        { q: "When did Hyperia City release?", a: "Prerelease events started on 16 October 2026 and the general release was 23 October 2026." },
        { q: "What are the Hyperia City chase cards?", a: "The two Iconic cards, Mickey Mouse, Best in Town and Cinderella, Unintentional Icon, then the 18 Enchanted cards. The chase cards section on this page shows today's TCGplayer market price for each." },
        { q: "What else is new in Hyperia City?", a: "Pixar's Coco joins the game, and the set adds the ink drops mechanic. Packs carry a puzzle-art insert, an Ink Drop token or a story card." },
      ],
    },
  },
};
