import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

/**
 * Translations live in /locales/<lang>.json. To edit wording, change the JSON —
 * both files must keep the same keys (run `npm run check:i18n` to verify).
 */
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export const hasLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Fill "{name}" style slots in a translated string. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Format a QAR amount the way each language expects (Latin digits in both — standard in Qatar). */
export function formatQar(amount: number, locale: Locale): string {
  const n = new Intl.NumberFormat("en-US").format(amount);
  return locale === "ar" ? `${n} ر.ق` : `QAR ${n}`;
}

/** Name of the cookie / localStorage key that remembers the visitor's language. */
export const LANG_KEY = "wepic-lang";
