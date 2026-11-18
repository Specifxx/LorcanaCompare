import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
// The cart list's styles (components/cart): imported here, never from a component, so node tests can load them.
import "@/components/cart/cart.css";
import "@/components/cart/cart-drawer.css";
import "@/components/vault/vault.css";
import "@/components/site-reviews/site-reviews.css";
// The site's own look on top of the shared one (src/content/site.css; empty
// on a site that needs none). Game-specific, so it lives outside the engine.
import "@/content/site.css";
import { SITE } from "@/site.config";
import { BottomNav } from "@/components/BottomNav";
import { SITE_URL } from "@/lib/site";
import { themeCss } from "@/lib/theme-vars";
import { DEFAULT_MODE, SEARCH_BOOT_SCRIPT, THEME_BOOT_SCRIPT } from "@/lib/theme";
import { CHRISTMAS_FESTIVE_LAYER, SEASON_BOOT_SCRIPT } from "@/lib/season";
import { Header } from "@/components/Header";
import { holidayNav } from "@/lib/holiday-nav";
import { HolidayStrip } from "@/components/HolidayStrip";
import { Footer } from "@/components/Footer";
import { PreorderStrip } from "@/components/PreorderStrip";
import { PrefsProvider } from "@/components/ClientPrefs";
import { QuickView } from "@/components/QuickView";
import { RateCard } from "@/components/site-reviews/RateCard";
import { BuyClickTracker } from "@/components/BuyClickTracker";
import { ReturnNudge } from "@/components/ReturnNudge";
import { LeaveNudge } from "@/components/LeaveNudge";
import { ShareArrival } from "@/components/ShareArrival";
import { SideNav } from "@/components/SideNav";
import { PhoneDockAds } from "@/components/PhoneDock";
import { navGroups } from "@/lib/nav";
import { shopNav } from "@/lib/shop-nav";
import { historyOn } from "@/lib/data";
import { fitDescription } from "@/lib/seo-title";
import { ReturnBeacon } from "@/components/ReturnBeacon";
import { SinceLastVisit } from "@/components/SinceLastVisit";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: fitDescription(SITE.description),
  keywords: SITE.keywords,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, url: "/" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  // Large image previews and full snippets in Google (Search, Discover, Images), as RiftCompare does.
  // A page that sets its own `robots` (noindex) replaces this whole object.
  robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = { themeColor: DEFAULT_MODE === "light" ? SITE.theme.pageLight ?? "#f4f5fa" : SITE.theme.pageDark, colorScheme: "dark light" };

// Inter for text and Plus Jakarta Sans for headings (owner, 2026-11-03: the old game-styled display
// fonts were "way too tacky"; every site names Plus Jakarta Sans in SITE.theme.displayFont). Both are
// served from this site and preloaded (2026-11-19): the Google Fonts stylesheet they replace blocked
// the first paint for about 2 s on a phone (Lighthouse mobile, live home). "optional" never swaps a
// face in after the first paint, so text never shifts; the fallback is metric-matched. No AdSense
// script (owner, 2026-11-18: AdSense is off).
const inter = localFont({
  src: "./fonts/Inter-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "optional",
  variable: "--font-inter",
  adjustFontFallback: "Arial",
});
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  weight: "200 800",
  style: "normal",
  display: "optional",
  variable: "--font-jakarta",
  adjustFontFallback: "Arial",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} data-theme={DEFAULT_MODE} data-festive={CHRISTMAS_FESTIVE_LAYER ? "on" : undefined} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT + SEASON_BOOT_SCRIPT + SEARCH_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://tcgplayer-cdn.tcgplayer.com" />
        {/* Impact's verifier reads the tag exactly as it issues it: `value`, not `content`. */}
        {SITE.impactSiteVerification && <meta name="impact-site-verification" {...{ value: SITE.impactSiteVerification }} />}
      </head>
      <body className="font-sans antialiased">
        <PrefsProvider>
          {/* The left rail from lg up (SideNav.tsx); everything else keeps --sidenav-w of room for it (globals.css). */}
          <SideNav groups={navGroups({ history: historyOn(), sale: holidayNav(), shop: shopNav().groups })} />
          <div className="lg:pl-[var(--sidenav-w)]">
            <Header />
            <HolidayStrip />
            <PreorderStrip />
            <main className="mx-auto max-w-7xl px-4 py-6">
              {SITE.priceAlerts && <SinceLastVisit />}
              {children}
            </main>
            <Footer />
          </div>
          {/* The phone dock (PhoneDock.tsx): browser-only, after a scroll, narrow screens only; wide screens get the in-page ad block. */}
          <PhoneDockAds />
          {/* The phone bottom nav (BottomNav.tsx, owner 2026-11-18): SITE.bottomNav "optin" (?bn=1 only), "on" or "off" (the rollback). */}
          {(SITE.bottomNav ?? "off") !== "off" && <BottomNav mode={SITE.bottomNav ?? "off"} />}
          <QuickView />
          {/* Rate us (owner, 2026-11-03): the corner card, asking only after real use; RiftCompare keeps the ratings. */}
          <RateCard />
        </PrefsProvider>
        <Analytics />
        <BuyClickTracker />
        <ReturnNudge />
        <LeaveNudge />
        <ShareArrival />
        <ReturnBeacon />
      </body>
    </html>
  );
}
