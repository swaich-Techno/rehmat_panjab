import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #A9B9A1 0%, #FBF7EE 48%, #D5C5AA 100%)",
          color: "#171814",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
          Perfume oil
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.9 }}>
          <div style={{ display: "flex" }}>Rehmat</div>
          <div style={{ display: "flex" }}>Panjab</div>
        </div>
        <div style={{ display: "flex", fontSize: 28 }}>Made to be worn. Not announced.</div>
      </div>
    ),
    size,
  );
}
