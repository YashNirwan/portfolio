import type { Metadata } from "next";
import { Newsreader, Source_Serif_4, Archivo_Narrow } from "next/font/google";
import { profile, links, SITE } from "@/lib/data";
import "./globals.css";

/* Newsreader carries real optical sizes, so it holds its drawing at 80px
   instead of looking like a text face that got stretched. It is set
   `display: optional` on purpose: it renders the LCP headline, and a headline
   that repaints mid-view is worse than one first visit in the fallback. */
const display = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "optional",
  weight: ["400"],
  style: ["normal", "italic"],
});

/* The body face sets metrics inline in prose constantly, so it was chosen for
   its figure set as much as its texture. `swap` here because body copy
   appearing late is worse than body copy shifting slightly. */
const body = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

/* Narrow is a functional choice, not a stylistic one — this face only ever
   sets the margin column, and that column is 17rem wide. */
const util = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
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
    <html lang="en" className={`${display.variable} ${body.variable} ${util.variable}`}>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:font-util focus:text-sm focus:tracking-wide focus:text-paper"
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
