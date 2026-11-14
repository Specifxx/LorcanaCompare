import { SITE } from "@/site.config";

const hexRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
};
const rgb = (hex: string) => hexRgb(hex).join(" ");

// WCAG relative luminance and contrast, for the two colours derived below.
const lum = ([r, g, b]: number[]) => {
  const f = (x: number) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
export const contrast = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/** The brand colour as TEXT on the light theme (2026-11-14): the dark theme's light gold or yellow read 1.5:1 on white, so
 *  links, prices and kickers in the light theme take the brand darkened until it reads at least 5:1 on the light theme's
 *  tinted panels (ink-850, 241 243 248). Same hue, just deeper. */
export function brandTextOnLight(hex: string): string {
  const base = hexRgb(hex);
  const panel = [241, 243, 248];
  for (let k = 1; k >= 0.05; k -= 0.01) {
    const c = base.map((v) => Math.round(v * k));
    if (contrast(c, panel) >= 5) return c.join(" ");
  }
  return "0 0 0";
}

/** The words on a brand-filled button or badge: near-black or white, whichever reads better on the brand. */
export function onBrand(hex: string): string {
  const b = hexRgb(hex);
  const dark = [10, 11, 20];
  return contrast(dark, b) >= contrast([255, 255, 255], b) ? dark.join(" ") : "255 255 255";
}

/** The dark-theme variables, from SITE.theme, plus the two brand colours the light theme needs. */
export function themeCss(): string {
  const t = SITE.theme;
  const [i950, i900, i850, i800, i700, i600] = t.inkDark;
  return `:root{--page-bg:${t.pageDark};--wordmark:${t.wordmarkGradient};--c-brand:${rgb(t.brand)};--c-brand-light:${rgb(t.brandLight)};--c-brand-dark:${rgb(t.brandDark)};--c-accent:${rgb(t.accent)};--c-on-brand:${onBrand(t.brand)};--c-ink-950:${rgb(i950)};--c-ink-900:${rgb(i900)};--c-ink-850:${rgb(i850)};--c-ink-800:${rgb(i800)};--c-ink-700:${rgb(i700)};--c-ink-600:${rgb(i600)};--c-fg:236 238 245;--c-muted:150 158 182;--font-sans:Inter,ui-sans-serif,system-ui;--font-display:"${t.displayFont}",Georgia,serif}html:root[data-theme="light"]{--c-brand-light:${brandTextOnLight(t.brand)}}`;
}
