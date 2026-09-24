# WEPIC Photography — website

Bilingual (English + Arabic) website for **WEPIC Photography**, Doha, Qatar:
photography & videography services, monthly content packages, and studio rental —
with WhatsApp / email booking and an AI chat assistant.

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Framer Motion**.

---

## ⚠️ Placeholders to replace before launch

Everything below was **not** in the brand assets folder, so it is marked as a
placeholder — in code with `TODO`, and on the site with a small dashed amber
**“Placeholder / To be confirmed”** badge. Nothing was invented as fact.

| What | Where to change it | Shown on the site as |
|---|---|---|
| Studio rental prices (hourly / half day / full day) | `config/site.ts` → `rentalPlans[].priceQar` | “Rate on request” + badge |
| Minimum booking, half/full-day hours (4 h / 8 h assumed) | `locales/*.json` → `studio.rates` | text |
| Studio size, infinity-cove size, ceiling, power, parking | `config/site.ts` → `studioSpecs` | “To be confirmed” badge |
| Opening **times** (days Sun–Thu are from the brand post) | `config/site.ts` → `openTime`/`closeTime` + `locales` → `contact.hoursTimes` | badge |
| Client lounge (not visible in any photo) | `app/[lang]/studio/page.tsx` | badge |
| Exact equipment list / models | `locales/*.json` → `studio.equipment` | badge |
| House rules (draft) | `locales/*.json` → `studio.rules` | “Draft house rules” badge |
| Event photography images (none in assets) | add images, then `config/site.ts` → `services` (event) and `portfolio` | camera icon + badge / “coming soon” |
| Official vector logo (redrawn from the PDF) | `components/Logo.tsx`, `app/icon.svg` | — |
| Real domain name | `.env.local` → `NEXT_PUBLIC_SITE_URL` | used for SEO links |

When all of it is replaced, set `NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=false` to hide the badges.

**One conflict to confirm:** the Essential package lists **20** edited photos in
`Wepic Monthly Packages.pdf` but **25** in the website brief. The site uses 25.
Change it in `locales/en.json` and `locales/ar.json` → `packages.items.essential.features`.

Two images in the assets folder are AI renders (`Gemini_Generated_Image_*` — a WEPIC
building and a “free parking” sign). They are **not used**, so the site doesn't
present them as real photos.

---

## Run it on your computer

Needs **Node.js 20+** and (only to re-process media) **ffmpeg**.

```bash
npm install --no-bin-links
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. `/` redirects to `/en` or `/ar`.

> `--no-bin-links` is needed because the project sits on an exFAT drive, which can't
> store the shortcut links npm normally creates. The npm scripts already call the
> tools directly, so everything works the same. On a normal Mac/Linux disk,
> plain `npm install` is fine.

| Command | What it does |
|---|---|
| `npm run dev` | Local development server with live reload |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run check:i18n` | Confirms `en.json` and `ar.json` have the same keys |
| `npm run media` | Rebuilds web-sized photos/videos from `../FOR WEBSITE` |

## Live preview: GitHub Pages

**https://jaycolecolorist.github.io/wepic/** — repo `jaycolecolorist/wepic`.
Every push to `main` rebuilds it automatically (`.github/workflows/pages.yml`).

GitHub Pages only serves ready-made files, so that build (`STATIC_EXPORT=true`):
- serves the site from the `/wepic` sub-folder,
- runs the chat in **offline FAQ mode** (no server for the AI),
- picks the language in the browser (`public/index.html`) instead of `proxy.ts`,
- serves the pre-sized JPEGs instead of resized AVIF/WebP.

For the full version (AI chat, image optimisation) use Vercel or Netlify below.

## Deploy the full version (Vercel)

The AI assistant needs a small server function, so use a host that runs Next.js
(Vercel, Netlify, or any Node server) — not a plain static host.

1. Push this folder to a GitHub repository.
2. On https://vercel.com → **Add New… → Project** → import the repository.
3. Under **Environment Variables**, add the values from `.env.example`
   (at minimum `NEXT_PUBLIC_SITE_URL`; add `ANTHROPIC_API_KEY` for the AI assistant).
4. Click **Deploy**. Then add your domain under **Settings → Domains**.

Self-hosting instead: `npm run build && npm start` behind any reverse proxy (port 3000).

## Environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public address (SEO, sitemap, social previews) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number that receives bookings — digits only, e.g. `97433883327` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email for the “Send by Email” option |
| `ANTHROPIC_API_KEY` | Claude API key for the assistant. **Server-only** — never sent to the browser. Leave empty for offline FAQ mode |
| `ANTHROPIC_MODEL` | Claude model (default `claude-opus-5`) |
| `NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES` | `true` shows the amber placeholder badges |

