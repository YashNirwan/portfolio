import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";
import { studies } from "@/lib/studies";

/* Derived from `studies`, which is the same list generateStaticParams uses.
   Deriving it from data.ts's `hasStudy` flag instead meant a study could exist
   as a real, 200-ing route while being invisible to the sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...studies.map((s) => ({
      url: `${SITE}/work/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
