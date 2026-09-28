import type { MetadataRoute } from "next";
import { work } from "@/lib/data";

const SITE = "https://yashnirwan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const studies = work
    .filter((w) => w.hasStudy)
    .map((w) => ({
      url: `${SITE}/work/${w.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...studies,
  ];
}
