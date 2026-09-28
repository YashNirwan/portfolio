import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Yash Nirwan — I build systems that don't trust their own output";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The share card is the highest-leverage surface on the site: it is what
   renders when someone pastes the link into Slack, and for a lot of people it
   is the only part they ever see.

   Newsreader is vendored as a static TTF rather than fetched at build:
   Satori cannot read the woff2 that next/font emits, and it cannot read a
   variable TTF either — the variable file upstream throws inside Satori's
   glyph lookup. So this is a static 400 instance, committed. The file never
   reaches a browser, it is consumed at build to rasterise this PNG, so its
   size costs visitors nothing. Without it Satori silently falls back to its
   bundled grotesque, which is the wrong typeface for a site set in serifs
   and fails quietly rather than loudly. */
export default async function OgImage() {
  const newsreader = await readFile(join(process.cwd(), "src/assets/Newsreader.ttf"));

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
          fontFamily: "Newsreader",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 21,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#5D625B",
          }}
        >
          <span>Yash Nirwan</span>
          <span>New York</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: 930,
            }}
          >
            I build systems that don&rsquo;t trust their own output.
          </div>
          <div style={{ display: "flex", marginTop: 38, alignItems: "center" }}>
            <div style={{ width: 3, height: 60, background: "#3D2ECC", marginRight: 20 }} />
            <div style={{ fontSize: 27, color: "#5D625B", maxWidth: 780, lineHeight: 1.3 }}>
              The eval, the validator, the second pass that can only remove.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Newsreader", data: newsreader, style: "normal", weight: 400 }],
    },
  );
}
