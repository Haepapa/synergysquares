import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Synergy Squares — Multiplayer Bingo Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #581c87 0%, #9333ea 50%, #c026d3 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative grid */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "48px",
          }}
        >
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "10px",
                background: i === 4 ? "#f0abfc" : "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          Synergy Squares
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255,255,255,0.8)",
            marginTop: "20px",
          }}
        >
          Multiplayer Bingo Generator
        </div>
      </div>
    ),
    { ...size }
  );
}
