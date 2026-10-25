// Free / Plus / Premium, priced as on Rift Compare. Comparing prices is free for
// everyone; paid tiers watch prices for you.
export type Tier = "free" | "plus" | "premium";

export const PLANS = {
  plus: { name: "Plus", monthly: 299, yearly: 2399 },
  premium: { name: "Premium", monthly: 999, yearly: 7999 },
} as const;

export const LIMITS: Record<Tier, { alerts: number; watchlist: number; collection: number; historyDays: number; ads: boolean; csv: boolean }> = {
  free: { alerts: 1, watchlist: 25, collection: 100, historyDays: 30, ads: true, csv: false },
  plus: { alerts: 25, watchlist: 500, collection: 2000, historyDays: 365, ads: false, csv: false },
  premium: { alerts: 500, watchlist: 5000, collection: 20000, historyDays: 730, ads: false, csv: true },
};

export const FEATURES: { label: string; free: string | boolean; plus: string | boolean; premium: string | boolean }[] = [
  { label: "Compare every store, TCGplayer and eBay", free: true, plus: true, premium: true },
  { label: "Price history", free: "30 days", plus: "1 year", premium: "2 years" },
  { label: "Target-price email alerts", free: "1 card", plus: "25 cards", premium: "500 cards" },
  { label: "Watchlist", free: "25 cards", plus: "500 cards", premium: "Unlimited" },
  { label: "Collection value tracker", free: "100 cards", plus: "2,000 cards", premium: "Unlimited" },
  { label: "Daily below-market deals email", free: false, plus: false, premium: true },
  { label: "No ads", free: false, plus: true, premium: true },
  { label: "CSV export of prices and collection", free: false, plus: false, premium: true },
];

export function effectiveTier(u: { tier: string; premiumUntil: Date | null } | null, isAdmin = false): Tier {
  if (isAdmin) return "premium";
  if (!u) return "free";
  if (u.tier !== "free" && u.premiumUntil && u.premiumUntil.getTime() > Date.now()) return u.tier as Tier;
  return "free";
}
