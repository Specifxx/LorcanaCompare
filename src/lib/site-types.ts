// Types shared by the engine and src/site.config.ts.

export type Market = "US" | "UK" | "CA" | "AU" | "EU" | "SG";
export const MARKETS: Market[] = ["US", "UK", "CA", "AU", "EU", "SG"];
export const CURRENCY: Record<Market, string> = {
  US: "USD",
  UK: "GBP",
  CA: "CAD",
  AU: "AUD",
  EU: "EUR",
  SG: "SGD",
};
export const MARKET_LABEL: Record<Market, string> = {
  US: "United States",
  UK: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  EU: "Europe",
  SG: "Singapore",
};

export interface StoreConfig {
  key: string;
  name: string;
  /** Origin, no trailing slash. */
  base: string;
  market: Market;
  /** Shopify collection handles that hold this game's products. */
  collections: string[];
  kind: "singles" | "sealed" | "both";
  /** Shopify Markets country to request prices in (defaults from market). */
  country?: string;
}

export interface SisterSite {
  name: string;
  url: string;
  game: string;
}

export interface SiteConfig {
  key: string;
  name: string;
  shortName: string;
  wordmark: [string, string];
  game: string;
  gameShort: string;
  domain: string;
  tagline: string;
  description: string;
  keywords: string[];
  /** Hard-coded admins (owner request). ADMIN_EMAILS env adds to it. */
  adminEmails: string[];
  /** Public contact address, shown on the site. */
  supportEmail: string;
  /** Private: where the ops monitor and form notifications go. Never rendered. */
  ownerEmail: string;
  tcgcsvCategoryId: number;
  tcgplayerSlug: string;
  ebay: {
    query: string;
    singlesCategoryId: string;
    sealedCategoryId: string;
    /** Never spend a call on anything the market prices under this (USD). */
    minPriceUsd: number;
    /** This site's share of the eBay app's daily Browse quota. */
    dailyBudget: number;
    runHourUtc: number;
  };
  numberStyle: "fraction" | "code";
  rarityOrder: string[];
  chaseRarities: string[];
  theme: {
    brand: string;
    brandLight: string;
    brandDark: string;
    accent: string;
    pageDark: string;
    /** ink-950 … ink-600, darkest first. */
    inkDark: [string, string, string, string, string, string];
    wordmarkGradient: string;
    /** Google Fonts family for headings, e.g. "Cinzel". */
    displayFont: string;
  };
  halloween: { headline: string; blurb: string };
  stores: StoreConfig[];
  sisterSites: SisterSite[];
  social: { reddit?: string; discord?: string };
}

// ── Public data (data/public/*.json) ────────────────────────────────────────

export interface SetInfo {
  id: number; // TCGplayer groupId
  name: string;
  code: string; // abbreviation or slug
  slug: string;
  releasedOn: string | null; // ISO date
  productCount: number;
  upcoming: boolean;
}

export interface Product {
  id: number; // TCGplayer productId
  slug: string;
  name: string;
  kind: "card" | "sealed";
  setId: number;
  number: string | null;
  rarity: string | null;
  /** Extended fields worth showing (ink colour, type, cost…). */
  attrs: Record<string, string>;
  sealedType: string | null;
  image: string | null;
  tcgUrl: string;
  printings: string[];
}

export interface Offer {
  source: string; // store key, "ebay" or "tcgplayer"
  market: Market;
  currency: string;
  cents: number;
  inStock: boolean;
  url: string;
  title: string;
  printing?: string; // "Foil", "Normal"…
  preorder?: boolean;
  shippingCents?: number | null;
}

export interface TcgPrice {
  market: number | null; // USD cents
  low: number | null;
  mid: number | null;
}

export interface PriceEntry {
  tcg: Record<string, TcgPrice>; // by printing
  offers: Offer[];
  /** 7-day change of the reference price, percent. */
  change7d: number | null;
  change30d: number | null;
}

export interface Catalog {
  generatedAt: string;
  sets: SetInfo[];
  products: Product[];
}

export interface Prices {
  generatedAt: string;
  byId: Record<string, PriceEntry>;
}

export interface StoreStatus {
  ok: boolean;
  products: number;
  matched: number;
  at: string;
  error?: string;
}

export interface Meta {
  updatedAt: string;
  fx: Record<string, number>; // 1 USD = x currency
  stores: Record<string, StoreStatus>;
  ebay: { day: string; calls: number; budget: number; eligible: number; refreshed: number; at: string } | null;
  counts: { cards: number; sealed: number; offers: number; sets: number };
}

export interface EbayPick {
  productId: number;
  name: string;
  image: string | null;
  cents: number;
  currency: string;
  url: string;
  title: string;
  marketCents: number | null;
}
