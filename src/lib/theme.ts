// Dark by default (owner: "default dark theme"); a site can open light instead
// (SITE.theme.defaultMode). A visitor's own choice is remembered in
// localStorage and applied before first paint.
import { SITE } from "@/site.config";

export const THEME_KEY = "theme";
export const DEFAULT_MODE: "light" | "dark" = SITE.theme.defaultMode === "light" ? "light" : "dark";
const OTHER = DEFAULT_MODE === "light" ? "dark" : "light";
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.setAttribute("data-theme",t==="${OTHER}"?"${OTHER}":"${DEFAULT_MODE}")}catch(e){document.documentElement.setAttribute("data-theme","${DEFAULT_MODE}")}})();`;

// /cards?q= (2026-11-14 review): the search runs in the browser, so the server cannot know there will be results. This
// marks <html> before first paint, and globals.css then shows the server's placeholder row (app/cards/SearchSkeleton.tsx)
// in the place the results will fill, so the page below does not jump down when they arrive. Nothing else reads it.
export const SEARCH_BOOT_SCRIPT = `(function(){try{if(location.pathname==="/cards"&&new URLSearchParams(location.search).get("q"))document.documentElement.setAttribute("data-search","")}catch(e){}})();`;
