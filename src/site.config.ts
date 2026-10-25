// The ONE game-specific configuration file. Lorcana Compare and Gundam Compare
// run the same engine (the Rift Compare playbook, rebuilt lean); everything
// that differs between them — names, colours, data sources, stores, copy —
// lives here or in src/content/. Keep engine code free of game names.
import type { SiteConfig } from "@/lib/site-types";
import { STORES } from "@/content/stores";

export const SITE: SiteConfig = {
  key: "lorcana",
  name: "Lorcana Compare",
  shortName: "LorcanaCompare",
  wordmark: ["LORCANA", "COMPARE"],
  game: "Disney Lorcana",
  gameShort: "Lorcana",
  domain: "lorcanacompare.com",
  tagline: "Compare Disney Lorcana card prices across every store",
  description:
    "Free Disney Lorcana price comparison: live prices for every Lorcana card and sealed product across TCGplayer, eBay and local game stores in the US, UK, Canada, Australia and the EU.",
  keywords: [
    "lorcana prices",
    "lorcana card prices",
    "disney lorcana price guide",
    "lorcana price checker",
    "cheapest lorcana booster box",
    "lorcana enchanted prices",
  ],
  adminEmails: ["bill.jyang101@gmail.com"],
  supportEmail: "bill.jyang101@gmail.com",

  // TCGCSV mirrors TCGplayer's catalogue and prices daily (tcgcsv.com).
  tcgcsvCategoryId: 71,
  tcgplayerSlug: "lorcana-tcg",
  // eBay: Collectible Card Games → CCG Individual Cards / Sealed Boxes.
  ebay: {
    query: "lorcana",
    singlesCategoryId: "183454",
    sealedCategoryId: "183456",
    minPriceUsd: 20,
    dailyBudget: 2500,
    // Run hour (UTC) — Gundam Compare runs at a different hour on the same
    // eBay app so the two sites never race for the shared 5,000.
    runHourUtc: 6,
  },

  // Card numbers look like "207/204" (TCGplayer "Number" extended field).
  numberStyle: "fraction",
  rarityOrder: ["Enchanted", "Iconic", "Epic", "Legendary", "Super Rare", "Rare", "Uncommon", "Common", "Promo"],
  chaseRarities: ["Enchanted", "Iconic", "Epic"],

  theme: {
    brand: "#d9a441",
    brandLight: "#f0c46a",
    brandDark: "#a87717",
    accent: "#7c5cff",
    pageDark: "#0a0b1a",
    inkDark: ["#070815", "#0c0e22", "#11142d", "#171b3a", "#262b55", "#3a4078"],
    wordmarkGradient: "linear-gradient(180deg, #f6dc9a 0%, #d9a441 55%, #b07d1f 100%)",
    displayFont: "Cinzel",
  },
  halloween: {
    headline: "Ursula's Night: the ink runs dark until 31 October",
    blurb: "Spooky season on the Great Illuminary — find the cheapest Villain cards before the clock strikes midnight.",
  },

  stores: STORES,
  sisterSites: [
    { name: "Rift Compare", url: "https://riftcompare.com", game: "Riftbound" },
    { name: "OP Compare", url: "https://opcompare.app", game: "One Piece" },
    { name: "Gundam Compare", url: "https://gundamcompare.com", game: "Gundam" },
    { name: "DexCompare", url: "https://www.dexcompare.app", game: "Pokémon" },
    { name: "MTG Compare", url: "https://mtgcompare.app", game: "Magic" },
  ],
  social: { reddit: "https://www.reddit.com/r/Lorcana/" },
};
