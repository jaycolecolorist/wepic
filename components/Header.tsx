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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        // No backdrop-filter while the menu is open: it would trap the fixed-position menu inside the header box.
        open
          ? "bg-midnight"
          : scrolled
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

      <AnimatePresence>
        {open && (
          <>
            {/* Blurred page behind the menu — tap it to close. */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 bottom-0 top-16 bg-midnight/40 backdrop-blur-md sm:top-[72px] lg:hidden"
            />
            <motion.nav
              id="mobile-menu"
              aria-label={dict.nav.primary}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-b-3xl bg-midnight shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 lg:hidden"
            >
              <div className="container-x pb-6 pt-2">
                <ul className="flex flex-col">
                  {nav.map((item, i) => (
                    <motion.li key={item.path} initial={{ opacity: 0, x: locale === "ar" ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.05 }}>
                      <Link
                        href={href(locale, item.path)}
                        aria-current={isActive(item.path) ? "page" : undefined}
                        className={`display flex items-center justify-between border-b border-white/[0.07] py-3 text-lg ${isActive(item.path) ? "text-cyan" : "text-white"}`}
                      >
                        {item.label}
                        {isActive(item.path) && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <LanguageSwitcher />
                  <Link href={href(locale, "/book")} className="btn btn-primary !min-h-10 !px-5 !py-2">
                    {dict.nav.book}
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
