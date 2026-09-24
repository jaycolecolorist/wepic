"use client";
import { useId, useState } from "react";
import { fmt } from "@/lib/i18n";
import { isValidPhone, mailtoUrl, whatsappUrl } from "@/lib/booking";
import { useI18n } from "../I18nProvider";
import { MailIcon, WhatsAppIcon } from "../Icons";

/** General enquiry form — hands the message to WhatsApp or email, like the booking form. */
export function ContactForm() {
  const { dict } = useI18n();
  const c = dict.contact;
  const b = dict.booking;
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);

  const send = (via: "whatsapp" | "email") => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = b.required;
    if (!phone.trim()) e.phone = b.required;
    else if (!isValidPhone(phone)) e.phone = b.invalidPhone;
    if (!message.trim()) e.message = b.required;
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const text = [`*${c.messageHeading}*`, "", `• *${b.summary.name}:* ${name.trim()}`, `• *${b.summary.phone}:* ${phone.trim()}`, "", message.trim()].join("\n");
    if (via === "whatsapp") {
      window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
      setStatus(c.sent);
    } else {
      window.location.href = mailtoUrl(fmt(c.messageSubject, { name: name.trim() }), text);
      setStatus(c.sentEmail);
    }
  };

  const field = (id: string) => ({
    id: `${uid}-${id}`,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${uid}-${id}-err` : undefined,
  });
  const err = (id: string) => errors[id] && <p id={`${uid}-${id}-err`} className="mt-1.5 text-sm text-red-600">{errors[id]}</p>;

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); send("whatsapp"); }} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-name`} className="label text-charcoal">{b.nameLabel}</label>
        <input {...field("name")} className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        {err("name")}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className="label text-charcoal">{b.phoneLabel}</label>
        <input {...field("phone")} className="field rtl:text-end" type="tel" dir="ltr" autoComplete="tel" placeholder={b.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} />
        {err("phone")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-message`} className="label text-charcoal">{c.message}</label>
        <textarea {...field("message")} className="field" rows={5} placeholder={c.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} />
        {err("message")}
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button type="submit" className="btn btn-primary flex-1"><WhatsAppIcon className="h-5 w-5" /> {c.sendWhatsapp}</button>
        <button type="button" onClick={() => send("email")} className="btn btn-outline-dark"><MailIcon className="h-4 w-4" /> {c.sendEmail}</button>
      </div>
      <p role="status" className="text-sm font-semibold text-cyan-deep sm:col-span-2">{status}</p>
    </form>
  );
}
