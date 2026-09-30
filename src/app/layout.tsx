import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, Pirata_One } from "next/font/google";
import { profile, links, SITE } from "@/lib/data";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CurtainProvider } from "@/components/curtain";

/* Standing in for Canopee (banners) and Domaine Display Condensed (headings).

   Both are retail and unbought on purpose — the owner's rule is no spend,
   and Canopée is VJ Type's, commercial-licence only (its free download is
   for testing). The reference's CDN serves the files; using them unlicensed
   on a site that carries a real name is not a trade worth making.

   Gloock stood in until 2026-09-30, chosen because Instrument Serif had been
   measured and rejected as "far too light in the stem". That was right about
   the weight and cost everything else: measured on "INTERACTIVE" at 100px
   caps, Canopee sets it ~354px wide, Gloock 664px — 1.88x — which is why
   every display line on this site read wide and blown out against the
   reference. Instrument Serif sets it 467px (1.32x), the closest free face
   with the reference's character: tall, condensed, high-contrast, sharp.
   Ranked against it and rejected: Roboto Serif at wdth 50 (1.41x, right
   weight, but reads as a news slab), Oranienbaum (1.47x, light), Noto Serif
   Display at its narrowest (1.68x — its width axis only condenses 17%),
   Stint Ultra Condensed (1.06x, a slab serif).

   The stem weight it lacks is put back with a hairline of its own colour —
   `-webkit-text-stroke: 0.016em` on the display roles in globals.css, and
   `stroke` on the SVG banners — which is what makes it read at Canopee's
   colour rather than as a light cut. */
const display = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  display: "optional",
});

/* Editorial New substitute.

   Source Serif was standing in and is a neutral workhorse — low contrast,
   even colour, no particular voice. Editorial New is the opposite: narrow,
   fairly high contrast for a text face, open apertures, slightly odd. Of
   the free faces Newsreader is by far the closest, and it carries real
   optical sizes so it holds together from 15px to 40px. */
/* No explicit weight array. Newsreader is variable, and asking for a list
   of weights alongside italic makes the loader emit several font queries,
   which Turbopack's resolver rejects outright with "next/font/google queries
   have exactly one entry". Left variable, the full 200-800 range is
   available and the CSS picks weights from it. */
const body = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Germgoth substitute — the blackletter nameplate and the drop cap. */
const gothic = Pirata_One({
  variable: "--font-pirata",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/* The sentence that has to survive being pasted into Slack with no page
   around it. The old one listed five job titles. */
const SUMMARY =
  "I build systems that don't trust their own output — the eval, the validator, the second pass that can only remove. New York.";

/* No `alternates.canonical` here. Root metadata is inherited by every
   descendant that does not override it, so a canonical of "/" on the layout
   made every 404 on the domain declare itself the homepage. Canonicals belong
   on the pages that own them. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Yash Nirwan",
  description: SUMMARY,
  openGraph: {
    title: "Yash Nirwan",
    description: SUMMARY,
    url: SITE,
    siteName: "Yash Nirwan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Nirwan",
    description: SUMMARY,
  },
};

/* Person schema is what recruiter tooling and LLM-based search actually read.
   Every field here is checkable against the rest of the site. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE}#person`,
  name: profile.name,
  email: links.email,
  url: SITE,
  address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "New York University" },
    { "@type": "CollegeOrUniversity", name: "Ramaiah Institute of Technology" },
  ],
  knowsAbout: [
    "Model evaluation",
    "Agent systems",
    "Data validation",
    "Product management",
    "Analytics",
  ],
  sameAs: [links.github, links.linkedin],
};

/* data-scroll-behavior="smooth" is required, not decorative. globals.css sets
   `scroll-behavior: smooth` on html for in-page jumps. Next 15 and earlier
   suppressed that during route transitions; Next 16 stopped, and without this
   attribute it does not suppress it again — so opening a project from the
   catalogue smooth-SCROLLS to the top over several hundred milliseconds
   instead of arriving there, which drags against the folder view-transition.
   Dev logs this as an advisory on every boot. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${gothic.variable} ${body.variable}`}
    >
      {/* Browser extensions write attributes onto <body> before React
          hydrates — Grammarly adds data-gr-ext-installed and
          data-new-gr-c-s-check-loaded — which React then reports as a
          hydration mismatch the app cannot fix.

          This is narrower than it looks: suppressHydrationWarning only
          applies one level deep, to this element's own attributes and text.
          It does not reach any child, so it cannot hide a real hydration bug
          inside the tree. */}
      <body className="min-h-svh" suppressHydrationWarning>
        <a
          href="#main"
          className="byline sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-parchment"
        >
          Skip to content
        </a>
        <CurtainProvider>{children}</CurtainProvider>
        <SmoothScroll />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
