import { SITE } from "@/site.config";

/**
 * The home hero's art (the lively look, owner 2026-11-26: "so dull … we want it to be a very nice experience"): slow, plain
 * geometry of our own drawing behind the headline, picked by SITE.look.art. "orbit": fine rings, six gems in the site's six
 * hues, a few sparkles and a slow swirl of colour. "grid": a reticle, a perspective grid running to a horizon, a scan line and
 * four HUD brackets. Nobody's logo, frame, character or key art. Decoration only: aria-hidden, never a product, a photo or a
 * link, drawn by the server as one small SVG and a few empty spans, coloured and moved by CSS alone (globals.css, "The lively
 * look": transform and opacity; still for prefers-reduced-motion). Absolute inside the hero and inside the page's column, so
 * nothing shifts when it paints and the window's empty sides stay free. Nothing without SITE.look.
 */
const C = { cx: 300, cy: 300 };
// Where the sparkles sit in the 600 × 600 drawing.
const SPARKS = [[92, 118], [508, 84], [552, 330], [436, 520], [70, 400], [200, 40], [330, 566]];
// The filigree: six circles through the centre (a plain rosette), as one path.
const ROSETTE = [[300, 225], [365, 262.5], [365, 337.5], [300, 375], [235, 337.5], [235, 262.5]].map(([x, y]) => `M${x - 75} ${y}a75 75 0 1 0 150 0a75 75 0 1 0-150 0`).join("");

export function HeroArt() {
  const art = SITE.look?.art;
  if (!art) return null;
  return (
    <div className="hero-art" aria-hidden="true">
      {art === "orbit" ? (
        <>
          <span className="ha-ink" />
          <svg className="ha-svg ha-orbit" viewBox="0 0 600 600" fill="none" focusable="false">
            <defs>
              {/* One gem (a diamond with a lit upper facet) and one sparkle, drawn once and placed with <use>. */}
              <g id="lv-gem">
                <path fill="currentColor" d="M300 72l9 14-9 14-9-14z" />
                <path className="ha-facet" d="M300 72l9 14h-18z" />
              </g>
              <path id="lv-star" d="M0-13Q0 0 13 0 0 0 0 13 0 0-13 0 0 0 0-13Z" />
            </defs>
            <g className="ha-s1">
              <circle {...C} r="294" />
              <circle {...C} r="282" strokeDasharray="1 9" />
            </g>
            <g className="ha-s2">
              <circle {...C} r="214" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <use key={i} href="#lv-gem" className={`ha-h${i}`} transform={`rotate(${i * 60} 300 300)`} />
              ))}
            </g>
            <g className="ha-s3">
              <circle {...C} r="150" />
              <path d={ROSETTE} />
            </g>
            <g className="ha-sparks">
              {SPARKS.map(([x, y]) => (
                <use key={x} href="#lv-star" x={x} y={y} />
              ))}
            </g>
          </svg>
        </>
      ) : (
        <>
          <span className="ha-floor"><span /></span>
          <svg className="ha-svg ha-grid" viewBox="0 0 600 600" fill="none" focusable="false">
            <g className="ha-s1">
              <circle {...C} r="294" strokeDasharray="2 14" />
              <circle {...C} r="272" strokeWidth="2.5" strokeDasharray="150 63.63" />
            </g>
            <g className="ha-s2">
              <circle {...C} r="214" strokeDasharray="4 10" />
              <path strokeWidth="2" d="M300 62v44M300 494v44M62 300h44M494 300h44" />
            </g>
            <g className="ha-s3">
              <circle {...C} r="150" strokeDasharray="236 78.16" />
              <path d="M300 136l12 20h-24zM300 464l12-20h-24z" />
            </g>
          </svg>
          <span className="ha-scan" />
          <span className="ha-br ha-br-1" />
          <span className="ha-br ha-br-2" />
          <span className="ha-br ha-br-3" />
          <span className="ha-br ha-br-4" />
        </>
      )}
    </div>
  );
}
