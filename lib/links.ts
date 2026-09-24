import type { Locale } from "./i18n";

export const pages = ["", "/services", "/studio", "/portfolio", "/contact", "/book"] as const;
export type PagePath = (typeof pages)[number];

/** Localized internal link: href("ar", "/studio") → "/ar/studio". */
export const href = (locale: Locale, path: string = "") => `/${locale}${path}`;
