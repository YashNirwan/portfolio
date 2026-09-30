import type { MetadataRoute } from "next";
import { SITE, work } from "@/lib/data";

/* Derived from `work`, which is the same list generateStaticParams uses, so
   the sitemap and the routes cannot drift apart.

   It used to derive from `studies` — correct while only the three studies had
   pages, and wrong the moment every project got one: the other three were
   live, 200-ing routes that no sitemap mentioned. The rule is unchanged, only
   the list it points at: derive from whatever generates the routes, never
   from a flag that merely describes them. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...work.map((w) => ({
      url: `${SITE}/work/${w.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
