/**
 * Booking hand-off: turns a booking request into a neatly formatted message and
 * the WhatsApp / email links that carry it. There is no payment backend — the
 * studio receives the request in WhatsApp (or email) and confirms it manually.
 *
 * Used by the booking form (browser) AND the AI assistant (server), so both
 * produce exactly the same message.
 */
import {
  CONTACT_EMAIL,
  WHATSAPP_NUMBER,
  packages,
  rentalPlans,
  services,
  type PackageId,
  type RentalId,
  type ServiceId,
} from "@/config/site";
import { fmt, formatQar, type Dictionary, type Locale } from "@/lib/i18n";

export type BookingKind = "package" | "service" | "studio";

export interface BookingRequest {
  kind: BookingKind;
  /** PackageId, ServiceId or RentalId depending on `kind`. */
  item: string;
  /** Only for hourly studio rental. */
  hours?: number;
  /** ISO date (YYYY-MM-DD) from the form, or free text from the chat ("next Tuesday"). */
  date: string;
  /** "14:30" from the form, or free text from the chat. */
  time: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export const bookingKinds: BookingKind[] = ["package", "service", "studio"];

export function itemsFor(kind: BookingKind): string[] {
  if (kind === "package") return packages.map((p) => p.id);
  if (kind === "service") return services.map((s) => s.id);
  return rentalPlans.map((r) => r.id);
}

export function isValidItem(kind: BookingKind, item: string): boolean {
  return itemsFor(kind).includes(item);
}

/** Human label for the chosen package / service / rental plan, in the given language. */
export function itemLabel(kind: BookingKind, item: string, dict: Dictionary, locale: Locale): string {
  if (kind === "package") {
    const pkg = packages.find((p) => p.id === item);
    const name = dict.packages.items[item as PackageId]?.name ?? item;
    return pkg ? `${name} — ${formatQar(pkg.priceQar, locale)} ${dict.common.perMonth}` : name;
  }
  if (kind === "service") return dict.services.items[item as ServiceId]?.title ?? item;
  const plan = dict.studio.rates[item as RentalId];
  return plan ? `${plan.name} (${plan.duration})` : item;
}

/** Pretty date for the message. ISO dates are formatted; anything else is kept as typed. */
export function formatDate(date: string, locale: Locale): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!m) return date.trim();
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-QA-u-nu-latn" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** "14:30" → "2:30 PM" / "2:30 م". Free text is kept as typed. */
export function formatTime(time: string, locale: Locale): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return time.trim();
  const d = new Date(Date.UTC(2000, 0, 1, +m[1], +m[2]));
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-QA-u-nu-latn" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(d);
}

/** Accepts local Qatari numbers (8 digits) and international numbers (7–15 digits). */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, "");
  return /^[+\d\s\-().]+$/.test(phone.trim()) && digits.length >= 7 && digits.length <= 15;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Builds the WhatsApp-friendly booking summary (*bold* is WhatsApp formatting). */
export function buildBookingMessage(req: BookingRequest, dict: Dictionary, locale: Locale) {
  const s = dict.booking.summary;
  const item = itemLabel(req.kind, req.item, dict, locale);
  const date = formatDate(req.date, locale);
  const lines: [string, string | undefined][] = [
    [s.type, dict.booking.types[req.kind]],
    [s.item, item],
    [s.hours, req.kind === "studio" && req.item === "hourly" && req.hours ? String(req.hours) : undefined],
    [s.date, date],
    [s.time, formatTime(req.time, locale)],
    [s.name, req.name.trim()],
    [s.phone, req.phone.trim()],
    [s.email, req.email?.trim() || undefined],
    [s.notes, req.notes?.trim() || undefined],
  ];
  const body = [
    `*${s.heading}*`,
    "",
    ...lines.filter(([, v]) => v).map(([k, v]) => `• *${k}:* ${v}`),
    "",
    `_${s.footer}_`,
  ].join("\n");
  const subject = fmt(s.subject, { item: itemLabel(req.kind, req.item, dict, locale).split(" — ")[0], date });
  return { text: body, subject };
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function mailtoUrl(subject: string, body: string): string {
  // Email clients don't render WhatsApp *bold* / _italic_ markers, so strip them.
  const plain = body.replace(/\*([^*\n]+)\*/g, "$1").replace(/^_(.+)_$/gm, "$1");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain)}`;
}

/** Everything a UI needs to hand the booking off. */
export function bookingLinks(req: BookingRequest, dict: Dictionary, locale: Locale) {
  const { text, subject } = buildBookingMessage(req, dict, locale);
  return { text, subject, whatsapp: whatsappUrl(text), email: mailtoUrl(subject, text) };
}
