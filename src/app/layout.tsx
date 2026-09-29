import type { Metadata } from "next";
import { Bodoni_Moda, Newsreader, Pirata_One } from "next/font/google";
import { profile, links, SITE } from "@/lib/data";
import "./globals.css";

/* Canopee substitute, in both display roles.

   Canopee is condensed with very high stroke contrast and sharp wedge
   serifs. Playfair Display at 900 was standing in for it and is neither
   condensed nor wedge-serifed — it is wide and slab-ish, which is why the
   headings read as a different typeface to the reference. Bodoni Moda is
   genuinely narrow at display optical sizes and has the contrast, so it now
   carries the banners at 400 and the headings at 700–900.

   `opsz` is requested explicitly so the face redraws for size rather than
   being scaled, and `display: optional` because it sets the LCP line. */
const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "optional",
});

/* Editorial New substitute.

   Source Serif was standing in and is a neutral workhorse — low contrast,
   even colour, no particular voice. Editorial New is the opposite: narrow,
   fairly high contrast for a text face, open apertures, slightly odd. Of
   the free faces Newsreader is by far the closest, and it carries real
   optical sizes so it holds together from 15px to 40px. */
const body = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${gothic.variable} ${body.variable}`}>
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
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
