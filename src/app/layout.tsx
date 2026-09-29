import type { Metadata } from "next";
import { Gloock, Newsreader, Pirata_One } from "next/font/google";
import { profile, links, SITE } from "@/lib/data";
import "./globals.css";

/* Standing in for Domaine Display Condensed Medium and Canopee.

   Reading the reference's own font files settled what these actually are:
   EditorialNew-Light for text, Canopee for the giant banners, and
   DomaineDispCondMedium for every heading. The headings are CONDENSED at
   weight 500 — they read heavy because they are narrow and high-contrast,
   not because they are bold. Cranking Playfair and then Bodoni to 800 to
   chase that was solving the wrong variable.

   Measured "CREATIVE DEVELOPER" at 54px across seven free faces: Instrument
   Serif is narrowest at 424px but far too light in the stem; Bodoni Moda
   runs 622px and is not condensed at all. Gloock carries the thick stems
   and hairline thins that give Domaine its colour, which is the dominant
   character here.

   Those three are commercial (Klim, Pangram Pangram). Their woff2 files are
   served publicly but using them unlicensed on a site that carries a real
   name is not a trade worth making. */
const display = Gloock({
  variable: "--font-gloock",
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
