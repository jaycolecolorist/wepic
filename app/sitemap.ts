import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { pages } from "@/lib/links";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${SITE_URL}/en${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
    alternates: { languages: { en: `${SITE_URL}/en${path}`, ar: `${SITE_URL}/ar${path}` } },
  }));
}
