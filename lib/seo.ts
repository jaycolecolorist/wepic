import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import { getDictionary, type Locale } from "./i18n";

/** Per-page metadata with hreflang alternates and Open Graph tags in the right language. */
export function pageMetadata(locale: Locale, path: string, title?: string, description?: string): Metadata {
  const dict = getDictionary(locale);
  const fullTitle = title ? `${title} | ${dict.meta.siteName}` : dict.meta.siteTitle;
  const desc = description ?? dict.meta.siteDescription;
  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: { en: `${SITE_URL}/en${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}/en${path}` },
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: fullTitle,
      description: desc,
      url: `${SITE_URL}/${locale}${path}`,
      locale: locale === "ar" ? "ar_QA" : "en_QA",
      alternateLocale: locale === "ar" ? ["en_QA"] : ["ar_QA"],
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: dict.meta.siteName }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [`${SITE_URL}/og-image.jpg`] },
  };
}
