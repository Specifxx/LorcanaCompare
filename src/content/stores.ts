// Verified Shopify stores (research/stores.json, checked 2026-10-24: each
// collection's products.json returned this game's products). Add a store only
// after the same check — a Shopify path pointed at the wrong collection fails
// silently. English-language product only.
import type { StoreConfig } from "@/lib/site-types";

export const STORES: StoreConfig[] = [
  { key: "gamersguildaz", name: "Gamers Guild AZ", base: "https://gamersguildaz.com", market: "US", collections: ["lorcana"], kind: "sealed" },
  { key: "hobbiesville", name: "Hobbiesville", base: "https://hobbiesville.com", market: "US", collections: ["disney-lorcana-singles", "disney-lorcana"], kind: "both" },
  { key: "bardsandcards", name: "Bards and Cards (singles)", base: "https://singles.bardsandcards.com", market: "US", collections: ["disney-lorcana-singles"], kind: "singles" },
  { key: "wizardtower", name: "Wizard Tower", base: "https://store.wizardtower.com", market: "CA", collections: ["lorcana-singles", "lorcana-sealed"], kind: "both" },
  { key: "facetoface", name: "Face to Face Games", base: "https://www.facetofacegames.com", market: "CA", collections: ["lorcana-singles", "lorcana-sealed"], kind: "both" },
  { key: "401games", name: "401 Games", base: "https://store.401games.ca", market: "CA", collections: ["disney-lorcana-singles", "disney-lorcana-sealed-product"], kind: "both" },
  { key: "houseofcards", name: "House of Cards", base: "https://www.houseofcards.ca", market: "CA", collections: ["disney-lorcana-singles", "disney-lorcana-sealed-product"], kind: "both" },
  { key: "fusion", name: "Fusion Gaming", base: "https://www.fusiongamingonline.com", market: "CA", collections: ["lorcana-singles-1", "lorcana-singles"], kind: "both" },
  { key: "goodgames", name: "Good Games", base: "https://www.goodgames.com.au", market: "AU", collections: ["disney-lorcana-tcg"], kind: "sealed" },
  { key: "gameology", name: "Gameology", base: "https://www.gameology.com.au", market: "AU", collections: ["lorcana-tcg-singles", "disney-lorcana-tcg"], kind: "both" },
  { key: "gamesempire", name: "Games Empire", base: "https://www.gamesempire.com.au", market: "AU", collections: ["disney-lorcana-tcg"], kind: "sealed" },
  { key: "totalcards", name: "Total Cards", base: "https://www.totalcards.net", market: "UK", collections: ["all-lorcana"], kind: "sealed" },
  { key: "spellbound", name: "Spellbound Games", base: "https://www.spellboundgames.co.uk", market: "UK", collections: ["lorcana-1"], kind: "sealed" },
  { key: "thirstymeeples", name: "Thirsty Meeples", base: "https://www.thirstymeeples.co.uk", market: "UK", collections: ["disney-lorcana-tcg"], kind: "sealed" },
  { key: "cardcosmos", name: "Cardcosmos", base: "https://www.cardcosmos.de", market: "EU", collections: ["disney-lorcana-englisch"], kind: "sealed" },
];
