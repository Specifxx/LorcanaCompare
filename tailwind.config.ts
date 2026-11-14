import type { Config } from "tailwindcss";

// Colours are CSS variables set from SITE.theme in app/layout.tsx, so the two
// sites share every class name and differ only in src/site.config.ts.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: v("ink-950"), 900: v("ink-900"), 850: v("ink-850"), 800: v("ink-800"), 700: v("ink-700"), 600: v("ink-600") },
        brand: { DEFAULT: v("brand"), 400: v("brand-light"), 500: v("brand"), 600: v("brand-dark") },
        accent: v("accent"),
        fg: v("fg"),
        muted: v("muted"),
        // Money colours are variables too (2026-11-14): the dark theme's bright greens and pink read under 3:1 on the light
        // theme's white, so globals.css gives the light theme deeper ones. `onbrand` is the words on a brand-filled button.
        up: v("up"),
        down: v("down"),
        buy: { DEFAULT: "#1ea65c", 400: v("buy-text") },
        onbrand: v("on-brand"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      // Rounder than before (owner, 2026-11-03: "way too square … more smooth, like OP Compare").
      borderRadius: { md: "8px", lg: "12px", xl: "16px", "2xl": "20px" },
    },
  },
  plugins: [],
} satisfies Config;