Variables starting with `NEXT_PUBLIC_` are baked in at build time — redeploy after changing them.

---

## How to edit content

### Text & translations
All wording lives in **`locales/en.json`** and **`locales/ar.json`** — same keys,
one file per language. Edit both, then run `npm run check:i18n`.

- Nav, buttons, headings, service descriptions, package features, studio details,
  booking-message wording, chat answers — all in these files.
- Arabic is Modern Standard Arabic. Keep phone numbers/emails in Latin characters.

### Prices, packages, contact details, photos
**`config/site.ts`** is the single source of truth for facts:
- `packages` — monthly package prices (QAR) and which one is “Most Popular”
- `rentalPlans` — studio rental prices (`null` = “Rate on request”)
- `site` — phone, Instagram, address, map, opening days/times
- `services`, `portfolio`, `studioGallery`, `reels` — which images/videos appear

The AI assistant reads the same config and locale files, so it always quotes current prices.

### Adding photos
1. Put a web-sized JPEG (max ~2400 px, see `scripts/prepare-media.sh`) in
   `public/images/portfolio/`, e.g. `event-gala.jpg`.
2. Add it to `portfolio` in `config/site.ts`: `p("event-gala", "events", 2400, 1600)`
   (category, width, height).
3. Add its alt text in both locale files under `portfolio.alt["event-gala"]`.

`scripts/prepare-media.sh` shows how the originals in `../FOR WEBSITE` were converted.

---

## Reviews

The home page shows real reviews copied from the studio's Google Maps listing
(`config/site.ts` → `reviews`, plus `googleRating` for the 4.8 ★ / 6 reviews badge —
update it when the listing changes). The map pin also comes from that listing.

**Write a review:** visitors fill in name, stars, what they booked and their review,
tick “WEPIC may publish my name and review”, and send it by WhatsApp or email —
the same hand-off as bookings (the site has no database). To publish one, add it to
`reviews` in `config/site.ts` with `source: "website"` and `rating`. Nothing appears
on the site until the studio adds it, so spam and fake reviews can't go live.

## How the booking works

No payment backend. On **Send booking via WhatsApp** the site builds a formatted
summary **in the language the visitor is browsing in** and opens
`https://wa.me/97433883327?text=…` so it arrives pre-filled in the studio's chat.
**Send by Email** opens the visitor's mail app with the same summary
(`mailto:Wepic.qa@gmail.com`). The page then shows a confirmation.

Code: `lib/booking.ts` (shared by the form and the assistant),
`components/booking/BookingForm.tsx`. Pricing buttons pre-fill the form via
`/book?type=package&item=essential`.

## How the AI assistant works

- Floating button bottom-right (English) / bottom-left (Arabic).
- **With `ANTHROPIC_API_KEY`:** messages go to `app/api/chat/route.ts`, which calls
  Claude with a system prompt built from the site's own facts
  (`lib/assistant/knowledge.ts`). Claude replies in the visitor's language and, when
  booking, calls a `prepare_booking` tool — the server builds the same WhatsApp/email
  links as the form. Refusal fallback is enabled; there's a basic rate limit of
  20 messages/minute per visitor.
- **Without a key (or if the AI is unreachable):** the widget switches to offline mode
  (`lib/assistant/fallback.ts`) — keyword FAQ answers in English/Arabic plus a
  step-by-step booking conversation ending in the same WhatsApp/email hand-off.

## Project map

```
app/[lang]/            pages: home, services, studio, portfolio, contact, book
app/api/chat/          AI assistant endpoint (server)
components/            UI (header, footer, sections, booking, chat, portfolio)
config/site.ts         prices, contact details, media lists  ← edit facts here
locales/en.json|ar.json all text, both languages             ← edit wording here
lib/                   i18n, booking message builder, assistant, SEO
proxy.ts               sends "/" to /en or /ar (remembered choice → browser language → English)
public/images, media   web-optimised photos and videos
scripts/               media conversion + translation checker
```

## Built-in quality features

- **SEO:** per-page titles/descriptions in both languages, `hreflang` alternates,
  Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, schema.org `LocalBusiness`
  with the Doha address, phone, and package offers.
- **Performance:** static pre-rendered pages, `next/image` (AVIF/WebP, responsive,
  lazy), hero video attached only after page load with a poster image, reels load
  only when played, lazy map.
- **Accessibility:** semantic landmarks, skip link, keyboard-navigable menu, lightbox
  and chat (Esc closes, focus is managed), alt text in both languages, labelled form
  fields with error messages, respects “reduce motion”.
- **RTL:** full mirroring via logical CSS properties, IBM Plex Sans Arabic, no
  letter-spacing on Arabic text.
