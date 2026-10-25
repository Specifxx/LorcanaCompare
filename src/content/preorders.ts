// Copy for /preorders (facts: research/news.md, 2026-10-24).
export const PREORDER_COPY: {
  intro: string;
  facts: { label: string; value: string }[];
  faq: { q: string; a: string }[];
} = {
  intro:
    "Every store taking pre-orders for the next Disney Lorcana set, and the newest set's sealed product, compared cheapest first in your currency. <b>Into the Inkdark</b> (Set 15) brings the first Collector Boosters and the 23-copy Illustrious rarity; <b>Hyperia City</b> (Set 14) released on 23 October 2026.",
  facts: [
    { label: "Next set", value: "Into the Inkdark (Set 15)" },
    { label: "Expected release", value: "5 Feb 2027 (TCGplayer listing)" },
    { label: "New product", value: "Collector Booster displays" },
    { label: "New rarity", value: "Illustrious — 23 copies each" },
  ],
  faq: [
    { q: "When do Into the Inkdark pre-orders open?", a: "Some European stores list Collector Booster displays already. Most US stores open pre-orders six to eight weeks before release; this page adds each store as soon as its listing appears." },
    { q: "Why does TCGplayer show no price yet?", a: "Before release TCGplayer carries placeholder listings. We only show a TCGplayer price once it has a real market price, so the store pre-order prices are the ones to compare." },
    { q: "Is pre-ordering cheaper?", a: "For recent Lorcana sets, store pre-orders at or near MSRP have usually beaten release-week prices. Compare the stores below; this page refreshes every morning." },
  ],
};
