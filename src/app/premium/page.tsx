import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PremiumPanel } from "@/components/premium/PremiumPanel";
import { SITE } from "@/site.config";
import { SITE_URL } from "@/lib/site";
import { fitDescription } from "@/lib/seo-title";

const SITE_NAME = SITE.name;
const CONTACT_EMAIL = SITE.supportEmail;
import { PREMIUM_PRICE_LINE } from "@/lib/premium-member";

// Premium (owner, 2026-11-19: accounts and Premium on every compare site): the shared RiftCompare account works here. Static; the browser asks RiftCompare.
const DESCRIPTION = `Premium for ${SITE_NAME}: no banner ads, up to 200 price alerts and a watch list on every device. ${PREMIUM_PRICE_LINE}. Comparing prices stays free.`;
export const metadata: Metadata = {
  title: `${SITE_NAME} Premium: no ads, 200 price alerts`,
  description: fitDescription(DESCRIPTION),
  alternates: { canonical: `${SITE_URL}/premium` },
};

export default function PremiumPage() {
  return (
    <div className="max-w-3xl py-6">
      <Breadcrumbs items={[{ name: "Premium" }]} />
      <div className="prose-site mt-6">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-400">New · 14 days free</p>
        <h1 className="font-display text-3xl font-black mt-1">
          {SITE_NAME} <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Premium</span>
        </h1>
        <p className="mt-3 text-lg">
          Comparing card and sealed prices stays free, and so do price alerts and the weekly biggest-drops email. Premium is for people who watch a lot of products and want a calmer site.
        </p>
      </div>
      <div className="mt-6">
        <PremiumPanel />
      </div>
      <div className="prose-site mt-8">
        <h2>What you get</h2>
        <ul>
          <li><strong>No banner ads.</strong> The sponsored banners and the phone dock disappear while you are signed in. Price tables, the stores in them and their order do not change.</li>
          <li><strong>Up to 200 price alerts</strong> instead of 25.</li>
          <li><strong>A watch list</strong> at <a href="/watches">My watches</a>: every alert you have set, with the lowest in-stock price now, and a button to stop each.</li>
        </ul>
        <h2>How it works</h2>
        <p>
          Sign in on {SITE_NAME} with Google, Discord or an emailed link (no password), pick monthly or yearly, and start the 14-day trial through Stripe&rsquo;s secure checkout.
          You are not charged until day 15, and you can cancel any time from <strong>Manage billing</strong> on this page. The same account works on our other card sites. If it lapses, the extras stop; your free alerts keep working.
        </p>
        <h2>What it does not do</h2>
        <p>
          It does not change which stores are shown or in what order, hide any price, or promise stock: alerts use the same store feeds as the site, so a product that sells out within hours can be gone by the time you click.
          Prices are the lowest in-stock store price, before postage.
        </p>
        <p className="text-sm text-muted">Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>. Billing: Manage billing on this page once you are signed in.</p>
      </div>
    </div>
  );
}
