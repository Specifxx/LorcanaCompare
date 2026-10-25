import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { StaticPage } from "@/components/StaticPage";

export const revalidate = 86400;
export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <StaticPage title="Privacy policy">
      <p>Last updated 24 October 2026.</p>
      <p>{SITE.name} stores the email address and hashed password of account holders, their price alerts and watchlist, and anonymous counts of clicks on outbound store links (which product and store, no personal identifier). Payments are handled by Stripe; we never see card numbers.</p>
      <p>We use Vercel Analytics (cookieless, aggregate page views) and, for visitors on the free plan, Google AdSense, which may use cookies to show ads — see <a href="https://policies.google.com/technologies/ads" rel="noopener">how Google uses data</a>. Affiliate partners (eBay, TCGplayer, Amazon) may set cookies when you follow a buy link.</p>
      <p>Email us at <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> to export or delete your account.</p>
    </StaticPage>
  );
}
