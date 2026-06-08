import { ImageResponse } from "next/og";

export const alt = "Antonewton Quima - Odoo Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px",
          width: "100%",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#6ee7b7", display: "flex", fontSize: 22 }}>
            Portfolio v4.0
          </div>
          <div style={{ color: "#a1a1aa", display: "flex", fontSize: 20 }}>
            Luanda, Angola
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            Antonewton Quima
          </div>
          <div
            style={{
              color: "#a1a1aa",
              display: "flex",
              fontSize: 30,
              marginTop: 26,
            }}
          >
            Odoo Developer / Software Developer
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
            fontSize: 22,
            justifyContent: "space-between",
            paddingTop: 28,
          }}
        >
          <span>ERP · Web · Automation</span>
          <span style={{ color: "#6ee7b7" }}>antonewton.xyz</span>
        </div>
      </div>
    ),
    size
  );
}
