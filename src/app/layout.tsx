import type { Metadata } from "next";
import { Bodoni_Moda, Playfair_Display, Source_Serif_4, Pirata_One } from "next/font/google";
import { profile, links, SITE } from "@/lib/data";
import "./globals.css";

/* Canopee substitute. A didone's hairline-to-stem contrast is invisible at
   17px and spectacular at 300px, which is the only reason display type this
   large has a reason to exist. `opsz` is requested explicitly so the face
   actually redraws for size rather than being scaled up.

   `display: optional` because this sets the LCP banner, and a banner that
   repaints mid-view is worse than one first visit in the fallback. */
const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "optional",
});

/* Domaine substitute — the bridge between the banner's drama and the body's
   restraint. Used for headlines and card titles, never for running text. */
const mid = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

/* Germgoth substitute. The real site sets its centre nameplate in blackletter
   — a detail no token file mentions, and one of the things that makes it read
   as an old paper rather than a modern serif site. Used exactly twice. */
const gothic = Pirata_One({
  variable: "--font-pirata",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/* Editorial New substitute. Weight 300 only, per the spec: heavier weights
   break the editorial restraint that holds the whole page together. */
const body = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
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
    <html lang="en" className={`${display.variable} ${mid.variable} ${gothic.variable} ${body.variable}`}>
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
