/**
 * Offline assistant — used when no ANTHROPIC_API_KEY is configured (or the AI is unreachable).
 * Answers common questions from the locale "kb" texts and runs a step-by-step booking flow
 * that ends with the same WhatsApp / email hand-off as the booking form.
 * Runs entirely in the browser.
 */
import { site } from "@/config/site";
import { bookingLinks, isValidPhone, itemLabel, itemsFor, type BookingKind, type BookingRequest } from "@/lib/booking";
import type { Dictionary, Locale } from "@/lib/i18n";

export type Chip = { label: string; value: string };
export type BookingHandoff = { whatsapp: string; email: string; text: string };
type Step = "type" | "item" | "hours" | "date" | "time" | "name" | "phone" | "notes";
export type FlowState = { step: Step; draft: Partial<BookingRequest>; lang: Locale } | null;
export type FallbackResult = { reply: string; chips?: Chip[]; state: FlowState; booking?: BookingHandoff };

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/locales/en.json").then((m) => m.default as Dictionary),
  ar: () => import("@/locales/ar.json").then((m) => m.default as Dictionary),
};

/** Arabic script → Arabic; Latin letters → English; otherwise keep the page language. */
export function detectLanguage(text: string, fallback: Locale): Locale {
  if (/[؀-ۿ]/.test(text)) return "ar";
  if (/[a-z]/i.test(text)) return "en";
  return fallback;
}

const has = (text: string, re: RegExp) => re.test(text.toLowerCase());
const RX = {
  cancel: /\b(cancel|stop|never ?mind|quit)\b|إلغاء|الغاء|توقف|خلاص/,
  thanks: /thank|thx|شكر|مشكور|يعطيك العافية/,
  greeting: /^(hi|hello|hey|salam|good (morning|evening))\b|^(مرحب|اهل|أهل|السلام|هلا|صباح|مساء)/,
  podcast: /podcast|بودكاست|بودكاستات/,
  book: /\b(book|booking|reserve|appointment|schedule)\b|حجز|احجز|أحجز|موعد/,
  packages: /package|plan|monthly|subscription|basic|essential|premium|باق|اشتراك|شهري/,
  studio: /studio|rent|rental|hire|space|cyclorama|infinity|backdrop|استوديو|ستوديو|ستديو|إيجار|ايجار|استئجار|تأجير/,
  hours: /\bhours?\b|open|close|timing|working|when are you|ساعات|دوام|مفتوح|متى|أوقات|اوقات|مواعيد/,
  location: /where|location|address|map|direction|find you|parking|وين|أين|اين|موقع|عنوان|خريطة|مكان|الوصول/,
  contact: /phone|call|whatsapp|e-?mail|contact|instagram|number|reach|هاتف|رقم|اتصال|اتصل|واتساب|واتس|ايميل|إيميل|بريد|انستغرام|انستقرام|تواصل/,
  prices: /price|cost|how much|rate|fee|budget|سعر|أسعار|اسعار|تكلفة|كم |بكم/,
  services: /service|photograph|photo|video|shoot|reel|product|portrait|event|corporate|خدم|تصوير|فيديو|صور|ريلز|منتج|فعالي|بورتريه/,
  about: /about|who are you|wepic|mission|vision|founded|من أنتم|من انتم|عنكم|رؤية|رسالة|تأسس/,
  no: /^(no|nope|none|nothing|skip|n\/a|-)$|^(لا|لا يوجد|لايوجد|ما في|مافي|بدون)$/,
};

const kindChips = (d: Dictionary): Chip[] => (["package", "service", "studio"] as BookingKind[]).map((k) => ({ label: d.booking.types[k], value: `kind:${k}` }));
const itemChips = (kind: BookingKind, d: Dictionary, lang: Locale): Chip[] =>
  itemsFor(kind).map((id) => ({ label: itemLabel(kind, id, d, lang).split(" — ")[0], value: `item:${id}` }));

function matchKind(text: string): BookingKind | null {
  if (text.startsWith("kind:")) return text.slice(5) as BookingKind;
  if (has(text, RX.studio)) return "studio";
  if (has(text, RX.packages)) return "package";
  if (has(text, RX.services)) return "service";
  return null;
}

function matchItem(kind: BookingKind, text: string, d: Dictionary, lang: Locale): string | null {
  if (text.startsWith("item:")) return text.slice(5);
  const t = text.toLowerCase();
  for (const id of itemsFor(kind)) {
    const label = itemLabel(kind, id, d, lang).toLowerCase();
    const name = label.split(" — ")[0].split(" (")[0];
    if (t.includes(id.toLowerCase()) || t.includes(name) || (t.length >= 3 && name.includes(t))) return id;
  }
  if (kind === "studio") {
    if (/half|نصف/.test(t)) return "halfDay";
    if (/full|whole|day|كامل|يوم/.test(t)) return "fullDay";
    if (/hour|ساع/.test(t)) return "hourly";
  }
  return null;
}

/** Package named in a free-text message ("book the premium package"). */
function mentionedPackage(text: string, d: Dictionary, en: Dictionary): string | null {
  const t = text.toLowerCase();
  for (const id of itemsFor("package")) {
    const names = [id, d.packages.items[id as "basic"].name.toLowerCase(), en.packages.items[id as "basic"].name.toLowerCase()];
    if (names.some((n) => t.includes(n))) return id;
  }
  return null;
}

