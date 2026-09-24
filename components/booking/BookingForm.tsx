"use client";
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  bookingKinds,
  bookingLinks,
  isValidEmail,
  isValidItem,
  isValidPhone,
  itemLabel,
  itemsFor,
  type BookingKind,
  type BookingRequest,
} from "@/lib/booking";
import { useI18n } from "../I18nProvider";
import { CheckIcon, MailIcon, WhatsAppIcon } from "../Icons";

type Errors = Partial<Record<keyof BookingRequest, string>>;

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Booking form for packages, services and studio rental.
 * On submit it opens WhatsApp with a pre-filled summary (or the email app), then shows a confirmation.
 */
export function BookingForm({ initialType = "package", initialItem, lockType = false }: { initialType?: BookingKind; initialItem?: string; lockType?: boolean }) {
  const { locale, dict } = useI18n();
  const b = dict.booking;
  const uid = useId();
  const [kind, setKind] = useState<BookingKind>(initialType);
  const [form, setForm] = useState<BookingRequest>(() => ({
    kind: initialType,
    item: initialItem && isValidItem(initialType, initialItem) ? initialItem : itemsFor(initialType)[initialType === "package" ? 1 : 0],
    hours: 2,
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<null | { via: "whatsapp" | "email"; url: string }>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const set = <K extends keyof BookingRequest>(key: K, value: BookingRequest[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const changeKind = (k: BookingKind) => {
    setKind(k);
    setForm((f) => ({ ...f, kind: k, item: itemsFor(k)[k === "package" ? 1 : 0] }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.date) e.date = b.required;
    else if (form.date < today()) e.date = b.pastDate;
    if (!form.time) e.time = b.required;
    if (!form.name.trim()) e.name = b.required;
    if (!form.phone.trim()) e.phone = b.required;
    else if (!isValidPhone(form.phone)) e.phone = b.invalidPhone;
    if (form.email && !isValidEmail(form.email)) e.email = b.invalidEmail;
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    return !first;
  };

  const send = (via: "whatsapp" | "email") => {
    if (!validate()) return;
    const links = bookingLinks(form, dict, locale);
    const url = via === "whatsapp" ? links.whatsapp : links.email;
    if (via === "whatsapp") window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    setSent({ via, url });
  };

  const fieldProps = (name: keyof BookingRequest) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-err` : undefined,
    className: "field field-dark",
  });
  const Err = ({ name }: { name: keyof BookingRequest }) =>
    errors[name] ? (
      <p id={`${uid}-${name}-err`} className="mt-1.5 text-sm text-red-300">
        {errors[name]}
      </p>
    ) : null;

  const itemFieldLabel = kind === "package" ? b.packageLabel : kind === "service" ? b.serviceLabel : b.studioLabel;

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center" role="status">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan/15 text-cyan ring-1 ring-cyan/40 shadow-[0_0_40px_-6px_rgba(0,175,239,0.7)]">
            <CheckIcon className="h-8 w-8" />
          </span>
          {/* focus the confirmation when it appears (after the exit animation), for keyboard & screen-reader users */}
          <h3 ref={(el) => el?.focus()} tabIndex={-1} className="display mt-6 text-3xl outline-none">
            {b.confirmTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-lg text-white/80">{sent.via === "whatsapp" ? b.confirmBody : b.confirmEmail}</p>
          <p className="mt-6 text-sm text-white/50">{b.popupHint}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href={sent.url} target={sent.via === "whatsapp" ? "_blank" : undefined} rel="noopener noreferrer" className="btn btn-primary">
              {sent.via === "whatsapp" ? <WhatsAppIcon className="h-5 w-5" /> : <MailIcon className="h-5 w-5" />}
              {sent.via === "whatsapp" ? b.reopen : b.reopenEmail}
            </a>
            <button type="button" onClick={() => setSent(null)} className="btn btn-ghost">
              {b.another}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            send("whatsapp");
          }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {!lockType && (
            <fieldset className="sm:col-span-2">
              <legend className="label">{b.typeLabel}</legend>
              <div className="grid grid-cols-3 gap-2" role="radiogroup">
                {bookingKinds.map((k) => (
                  <label
                    key={k}
                    className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-sm font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan ${
                      kind === k ? "bg-cyan text-midnight" : "bg-white/5 text-white/75 ring-1 ring-white/10 hover:text-white"
                    }`}
                  >
                    <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => changeKind(k)} className="sr-only" />
                    {b.types[k]}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className={kind === "studio" && form.item === "hourly" ? "" : "sm:col-span-2"}>
            <label htmlFor={`${uid}-item`} className="label">{itemFieldLabel}</label>
            <select {...fieldProps("item")} value={form.item} onChange={(e) => set("item", e.target.value)}>
              {itemsFor(kind).map((id) => (
                <option key={id} value={id}>
                  {itemLabel(kind, id, dict, locale)}
                </option>
              ))}
            </select>
          </div>
          {kind === "studio" && form.item === "hourly" && (
            <div>
              <label htmlFor={`${uid}-hours`} className="label">{b.hoursLabel}</label>
              <input {...fieldProps("hours")} type="number" min={1} max={12} inputMode="numeric" value={form.hours ?? 1} onChange={(e) => set("hours", Math.max(1, Math.min(12, Number(e.target.value) || 1)))} />
            </div>
          )}

          <div>
            <label htmlFor={`${uid}-date`} className="label">{b.dateLabel}</label>
            <input {...fieldProps("date")} type="date" min={today()} value={form.date} onChange={(e) => set("date", e.target.value)} required />
            <Err name="date" />
          </div>
          <div>
            <label htmlFor={`${uid}-time`} className="label">{b.timeLabel}</label>
            <input {...fieldProps("time")} type="time" step={900} value={form.time} onChange={(e) => set("time", e.target.value)} required />
            <Err name="time" />
          </div>
          <div>
            <label htmlFor={`${uid}-name`} className="label">{b.nameLabel}</label>
            <input {...fieldProps("name")} type="text" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            <Err name="name" />
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className="label">{b.phoneLabel}</label>
            <input {...fieldProps("phone")} type="tel" dir="ltr" autoComplete="tel" inputMode="tel" placeholder={b.phonePlaceholder} value={form.phone} onChange={(e) => set("phone", e.target.value)} required className="field field-dark rtl:text-end" />
            <Err name="phone" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-email`} className="label">{b.emailLabel}</label>
            <input {...fieldProps("email")} type="email" dir="ltr" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="field field-dark rtl:text-end" />
            <Err name="email" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-notes`} className="label">{b.notesLabel}</label>
            <textarea {...fieldProps("notes")} rows={3} placeholder={b.notesPlaceholder} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2 2xl:flex-row">
            <button type="submit" className="btn btn-primary flex-1">
              <WhatsAppIcon className="h-5 w-5" /> {b.submit}
            </button>
            <button type="button" onClick={() => send("email")} className="btn btn-ghost">
              <MailIcon className="h-4 w-4" /> {b.sendEmail}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
