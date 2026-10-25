import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const dynamic = "force-static";
export const alt = "LegalAI: An Intelligent Criminal Legal Assistance and Analytics System";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0d1b33";
const GOLD = "#e3b65c";
const INK = "#e6ebf3";
const MUTED = "#a9b7cf";

/** The share card, rendered to a static PNG at build time. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: NAVY,
        backgroundImage:
          "linear-gradient(rgba(230,235,243,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(230,235,243,0.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        color: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 16,
            border: `2px solid rgba(227,182,92,0.5)`,
          }}
        >
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 7v18M11 25h10M8 11h16M10 11l-3 7a3.5 3.5 0 0 0 6 0zM22 11l-3 7a3.5 3.5 0 0 0 6 0z"
              stroke={GOLD}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ fontSize: 30, color: GOLD, letterSpacing: 2, textTransform: "uppercase" }}>
          Project documentation
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
          LegalAI
        </div>
        <div style={{ marginTop: 20, fontSize: 40, color: INK, lineHeight: 1.25 }}>
          An Intelligent Criminal Legal Assistance and Analytics System
        </div>
        <div style={{ marginTop: 20, fontSize: 28, color: MUTED, lineHeight: 1.4 }}>
          {site.tagline}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: MUTED,
          borderTop: "1px solid rgba(230,235,243,0.15)",
          paddingTop: 24,
        }}
      >
        <div>{`${site.course} · ${site.institution}`}</div>
        <div style={{ color: GOLD }}>{new URL(site.siteUrl).host}</div>
      </div>
    </div>,
    size,
  );
}
