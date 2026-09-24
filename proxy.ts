import { NextResponse, type NextRequest } from "next/server";

/**
 * Sends visitors who arrive without a language in the URL (e.g. "/" or "/studio")
 * to /en/... or /ar/...:
 *   1. the language they chose before (cookie set by the EN | عربي switcher), else
 *   2. their browser language (Arabic → /ar), else
 *   3. English.
 */
const LOCALES = ["en", "ar"];
const KEY = "wepic-lang";

function pickLocale(req: NextRequest): string {
  const saved = req.cookies.get(KEY)?.value;
  if (saved && LOCALES.includes(saved)) return saved;
  const header = req.headers.get("accept-language") || "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of preferred) if (LOCALES.includes(lang)) return lang;
  return "en";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, video, icons, robots.txt…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
