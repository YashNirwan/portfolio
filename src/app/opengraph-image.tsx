import { ImageResponse } from "next/og";

export const alt = "Yash Nirwan — I build systems that don't trust their own output";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The share card is the highest-leverage surface on the site: it is what
   renders when someone pastes the link into Slack. It carries one sentence
   and the palette, nothing else. No custom font is loaded on purpose — the
   composition does the work, and a build-time font fetch is a dependency
   this does not need. */
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
          background: "#E7E9E4",
          color: "#1A1C19",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#5D625B",
          }}
        >
          <span>Yash Nirwan</span>
          <span>New York</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.04, letterSpacing: "-0.03em", maxWidth: 900 }}>
            I build systems that don&rsquo;t trust their own output.
          </div>
          <div style={{ display: "flex", marginTop: 34, alignItems: "center" }}>
            <div style={{ width: 3, height: 62, background: "#3D2ECC", marginRight: 18 }} />
            <div style={{ fontSize: 27, color: "#5D625B", maxWidth: 760, lineHeight: 1.32 }}>
              The eval, the validator, the second pass that can only remove.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
