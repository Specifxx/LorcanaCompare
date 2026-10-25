import { ImageResponse } from "next/og";
import { SITE } from "@/site.config";

export const runtime = "edge";
export const alt = SITE.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: SITE.theme.pageDark, color: "#fff" }}>
        <div style={{ fontSize: 96, fontWeight: 900, display: "flex", gap: 24 }}>
          <span style={{ color: SITE.theme.brand }}>{SITE.wordmark[0]}</span>
          <span>{SITE.wordmark[1]}</span>
        </div>
        <div style={{ fontSize: 40, marginTop: 24, color: "#cfd3e6" }}>{SITE.tagline}</div>
        <div style={{ fontSize: 28, marginTop: 40, color: SITE.theme.brandLight }}>TCGplayer · eBay · local stores · updated daily</div>
      </div>
    ),
    size,
  );
}
