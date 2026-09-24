import { CONTACT_EMAIL, WHATSAPP_NUMBER, site } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import { ClockIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { PlaceholderBadge } from "./Placeholder";

/** Address, phone, email, Instagram and opening days — used on the home page and the contact page. */
export function ContactDetails({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  const rows = [
    { icon: PinIcon, label: c.addressLabel, value: c.address, href: site.mapLinkUrl, external: true },
    { icon: PhoneIcon, label: c.phoneLabel, value: site.phoneDisplay, href: site.phoneHref, ltr: true },
    { icon: MailIcon, label: c.emailLabel, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, ltr: true },
    { icon: InstagramIcon, label: c.instagramLabel, value: site.instagram.handle, href: site.instagram.url, external: true, ltr: true },
  ];
  return (
    <div>
      <ul className="space-y-6">
        {rows.map(({ icon: Icon, label, value, href, external, ltr }) => (
          <li key={label} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan/10 text-cyan ring-1 ring-cyan/30">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{label}</p>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`mt-1 inline-block text-lg text-white transition hover:text-cyan ${ltr ? "ltr" : ""}`}
              >
                {value}
              </a>
            </div>
          </li>
        ))}
        <li className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan/10 text-cyan ring-1 ring-cyan/30">
            <ClockIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{c.hoursLabel}</p>
            <p className="mt-1 text-lg text-white">{c.hoursValue}</p>
            {/* TODO: opening times not in the assets — set site.openTime / closeTime and update locales contact.hoursTimes */}
            <PlaceholderBadge label={c.hoursTimes} className="mt-2" />
          </div>
        </li>
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <WhatsAppIcon className="h-5 w-5" /> {c.whatsappCta}
        </a>
        <a href={site.phoneHref} className="btn btn-ghost">
          <PhoneIcon className="h-4 w-4" /> {c.callCta}
        </a>
      </div>
    </div>
  );
}
