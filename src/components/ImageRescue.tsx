"use client";
// Reliable images (owner, 2026-11-23 UX review, P1 15: "two guide thumbnails were blank on first load"; ported from DexCompare).
// One listener for the whole page: an image that fails is tried once more after 1.5 s, then hidden behind a quiet placeholder
// (the plate behind it shows), never a broken-image icon. Renders nothing.
import { useEffect } from "react";

export function ImageRescue() {
  useEffect(() => {
    const onError = (e: Event) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (!img.dataset.retried) {
        img.dataset.retried = "1";
        const src = img.currentSrc || img.src;
        setTimeout(() => {
          img.src = "";
          img.src = src;
        }, 1500);
        return;
      }
      img.style.visibility = "hidden";
      img.setAttribute("data-img-failed", "");
    };
    window.addEventListener("error", onError, true);
    return () => window.removeEventListener("error", onError, true);
  }, []);
  return null;
}
