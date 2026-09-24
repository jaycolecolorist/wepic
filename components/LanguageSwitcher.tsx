"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LANG_KEY, type Locale } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

/** Remember the language in localStorage and in a cookie (the cookie lets the server redirect "/" correctly). */
export function rememberLocale(locale: Locale) {
  try {
    localStorage.setItem(LANG_KEY, locale);
  } catch {}
  document.cookie = `${LANG_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** "EN | عربي" switcher — links to the same page in the other language. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || `/${locale}`;
  const other: Locale = locale === "en" ? "ar" : "en";
  const target = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);

  // If the cookie was cleared but localStorage still remembers a choice, restore the cookie.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && !document.cookie.includes(`${LANG_KEY}=`)) rememberLocale(saved as Locale);
    } catch {}
  }, []);

  return (
    <div className={`flex items-center gap-1 text-[0.8rem] font-semibold ${className}`}>
      <span className="rounded-full bg-white/10 px-2.5 py-1 text-white" aria-current="true">
        {dict.nav.current}
      </span>
      <span aria-hidden className="text-white/30">|</span>
      <Link
        href={target}
        hrefLang={other}
        lang={other}
        onClick={() => rememberLocale(other)}
        aria-label={dict.nav.switchLabel}
        className={`rounded-full px-2.5 py-1 text-white/70 transition hover:text-cyan ${other === "ar" ? "font-arabic text-[0.95rem]" : ""}`}
      >
        {dict.nav.switchTo}
      </Link>
    </div>
  );
}
