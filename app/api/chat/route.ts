/**
 * POST /api/chat — the AI assistant's backend.
 *
 * The Anthropic API key stays on the server (ANTHROPIC_API_KEY). If no key is set,
 * this returns { mode: "offline" } and the chat widget answers from its built-in
 * FAQ knowledge base instead.
 *
 * Request:  { messages: { role: "user" | "assistant"; content: string }[] }
 * Response: { mode: "ai", reply: string, booking?: { whatsapp, email, text } }
 */
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/assistant/knowledge";
import { bookingLinks, isValidItem, isValidPhone, type BookingKind, type BookingRequest } from "@/lib/booking";
import { packages, rentalPlans, services } from "@/config/site";
import { getDictionary, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;

// --- tiny in-memory rate limit (per server instance) -------------------------
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 20; // 20 messages / minute / visitor
}

// --- the one tool the assistant can call -------------------------------------
const bookingTool: Anthropic.Beta.BetaTool = {
  name: "prepare_booking",
  description:
    "Prepare the visitor's booking request so the website can show 'Send on WhatsApp' and 'Send by Email' buttons. " +
    "Call it only once the visitor has given what to book, a preferred date and time, their name and phone number. " +
    "The studio confirms availability afterwards; this does not reserve anything.",
  strict: true,
  input_schema: {
    type: "object",
    properties: {
      kind: { type: "string", enum: ["package", "service", "studio"], description: "What is being booked." },
      item: {
        type: "string",
        enum: [...packages.map((p) => p.id), ...services.map((s) => s.id), ...rentalPlans.map((r) => r.id)],
        description: "package: basic|essential|premium. service: a service id. studio: hourly|halfDay|fullDay.",
      },
      hours: { type: "integer", description: "Number of hours for hourly studio rental, otherwise 0." },
      date: { type: "string", description: "Preferred date as the visitor gave it, or YYYY-MM-DD if certain." },
      time: { type: "string", description: "Preferred start time, e.g. 10:00 or '10 am'." },
      name: { type: "string", description: "Visitor's full name." },
      phone: { type: "string", description: "Visitor's phone / WhatsApp number." },
      notes: { type: "string", description: "Optional notes, or an empty string." },
      language: { type: "string", enum: ["en", "ar"], description: "Language the visitor is writing in; the booking message is written in it." },
    },
    required: ["kind", "item", "hours", "date", "time", "name", "phone", "notes", "language"],
    additionalProperties: false,
  },
};

type ToolInput = Omit<BookingRequest, "hours" | "email"> & { hours: number; language: Locale };

function runBookingTool(input: ToolInput) {
  const kind = input.kind as BookingKind;
  if (!isValidItem(kind, input.item)) return { ok: false as const, error: `"${input.item}" is not a valid ${kind}. Ask the visitor to choose again.` };
  if (!isValidPhone(input.phone)) return { ok: false as const, error: "The phone number looks invalid. Ask the visitor to check it." };
  const lang: Locale = input.language === "ar" ? "ar" : "en";
  const req: BookingRequest = { ...input, kind, hours: input.hours || undefined };
  const links = bookingLinks(req, getDictionary(lang), lang);
  return { ok: true as const, links };
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function cleanMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter((m): m is ChatMessage => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  // The conversation must start with the visitor and end with the visitor.
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  return msgs;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ mode: "offline" });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const history = cleanMessages(body.messages);
  if (!history) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const client = new Anthropic();
  const system = `${buildSystemPrompt()}\n\nToday's date in Doha: ${new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Qatar", weekday: "long", day: "numeric", month: "long", year: "numeric" })}.`;
  // Server-side refusal fallback is supported on the Opus 5 / Fable 5 families.
  const useFallbacks = /^claude-(opus-5|fable-5)/.test(MODEL);

  let messages: Anthropic.Beta.BetaMessageParam[] = history;
  let booking: { whatsapp: string; email: string; text: string } | undefined;

  try {
    // Small agent loop: at most one tool round-trip is ever needed.
    for (let turn = 0; turn < 3; turn++) {
      const res = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 2000,
        system,
        messages,
        tools: [bookingTool],
        output_config: { effort: "low" },
        ...(useFallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } : {}),
      } as Anthropic.Beta.MessageCreateParamsNonStreaming);

      if (res.stop_reason === "refusal") return NextResponse.json({ mode: "ai", reply: "", refused: true });

      const text = res.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      const toolUses = res.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");

      if (res.stop_reason !== "tool_use" || toolUses.length === 0) {
        return NextResponse.json({ mode: "ai", reply: text, booking });
      }

      const results: Anthropic.Beta.BetaToolResultBlockParam[] = toolUses.map((tu) => {
        const out = tu.name === "prepare_booking" ? runBookingTool(tu.input as ToolInput) : { ok: false as const, error: "Unknown tool" };
        if (out.ok) booking = { whatsapp: out.links.whatsapp, email: out.links.email, text: out.links.text };
        return {
          type: "tool_result",
          tool_use_id: tu.id,
          content: out.ok ? "Booking request prepared. The website is now showing the WhatsApp and Email buttons." : out.error,
          is_error: !out.ok,
        };
      });
      messages = [...messages, { role: "assistant", content: res.content }, { role: "user", content: results }];
    }
    return NextResponse.json({ mode: "ai", reply: "", booking });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("[chat] Invalid ANTHROPIC_API_KEY — falling back to offline mode");
      return NextResponse.json({ mode: "offline" });
    }
    if (error instanceof Anthropic.RateLimitError) {
      console.error("[chat] Anthropic rate limit");
      return NextResponse.json({ error: "busy" }, { status: 503 });
    }
    if (error instanceof Anthropic.APIError) console.error(`[chat] Anthropic API error ${error.status}: ${error.message}`);
    else console.error("[chat] unexpected error", error);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
