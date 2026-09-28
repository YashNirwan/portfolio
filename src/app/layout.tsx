import type { Metadata } from "next";
import { Archivo, Literata } from "next/font/google";
import { profile, links, SITE } from "@/lib/data";
import "./globals.css";

/* The `wdth` axis has to be requested explicitly — next/font ships only
   `wght` by default to keep the file small. Without it the expanded setting
   this whole design rests on silently does nothing, which is exactly the kind
   of failure that looks like a taste problem rather than a config one.

   `display: optional` because Archivo renders the LCP line on every route,
   and a headline that repaints mid-view is worse than one first visit in the
   fallback. */
const display = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "optional",
});

/* Drawn for Google Books: warm, sturdy, low-contrast, and engineered for long
   reading at low contrast — which is precisely what body copy sitting on a
   crimson field has to survive. */
const body = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-svh">
        <a
          href="#main"
          className="trim sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-bone focus:px-4 focus:py-2 focus:text-iron"
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
