"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { href } from "@/lib/links";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "./I18nProvider";

export function Header() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const nav = [
    { path: "", label: dict.nav.home },
    { path: "/services", label: dict.nav.services },
    { path: "/studio", label: dict.nav.studio },
    { path: "/portfolio", label: dict.nav.portfolio },
    { path: "/contact", label: dict.nav.contact },
  ];
  const current = (pathname || "").replace(/\/$/, "");
  const isActive = (path: string) => (path === "" ? current === href(locale) : current.startsWith(href(locale, path)));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and with Escape; lock page scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const rtl = locale === "ar";
  const ease = [0.22, 1, 0.36, 1] as const;
  const duration = 0.45;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        open || scrolled
            ? "bg-midnight/85 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
            : "bg-gradient-to-b from-midnight/70 to-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-midnight">
        {dict.nav.skip}
      </a>
      <div className="container-x relative flex h-16 items-center sm:h-[72px] justify-between gap-6">
        <Link href={href(locale)} aria-label={dict.meta.siteName} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label={dict.nav.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.path}>
                <Link
                  href={href(locale, item.path)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition ${
                    isActive(item.path) ? "text-cyan" : "text-white/80 hover:text-white"
                  } ${locale === "ar" ? "text-[0.95rem] normal-case" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          <Link href={href(locale, "/book")} className="btn btn-primary hidden !min-h-10 !px-5 !py-2 md:inline-flex">
            {dict.nav.book}
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-0.5 w-6 bg-current transition ${open ? "rotate-45" : "-translate-y-2"}`} />
            <span className={`absolute h-0.5 w-6 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute h-0.5 w-6 bg-current transition ${open ? "-rotate-45" : "translate-y-2"}`} />
          </button>
        </div>
      </div>


    </header>

    {/* Mobile menu: slides in from the side (right in English, left in Arabic) with the page blurring
        behind it at the same pace. Lives outside <header> so the header's blur can't trap it. */}
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration, ease }}
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-[65] bg-midnight/45 sm:top-[72px] lg:hidden"
          />
          <motion.nav
            id="mobile-menu"
            aria-label={dict.nav.primary}
            initial={{ x: rtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: rtl ? "-100%" : "100%" }}
            transition={{ duration, ease }}
            className="fixed bottom-0 end-0 top-16 z-[65] flex w-[min(78vw,320px)] flex-col overflow-y-auto border-s border-white/10 bg-midnight shadow-[0_0_60px_-10px_rgba(0,0,0,0.9)] sm:top-[72px] lg:hidden"
          >
            <ul className="flex flex-col px-6 pt-4">
              {nav.map((item, i) => (
                <motion.li key={item.path} initial={{ opacity: 0, x: rtl ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.12, duration: 0.35, ease }}>
                  <Link
                    href={href(locale, item.path)}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    className={`display flex items-center justify-between border-b border-white/[0.07] py-3.5 text-lg ${isActive(item.path) ? "text-cyan" : "text-white"}`}
                  >
                    {item.label}
                    {isActive(item.path) && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-4 px-6 pb-8 pt-6">
              <Link href={href(locale, "/book")} className="btn btn-primary w-full">
                {dict.nav.book}
              </Link>
              <LanguageSwitcher className="justify-center" />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