function nextStep(state: NonNullable<FlowState>, d: Dictionary): FallbackResult {
  const { draft, lang } = state;
  const f = d.flow;
  if (!draft.kind) return { reply: f.askType, chips: kindChips(d), state: { ...state, step: "type" } };
  if (!draft.item) {
    const ask = draft.kind === "package" ? f.askPackage : draft.kind === "service" ? f.askService : f.askStudio;
    return { reply: ask, chips: itemChips(draft.kind, d, lang), state: { ...state, step: "item" } };
  }
  if (draft.kind === "studio" && draft.item === "hourly" && !draft.hours)
    return { reply: f.askHours, chips: [1, 2, 3, 4].map((n) => ({ label: String(n), value: String(n) })), state: { ...state, step: "hours" } };
  if (!draft.date) return { reply: f.askDate, state: { ...state, step: "date" } };
  if (!draft.time) return { reply: f.askTime, state: { ...state, step: "time" } };
  if (!draft.name) return { reply: f.askName, state: { ...state, step: "name" } };
  if (!draft.phone) return { reply: f.askPhone, state: { ...state, step: "phone" } };
  if (draft.notes === undefined) return { reply: f.askNotes, chips: [{ label: f.skip, value: "notes:none" }], state: { ...state, step: "notes" } };

  const links = bookingLinks(draft as BookingRequest, d, lang);
  return { reply: `${d.chat.bookingReady}\n\n${links.text.replace(/\*/g, "").replace(/^_|_$/gm, "")}`, state: null, booking: links };
}

/**
 * Produce the offline assistant's answer.
 * @param text   what the visitor typed (or a chip's value such as "item:premium")
 * @param state  booking-flow state from the previous turn
 * @param pageLocale language of the page, used when the message has no letters (e.g. a phone number)
 */
export async function fallbackReply(text: string, state: FlowState, pageLocale: Locale): Promise<FallbackResult> {
  const raw = text.trim();
  const lang = state?.lang ?? detectLanguage(raw, pageLocale);
  const d = await loaders[lang]();
  const en = lang === "en" ? d : await loaders.en();

  // ---- inside the booking flow ------------------------------------------------
  if (state) {
    if (has(raw, RX.cancel)) return { reply: d.flow.cancelled, state: null, chips: startChips(d) };
    const draft = { ...state.draft };
    switch (state.step) {
      case "type": {
        const k = matchKind(raw);
        if (!k) return { reply: d.flow.askType, chips: kindChips(d), state };
        draft.kind = k;
        break;
      }
      case "item": {
        const item = matchItem(draft.kind!, raw, d, lang);
        if (!item) return nextStep({ ...state, draft }, d);
        draft.item = item;
        break;
      }
      case "hours": {
        const n = parseInt(raw.replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c))), 10);
        if (!n || n < 1 || n > 12) return nextStep({ ...state, draft }, d);
        draft.hours = n;
        break;
      }
      case "date":
        draft.date = raw;
        break;
      case "time":
        draft.time = raw;
        break;
      case "name":
        draft.name = raw;
        break;
      case "phone":
        if (!isValidPhone(raw)) return { reply: d.flow.invalidPhone, state };
        draft.phone = raw;
        break;
      case "notes":
        draft.notes = raw === "notes:none" || has(raw, RX.no) ? "" : raw;
        break;
    }
    return nextStep({ ...state, draft }, d);
  }

  // ---- chips from a previous answer (kind:/item:) start a booking directly ----
  if (raw.startsWith("kind:")) return nextStep({ step: "type", lang, draft: { kind: raw.slice(5) as BookingKind } }, d);
  if (raw.startsWith("item:")) return nextStep({ step: "item", lang, draft: { kind: "package", item: raw.slice(5) } }, d);

  // ---- questions -------------------------------------------------------------
  if (has(raw, RX.thanks)) return { reply: d.kb.thanks, state: null };
  if (has(raw, RX.book)) {
    const pkg = mentionedPackage(raw, d, en);
    const kind: BookingKind | undefined = pkg ? "package" : has(raw, RX.studio) || has(raw, RX.podcast) ? "studio" : undefined;
    return nextStep({ step: "type", lang, draft: { kind, item: pkg ?? undefined } }, d);
  }
  if (has(raw, RX.podcast)) return { reply: d.kb.podcast, state: null, chips: [{ label: d.chat.chips.book, value: "kind:studio" }] };
  if (has(raw, RX.packages)) return { reply: d.kb.packages, state: null, chips: itemChips("package", d, lang).map((c) => ({ ...c, label: `${d.chat.chips.book}: ${c.label}` })) };
  if (has(raw, RX.studio)) return { reply: d.kb.studio, state: null, chips: [{ label: d.chat.chips.book, value: "kind:studio" }] };
  if (has(raw, RX.hours)) return { reply: d.kb.hours, state: null };
  if (has(raw, RX.location)) return { reply: d.kb.location.replace("{map}", site.mapLinkUrl), state: null };
  if (has(raw, RX.contact)) return { reply: d.kb.contact, state: null };
  if (has(raw, RX.prices)) return { reply: d.kb.prices, state: null, chips: startChips(d) };
  if (has(raw, RX.services)) return { reply: d.kb.services, state: null, chips: [{ label: d.chat.chips.book, value: "kind:service" }] };
  if (has(raw, RX.about)) return { reply: d.kb.about, state: null };
  if (has(raw, RX.greeting)) return { reply: d.kb.greeting, state: null, chips: startChips(d) };
  return { reply: d.kb.unknown, state: null, chips: startChips(d) };
}

export function startChips(d: Dictionary): Chip[] {
  const c = d.chat.chips;
  return [
    { label: c.packages, value: c.packages },
    { label: c.studio, value: c.studio },
    { label: c.hours, value: c.hours },
    { label: c.book, value: c.book },
  ];
}
