import Link from "next/link";
import { CONTACT_EMAIL, WHATSAPP_NUMBER, site } from "@/config/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { Logo } from "./Logo";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const nav = [
    { path: "", label: dict.nav.home },
    { path: "/services", label: dict.nav.services },
    { path: "/studio", label: dict.nav.studio },
    { path: "/portfolio", label: dict.nav.portfolio },
    { path: "/contact", label: dict.nav.contact },
    { path: "/book", label: dict.nav.book },
  ];
  return (
    <footer className="relative overflow-hidden bg-charcoal text-white">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed text-white/70">{dict.footer.about}</p>
          <p className="mt-6 font-serif text-xl italic text-cyan-soft">{dict.common.tagline}</p>
        </div>
        <nav aria-label={dict.footer.explore} className="md:col-span-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">{dict.footer.explore}</h2>
          <ul className="mt-5 space-y-3">
            {nav.map((n) => (
              <li key={n.path}>
                <Link href={href(locale, n.path)} className="text-white/80 transition hover:text-cyan">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">{dict.footer.contact}</h2>
          <ul className="mt-5 space-y-4 text-white/80">
            <li className="flex gap-3">
              <PinIcon className="mt-1 h-4 w-4 shrink-0 text-cyan" />
              <a href={site.mapLinkUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan">
                {dict.contact.address}
              </a>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-1 h-4 w-4 shrink-0 text-cyan" />
              <a href={site.phoneHref} className="ltr hover:text-cyan">{site.phoneDisplay}</a>
            </li>
            <li className="flex gap-3">
              <WhatsAppIcon className="mt-1 h-4 w-4 shrink-0 text-cyan" />
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-cyan">
                WhatsApp
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-1 h-4 w-4 shrink-0 text-cyan" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="ltr hover:text-cyan">{CONTACT_EMAIL}</a>
            </li>
            <li className="flex gap-3">
              <InstagramIcon className="mt-1 h-4 w-4 shrink-0 text-cyan" />
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="ltr hover:text-cyan">
                {site.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {dict.meta.siteName}. {dict.footer.rights}
          </p>
          <p className="tracking-[0.25em] uppercase text-xs">{dict.common.dohaQatar}</p>
        </div>
      </div>
    </footer>
  );
}
