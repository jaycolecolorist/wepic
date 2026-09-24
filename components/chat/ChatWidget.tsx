"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fallbackReply, startChips, type BookingHandoff, type Chip, type FlowState } from "@/lib/assistant/fallback";
import { useI18n } from "../I18nProvider";
import { Monogram } from "../Logo";
import { ChatIcon, CloseIcon, MailIcon, SendIcon, WhatsAppIcon } from "../Icons";
import { IS_STATIC_EXPORT } from "@/lib/asset";

type Msg = { id: number; role: "user" | "assistant"; text: string; booking?: BookingHandoff; local?: boolean };
type Mode = "unknown" | "ai" | "offline";

let nextId = 1;

/** Turns URLs in a reply into links; keeps line breaks. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="break-all text-cyan underline underline-offset-2">
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/**
 * Floating AI assistant (bottom-right in English, bottom-left in Arabic).
 * Talks to /api/chat when an API key is configured; otherwise answers offline from the FAQ knowledge base.
 */
export function ChatWidget() {
  const { locale, dict } = useI18n();
  const c = dict.chat;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chips, setChips] = useState<Chip[]>(startChips(dict));
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // GitHub Pages has no server, so the assistant starts directly in offline FAQ mode there.
  const [mode, setMode] = useState<Mode>(IS_STATIC_EXPORT ? "offline" : "unknown");
  const flow = useRef<FlowState>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Greeting + chips follow the page language (until the visitor starts talking).
  useEffect(() => {
    setMessages((m) => (m.length <= 1 ? [{ id: 0, role: "assistant", text: c.greeting, local: true }] : m));
    setChips((ch) => (messages.length <= 1 ? startChips(dict) : ch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const push = (m: Omit<Msg, "id">) => setMessages((list) => [...list, { ...m, id: nextId++ }]);

  const answerOffline = useCallback(
    async (value: string) => {
      const r = await fallbackReply(value, flow.current, locale);
      flow.current = r.state;
      push({ role: "assistant", text: r.reply, booking: r.booking, local: true });
      setChips(r.chips ?? []);
    },
    [locale],
  );

  /** `label` is what the visitor sees; `value` is what the engine receives (chips can differ). */
  const send = async (label: string, value = label) => {
    const text = label.trim();
    if (!text || busy) return;
    setInput("");
    setChips([]);
    const history = [...messages, { id: -1, role: "user" as const, text }];
    push({ role: "user", text });
    setBusy(true);
    try {
      // Offline mode, or an offline booking flow already in progress: answer locally.
      if (mode === "offline" || flow.current) {
        await answerOffline(value);
        return;
      }
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((m) => !m.local || m.role === "user").map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { mode?: Mode; reply?: string; booking?: BookingHandoff; refused?: boolean };
      if (data.mode === "offline") {
        setMode("offline");
        await answerOffline(value);
        return;
      }
      if (!res.ok || data.refused) throw new Error("chat failed");
      setMode("ai");
      push({ role: "assistant", text: data.reply || (data.booking ? c.bookingReady : c.error), booking: data.booking });
    } catch {
      // AI unreachable — answer from the local knowledge base instead of leaving the visitor stuck.
      await answerOffline(value);
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    flow.current = null;
    setMessages([{ id: 0, role: "assistant", text: c.greeting, local: true }]);
    setChips(startChips(dict));
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={c.title}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 end-3 z-[60] flex h-[min(640px,calc(100dvh-8rem))] w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-3xl bg-midnight text-white shadow-[0_20px_80px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,175,239,0.25)] sm:end-6"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 bg-gradient-to-br from-navy-2 to-midnight px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/10 ring-1 ring-cyan/40">
                <Monogram className="h-5 w-auto text-cyan" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{c.title}</p>
                <p className="truncate text-xs text-white/60">
                  {mode === "offline" ? c.offline : c.subtitle}
                </p>
              </div>
              <button type="button" onClick={restart} className="rounded-full px-2 py-1 text-xs text-white/60 hover:text-cyan">
                {c.restart}
              </button>
              <button type="button" onClick={() => { setOpen(false); launcherRef.current?.focus(); }} aria-label={c.close} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} role="log" aria-live="polite" aria-label={c.logLabel} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    dir="auto"
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[0.94rem] leading-relaxed ${
                      m.role === "user" ? "rounded-ee-md bg-cyan text-midnight" : "rounded-es-md bg-white/[0.07] text-white/90 ring-1 ring-white/10"
                    }`}
                  >
                    <RichText text={m.text} />
                    {m.booking && (
                      <div className="mt-3 flex flex-col gap-2">
                        <a href={m.booking.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-10 !py-2 !text-[0.72rem]">
                          <WhatsAppIcon className="h-4 w-4" /> {c.openWhatsapp}
                        </a>
                        <a href={m.booking.email} className="btn btn-ghost !min-h-10 !py-2 !text-[0.72rem]">
                          <MailIcon className="h-4 w-4" /> {c.openEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start" aria-label={c.typing}>
                  <div className="flex gap-1 rounded-2xl bg-white/[0.07] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-cyan" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            {chips.length > 0 && !busy && (
              <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-3">
                {chips.map((ch) => (
                  <button
                    key={ch.value}
                    type="button"
                    onClick={() => send(ch.label, ch.value)}
                    className="shrink-0 rounded-full border border-cyan/40 bg-cyan/5 px-3.5 py-2 text-sm text-cyan-soft transition hover:bg-cyan hover:text-midnight"
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 border-t border-white/10 p-3"
            >
              <label htmlFor="wepic-chat-input" className="sr-only">
                {c.placeholder}
              </label>
              <textarea
                id="wepic-chat-input"
                ref={inputRef}
                dir="auto"
                rows={1}
                value={input}
                maxLength={1000}
                placeholder={c.placeholder}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl bg-white/[0.06] px-4 py-2.5 text-[0.95rem] text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-cyan"
              />
              <button type="submit" disabled={!input.trim() || busy} aria-label={c.send} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan text-midnight transition disabled:opacity-40">
                <SendIcon className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? c.close : c.open}
        className="group fixed bottom-5 end-5 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-cyan text-midnight shadow-[0_10px_40px_-6px_rgba(0,175,239,0.8)] transition hover:scale-105 sm:bottom-6 sm:end-6"
      >
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-cyan/30 [animation-duration:3s] group-aria-expanded:hidden motion-reduce:hidden" />
        {open ? <CloseIcon className="relative h-7 w-7" /> : <ChatIcon className="relative h-7 w-7" />}
      </button>
    </>
  );
}
