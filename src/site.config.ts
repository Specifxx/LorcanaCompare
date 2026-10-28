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
  supportEmail: "riftcompare@gmail.com",
  ownerEmail: "bill.jyang101@gmail.com",
  impactSiteVerification: "dda031ee-47ba-46d5-b639-93aba9b39be3",

  // TCGCSV mirrors TCGplayer's catalogue and prices daily (tcgcsv.com).
  tcgcsvCategoryId: 71,
  tcgplayerSlug: "lorcana-tcg",
  // eBay: Collectible Card Games → CCG Individual Cards / Sealed Boxes.
  ebay: {
    query: "lorcana",
    singlesCategoryId: "183454",
    sealedCategoryId: "183456",
    // Cards under $10 get no eBay call; every sealed product does (owner, 2026-10-25).
    minPriceUsd: 10,
    // One eBay app, three sites (4,500 of its 5,000 a day): Lorcana 1,150,
    // Gundam 1,150, YGO 2,200 (2026-10-28; 1,500 each from the owner's
    // 2026-10-26 split, but Gundam and Lorcana spent ~1,000 a day covering every
    // eligible product while YGO's 3,400 eligible products hit the cap). Never
    // raise one without lowering another by the same amount.
    dailyBudget: 1150,
    // Run hour (UTC) — YGO Compare (12) and Gundam Compare (18) run at other
    // hours on the same eBay app so no two sites race for the shared 5,000.
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
  // The whole Compare Empire family, card games first (2026-10-27, DECISIONS.md
  // "Every site links the whole family"). `anchor` is the link text.
  sisterSites: [
    { name: "Rift Compare", url: "https://riftcompare.com", game: "Riftbound", anchor: "Riftbound card prices", search: "https://riftcompare.com/browse?q={q}" },
    { name: "OP Compare", url: "https://opcompare.app", game: "One Piece", anchor: "One Piece card prices", search: "https://opcompare.app/browse?q={q}" },
    { name: "DexCompare", url: "https://www.dexcompare.app", game: "Pokémon", anchor: "Pokémon sealed prices", search: "https://www.dexcompare.app/us/sealed?q={q}" },
    { name: "MTG Compare", url: "https://mtgcompare.app", game: "Magic", anchor: "Magic: The Gathering sealed prices", search: "https://mtgcompare.app/us/sealed?q={q}" },
    { name: "Gundam Compare", url: "https://gundamcompare.com", game: "Gundam", anchor: "Gundam Card Game prices", search: "https://gundamcompare.com/cards?q={q}" },
    { name: "YGO Compare", url: "https://ygocompare.com", game: "Yu-Gi-Oh!", anchor: "Yu-Gi-Oh! card prices", search: "https://ygocompare.com/cards?q={q}" },
    { name: "CamCompare", url: "https://www.camcompare.app", game: "Cameras", anchor: "Camera and lens prices" },
    { name: "Compare Empire", url: "https://www.compareempire.com", game: "Australian tech", anchor: "Australian tech prices" },
  ],
  social: { reddit: "https://www.reddit.com/r/Lorcana/" },
};
