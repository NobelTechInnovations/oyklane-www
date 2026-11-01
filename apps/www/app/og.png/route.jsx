import { ImageResponse } from "next/og";
import { O, REST, W } from "../components/OyklaneLogo";

// The share image when Super admin ▸ Website has none: 1200 × 630, what
// WhatsApp, LinkedIn and X show under oyklane.com links. Static.
export const dynamic = "force-static";

const BLUE = "#1F5FD6";
const INK = "#0E1A33";

// Inter from Google Fonts as TTF (the image renderer can't read woff2); the
// default font if it can't be fetched at build time.
async function inter(weight) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? { name: "Inter", data: await (await fetch(url)).arrayBuffer(), weight, style: "normal" } : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const fonts = (await Promise.all([inter(400), inter(600)])).filter(Boolean);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#ffffff", position: "relative" }}>
        <div style={{ position: "absolute", right: -160, top: -160, width: 620, height: 620, borderRadius: 620, background: "#EEF3FD", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width={Math.round((72 * W) / 120)} height="72" viewBox={`0 0 ${W} 120`}>
            <rect width="120" height="120" rx="30" fill={BLUE} />
            <circle cx="54" cy="60" r="24" fill="none" stroke="#fff" strokeWidth="13" />
            <rect x="78" y="53.5" width="24" height="13" rx="6.5" fill="#fff" />
            <path d={O} fill={INK} fillRule="evenodd" />
            <path d={REST} fill={INK} transform="translate(-18.64 0)" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
          <span style={{ fontSize: 68, fontWeight: 600, color: INK, lineHeight: 1.05, letterSpacing: -2.5 }}>Premium online stores for Indian brands</span>
          <span style={{ fontSize: 30, color: "#4B5563", lineHeight: 1.35 }}>Premium themes, One-Click Checkout, UPI and cash on delivery, shipping and GST — on plans that cost less.</span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["Free trial", "No card needed", "Made in India"].map((t) => (
            <span key={t} style={{ display: "flex", fontSize: 24, color: BLUE, background: "#EEF3FD", padding: "10px 20px", borderRadius: 999 }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630, ...(fonts.length && { fonts }) }
  );
}
