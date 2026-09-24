"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fmt } from "@/lib/i18n";
import { mailtoUrl, whatsappUrl } from "@/lib/booking";
import { googleListingUrl } from "@/config/site";
import { useI18n } from "../I18nProvider";
import { CheckIcon, MailIcon, WhatsAppIcon } from "../Icons";
import { StarShape } from "./Stars";

const SERVICES = ["shoot", "package", "studio", "podcast", "other"] as const;
const MIN_CHARS = 10;
const MAX_CHARS = 800;

/**
 * "Write a review" — the site has no database, so a new review is sent to the studio
 * on WhatsApp or by email (same hand-off as bookings). The studio publishes approved
 * reviews by adding them to config/site.ts → reviews.
 */
export function WriteReview() {
  const { dict } = useI18n();
  const r = dict.review;
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [service, setService] = useState("");
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const openBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  // Closing the form hands focus back to the "Write a review" button.
  useEffect(() => {
    if (!open && wasOpen.current) openBtn.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const focusHeading = useCallback((el: HTMLHeadingElement | null) => el?.focus(), []);

  const reset = () => {
    setName(""); setRating(0); setService(""); setText(""); setConsent(false); setErrors({}); setSent(false);
  };

  const send = (via: "whatsapp" | "email") => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = r.required;
    if (!rating) e.rating = r.needRating;
    if (!text.trim()) e.text = r.required;
    else if (text.trim().length < MIN_CHARS) e.text = r.tooShort;
    if (!consent) e.consent = r.needConsent;
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const l = r.labels;
    const message = [
      `*${r.messageHeading}*`,
      "",
      `• *${l.name}:* ${name.trim()}`,
      `• *${l.rating}:* ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)`,
      ...(service ? [`• *${l.service}:* ${r.services[service as (typeof SERVICES)[number]]}`] : []),
      "",
      `*${l.review}:*`,
      text.trim(),
      "",
      `_${l.consent}_`,
    ].join("\n");
    if (via === "whatsapp") window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    else window.location.href = mailtoUrl(fmt(r.subject, { name: name.trim() }), message);
    setSent(true);
  };

  const field = (id: string) => ({
    id: `${uid}-${id}`,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${uid}-${id}-err` : undefined,
  });
  const err = (id: string) => errors[id] && <p id={`${uid}-${id}-err`} className="mt-1.5 text-sm text-red-600">{errors[id]}</p>;
  const shown = hover || rating;

  return (
    <div className="mx-auto mt-8 max-w-2xl sm:mt-12">
      {!open && (
        <div className="flex justify-center">
          <button ref={openBtn} type="button" onClick={() => setOpen(true)} aria-expanded={false} aria-controls={`${uid}-panel`} className="btn btn-primary">
            <StarShape className="h-4 w-4" /> {dict.testimonials.write}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${uid}-panel`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5 sm:rounded-3xl sm:p-10"
          >
            {sent ? (
              <div className="text-center" role="status">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan/10 text-cyan-deep">
                  <CheckIcon className="h-7 w-7" />
                </span>
                <h3 ref={focusHeading} tabIndex={-1} className="mt-5 text-2xl font-bold text-ink outline-none">{r.thanksTitle}</h3>
                <p className="mt-3 text-charcoal/70">{r.thanksBody}</p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <a href={googleListingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{r.alsoGoogle}</a>
                  <button type="button" onClick={reset} className="btn btn-outline-dark">{r.another}</button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={(e) => { e.preventDefault(); send("whatsapp"); }}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-ink">{r.title}</h3>
                  <button type="button" onClick={() => setOpen(false)} className="shrink-0 text-sm text-charcoal/60 hover:text-cyan-deep">{r.close}</button>
                </div>
                <p className="mt-2 text-charcoal/70">{r.intro}</p>

                <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6">
                  <div>
                    <label htmlFor={`${uid}-name`} className="label text-charcoal">{r.name}</label>
                    <input {...field("name")} autoFocus className="field" autoComplete="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
                    <p className="mt-1.5 text-xs text-charcoal/50">{r.nameHint}</p>
                    {err("name")}
                  </div>

                  <fieldset>
                    <legend className="label text-charcoal">{r.rating}</legend>
                    {/* Radio group: arrow keys move between stars. */}
                    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
                          <input
                            type="radio"
                            name={`${uid}-rating`}
                            id={n === 1 ? `${uid}-rating` : undefined}
                            value={n}
                            checked={rating === n}
                            onChange={() => setRating(n)}
                            aria-invalid={errors.rating ? true : undefined}
                            aria-describedby={errors.rating ? `${uid}-rating-err` : undefined}
                            className="peer sr-only"
                          />
                          <span className="sr-only">{fmt(r.stars, { n })}</span>
                          <StarShape
                            className={`h-9 w-9 rounded-md sm:h-10 sm:w-10 transition peer-focus-visible:ring-2 peer-focus-visible:ring-cyan ${n <= shown ? "text-amber-400" : "text-ink/15"}`}
                          />
                        </label>
                      ))}
                    </div>
                    {err("rating")}
                  </fieldset>

                  <div>
                    <label htmlFor={`${uid}-service`} className="label text-charcoal">{r.service}</label>
                    <select {...field("service")} className="field" value={service} onChange={(e) => setService(e.target.value)}>
                      <option value="">{r.choose}</option>
                      {SERVICES.map((s) => <option key={s} value={s}>{r.services[s]}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-text`} className="label text-charcoal">{r.text}</label>
                    <textarea {...field("text")} dir="auto" className="field" rows={5} maxLength={MAX_CHARS} placeholder={r.textPlaceholder} value={text} onChange={(e) => setText(e.target.value)} />
                    <p className="mt-1.5 text-end text-xs text-charcoal/50 ltr">{text.length}/{MAX_CHARS}</p>
                    {err("text")}
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-charcoal/80">
                      <input {...field("consent")} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-cyan-deep)]" />
                      <span>{r.consent}</span>
                    </label>
                    {err("consent")}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="submit" className="btn btn-primary flex-1"><WhatsAppIcon className="h-5 w-5" /> {r.sendWhatsapp}</button>
                    <button type="button" onClick={() => send("email")} className="btn btn-outline-dark"><MailIcon className="h-4 w-4" /> {r.sendEmail}</button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
