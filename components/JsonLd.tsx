import { CONTACT_EMAIL, SITE_URL, packages, site } from "@/config/site";
import { getDictionary, type Locale } from "@/lib/i18n";

/** schema.org LocalBusiness markup so search engines show the studio's address, phone and packages. */
export function LocalBusinessJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#business`,
    name: "WEPIC Photography",
    alternateName: "ويبك للتصوير",
    description: dict.meta.siteDescription,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/icon.svg`,
    telephone: "+97433883327",
    email: CONTACT_EMAIL,
    foundingDate: String(site.founded),
    priceRange: "QAR",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "Country", name: "Qatar" },
    sameAs: [site.instagram.url],
    // Opening times are unknown (only the days are), so hours are published only once both are set.
    ...(site.openTime && site.closeTime
      ? {
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: site.openDays, opens: site.openTime, closes: site.closeTime },
          ],
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.packages.title,
      itemListElement: packages.map((p) => ({
        "@type": "Offer",
        name: dict.packages.items[p.id].name,
        price: p.priceQar,
        priceCurrency: "QAR",
        description: dict.packages.items[p.id].features.join(", "),
      })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
