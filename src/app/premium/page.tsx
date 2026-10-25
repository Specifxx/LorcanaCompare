import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { FEATURES, PLANS } from "@/lib/premium";
import { money } from "@/lib/format";
import { CheckoutButton } from "./CheckoutButton";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: `${SITE.name} Premium — price alerts, history and no ads`,
  description: `Comparing ${SITE.gameShort} prices is free. Plus and Premium watch prices for you: email alerts at your target price, full price history, a collection tracker and no ads.`,
  alternates: { canonical: "/premium" },
};

const cell = (v: string | boolean) => (v === true ? "✓" : v === false ? "—" : v);

export default function Premium() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="text-center">
        <h1 className="font-display text-3xl font-black md:text-5xl">Never overpay for <span className="wordmark">{SITE.gameShort}</span></h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted">Comparing prices stays free for everyone. Plus and Premium watch prices for you and email you the moment a card hits your price.</p>
      </header>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Plan name="Free" price="$0" sub="forever" items={["Compare every store", "30 days of price history", "1 price alert"]} />
        <Plan name="Plus" price={money(PLANS.plus.monthly)} sub={`/month · or ${money(PLANS.plus.yearly)}/year`} items={["No ads", "25 price alerts", "1 year of history", "500-card watchlist"]} tier="plus" />
        <Plan name="Premium" price={money(PLANS.premium.monthly)} sub={`/month · or ${money(PLANS.premium.yearly)}/year`} items={["Everything in Plus", "500 price alerts", "2 years of history", "Daily deals email", "CSV export"]} tier="premium" highlight />
      </div>
      <table className="mt-12 w-full text-sm">
        <thead><tr className="text-left text-muted"><th className="py-2" /><th>Free</th><th>Plus</th><th>Premium</th></tr></thead>
        <tbody>{FEATURES.map((f) => (<tr key={f.label} className="border-t border-ink-800"><td className="py-2">{f.label}</td><td>{cell(f.free)}</td><td>{cell(f.plus)}</td><td>{cell(f.premium)}</td></tr>))}</tbody>
      </table>
      <p className="mt-6 text-center text-xs text-muted">Billed in USD by Stripe. Cancel any time from your account page.</p>
    </div>
  );
}

function Plan({ name, price, sub, items, tier, highlight }: { name: string; price: string; sub: string; items: string[]; tier?: "plus" | "premium"; highlight?: boolean }) {
  return (
    <div className={`card-surface flex flex-col p-6 ${highlight ? "border-brand" : ""}`}>
      <p className="font-bold">{name}</p>
      <p className="mt-2"><span className="text-4xl font-black">{price}</span> <span className="text-sm text-muted">{sub}</span></p>
      <ul className="my-5 flex-1 space-y-1.5 text-sm">{items.map((i) => <li key={i}>✓ {i}</li>)}</ul>
      {tier ? (
        <div className="flex flex-col gap-2"><CheckoutButton tier={tier} interval="monthly" label="Monthly" /><CheckoutButton tier={tier} interval="yearly" label="Yearly (save 33%)" ghost /></div>
      ) : (
        <a href="/login" className="btn-ghost">Create a free account</a>
      )}
    </div>
  );
}
