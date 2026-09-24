/**
 * WEPIC — single source of truth for business facts, prices and media.
 *
 * Edit prices, contact details and image lists here. Words shown on the site
 * (names, descriptions, features) live in /locales/en.json and /locales/ar.json.
 *
 * Anything marked `TODO` is a placeholder: the information was not in the
 * brand assets folder and must be confirmed by WEPIC before launch.
 */

/** Digits only, country code first (used to build https://wa.me/ links). */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "97433883327").replace(/\D/g, "");
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Wepic.qa@gmail.com";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://wepic.qa").replace(/\/$/, ""); // TODO: real domain

/** When true, content that still needs real information shows a small dashed "Placeholder" badge. */
export const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES !== "false";

export const site = {
  name: "WEPIC Photography",
  founded: 2024,
  phoneDisplay: "+974 3388 3327",
  phoneHref: "tel:+97433883327",
  instagram: { handle: "@Wepic.qa", url: "https://www.instagram.com/wepic.qa/" },
  address: {
    street: "C-Ring Road, Building 244, 1st floor",
    city: "Doha",
    country: "QA",
  },
  /** Exact pin of the "Wepic photography" Google Maps listing (25.2631222, 51.5325315). */
  mapEmbedUrl: "https://maps.google.com/maps?q=25.2631222,51.5325315&z=17&output=embed",
  mapLinkUrl: "https://www.google.com/maps?cid=3318919443409660594",
  /** From the brand's "We're open Sunday to Thursday" post. */
  openDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  openTime: null as string | null, // TODO: e.g. "10:00" — not in the assets
  closeTime: null as string | null, // TODO: e.g. "22:00" — not in the assets
} as const;

// ---------------------------------------------------------------------------
// Monthly packages — prices from "Wepic Monthly Packages.pdf".
// NOTE: the PDF lists 20 edited photos for Essential; the website brief says 25.
// The brief is used here (see locales). Confirm with WEPIC.
// ---------------------------------------------------------------------------
export type PackageId = "basic" | "essential" | "premium";
export const packages: { id: PackageId; priceQar: number; featured?: boolean; image: string }[] = [
  { id: "basic", priceQar: 2500, image: "/images/portfolio/commercial-spotlight-chair.jpg" },
  { id: "essential", priceQar: 3900, featured: true, image: "/images/portfolio/portrait-monochrome-man.jpg" },
  { id: "premium", priceQar: 5900, image: "/images/portfolio/portrait-red-light.jpg" },
];

// ---------------------------------------------------------------------------
// Services — text in locales under services.items.<id>
// ---------------------------------------------------------------------------
export type ServiceId =
  | "corporate" | "branding" | "product" | "event" | "portrait"
  | "social" | "commercial" | "startup" | "lifestyle" | "marketing";
export const services: { id: ServiceId; image: string | null }[] = [
  { id: "corporate", image: "/images/portfolio/portrait-pinstripe-man.jpg" },
  { id: "branding", image: "/images/portfolio/portrait-plaid-shirt.jpg" },
  { id: "product", image: "/images/portfolio/product-dessert-platter.jpg" },
  { id: "event", image: null }, // TODO: no event photos in the assets folder — add one to public/images and set the path
  { id: "portrait", image: "/images/portfolio/portrait-blue-suit-rings.jpg" },
  { id: "social", image: "/images/portfolio/product-lip-gloss.jpg" },
  { id: "commercial", image: "/images/portfolio/commercial-ferrari-stadium.jpg" },
  { id: "startup", image: "/images/portfolio/portrait-pinstripe-woman.jpg" },
  { id: "lifestyle", image: "/images/portfolio/portrait-skyline-silhouette.jpg" },
  { id: "marketing", image: "/images/portfolio/product-kinza-can.jpg" },
];

// ---------------------------------------------------------------------------
// Studio rental plans. priceQar: null shows "Rate on request".
// TODO: real rental prices were not in the assets — fill these in (numbers, QAR).
// ---------------------------------------------------------------------------
export type RentalId = "hourly" | "halfDay" | "fullDay";
export const rentalPlans: { id: RentalId; priceQar: number | null; hours: number | null; featured?: boolean }[] = [
  { id: "hourly", priceQar: null, hours: null },
  { id: "halfDay", priceQar: null, hours: 4, featured: true },
  { id: "fullDay", priceQar: null, hours: 8 },
];

/** Studio facts not in the assets. null = shown as "To be confirmed". */
export const studioSpecs = {
  size: null as string | null, // TODO e.g. "300 m²"
  cyclorama: null as string | null, // TODO e.g. "6 m × 4 m × 3.5 m"
  ceiling: null as string | null, // TODO
  power: null as string | null, // TODO
  parking: null as string | null, // TODO
};

// ---------------------------------------------------------------------------
// Portfolio — alt text in locales under portfolio.alt.<slug>
// ---------------------------------------------------------------------------
export type Category = "portraits" | "products" | "events" | "commercial";
export type PortfolioItem = { slug: string; category: Exclude<Category, "events">; w: number; h: number };
const p = (slug: string, category: PortfolioItem["category"], w: number, h: number): PortfolioItem => ({ slug, category, w, h });
export const portfolio: PortfolioItem[] = [
  p("portrait-red-light", "portraits", 1600, 2400),
  p("commercial-ferrari-stadium", "commercial", 2400, 1600),
  p("product-dessert-platter", "products", 2400, 2400),
  p("portrait-blue-suit-rings", "portraits", 1920, 2400),
  p("commercial-mustang-974", "commercial", 1920, 2400),
  p("product-kinza-can", "products", 1610, 2400),
  p("portrait-white-suit", "portraits", 2400, 1920),
  p("product-watch-vest", "products", 1920, 2400),
  p("portrait-monochrome-man", "portraits", 1600, 2400),
  p("commercial-ferrari-lusail", "commercial", 1200, 1500),
  p("product-strawberry-cake", "products", 2400, 2400),
  p("portrait-rose-abaya", "portraits", 1920, 2400),
  p("portrait-pinstripe-man", "portraits", 1920, 2400),
  p("product-lip-gloss", "products", 1920, 2400),
  p("commercial-mustang-front", "commercial", 1920, 2400),
  p("portrait-skyline-silhouette", "portraits", 1600, 2400),
  p("product-caramel-brownie", "products", 2400, 2400),
  p("portrait-red-smoke", "portraits", 1600, 2400),
  p("commercial-ferrari-sunset", "commercial", 2400, 1600),
  p("portrait-black-abaya", "portraits", 1350, 2400),
  p("product-navy-tee", "products", 1600, 2400),
  p("portrait-pinstripe-woman-seated", "portraits", 1920, 2400),
  p("commercial-spotlight-chair", "commercial", 1600, 2400),
  p("portrait-fitness-rope", "portraits", 1350, 2400),
  p("product-gift-box", "products", 2400, 1350),
  p("portrait-monochrome-dress", "portraits", 1600, 2400),
  p("commercial-mustang-side", "commercial", 1920, 2400),
  p("portrait-floor-pose", "portraits", 1920, 2400),
  p("product-black-quarter-zip", "products", 1920, 2400),
  p("portrait-plaid-shirt", "portraits", 1920, 2400),
  p("portrait-rose-abaya-seated", "portraits", 1920, 2400),
  p("portrait-man-white-tank", "portraits", 1920, 2400),
  p("portrait-black-abaya-full", "portraits", 1350, 2400),
  p("portrait-fitness-pink", "portraits", 1350, 2400),
  p("portrait-pinstripe-woman", "portraits", 1920, 2400),
];
export const portfolioSrc = (slug: string) => `/images/portfolio/${slug}.jpg`;

/** Short-form videos (files in public/media/reels, titles in locales under portfolio.reels). */
export const reels: { slug: string; landscape?: boolean }[] = [
  { slug: "fashion-editorial" },
  { slug: "ferrari-reel" },
  { slug: "zeekr-speed-ramp" },
  { slug: "perfume" },
  { slug: "watch" },
  { slug: "orange-juice" },
  { slug: "le-bleu" },
  { slug: "volvo-xc90-film", landscape: true },
];

/** Studio photos (public/images/studio). Captions come from studio.features in locales. */
export const studioGallery: { src: string; w: number; h: number; alt: { en: string; ar: string } }[] = [
  { src: "/images/studio/studio-floor-3.jpg", w: 2400, h: 1600, alt: { en: "Wide view of the WEPIC studio floor with several sets and lights", ar: "منظر واسع لأرضية استوديو ويبك مع عدة ديكورات وإضاءات" } },
  { src: "/images/studio/studio-floor-1.jpg", w: 2400, h: 1600, alt: { en: "The studio's white infinity cove area with lights and a chair", ar: "منطقة الخلفية البيضاء اللانهائية في الاستوديو مع الإضاءة وكرسي" } },
  { src: "/images/studio/set-majlis.jpg", w: 2400, h: 1600, alt: { en: "Traditional majlis set with patterned cushions", ar: "ديكور مجلس تقليدي بوسائد مزخرفة" } },
  { src: "/images/studio/set-panel-wall.jpg", w: 1600, h: 2400, alt: { en: "3D-panel feature wall with a lit sconce and stool", ar: "جدار بألواح ثلاثية الأبعاد مع مصباح جداري وكرسي" } },
  { src: "/images/studio/set-purple-lounge.jpg", w: 2400, h: 1600, alt: { en: "Purple-lit lounge set with white armchairs and a fur rug", ar: "ديكور صالة بإضاءة بنفسجية مع كراسٍ بيضاء وسجادة فرو" } },
  { src: "/images/studio/studio-floor-4.jpg", w: 2400, h: 1600, alt: { en: "Pink paneled wall set with white sofas and softboxes", ar: "ديكور الجدار الوردي مع أرائك بيضاء وصناديق إضاءة" } },
  { src: "/images/studio/set-black-curtain.jpg", w: 1600, h: 2400, alt: { en: "Black curtain set with a single chair and flowers", ar: "ديكور الستائر السوداء مع كرسي وزهور" } },
  { src: "/images/studio/studio-floor-2.jpg", w: 2400, h: 1600, alt: { en: "Studio floor showing multiple shooting areas", ar: "أرضية الاستوديو وتظهر عدة مناطق للتصوير" } },
  { src: "/images/studio/set-majlis-wide.jpg", w: 2400, h: 1350, alt: { en: "Majlis set on a raised white platform", ar: "ديكور المجلس على منصة بيضاء مرتفعة" } },
  { src: "/images/studio/set-armchair.jpg", w: 1600, h: 2400, alt: { en: "White armchair set with warm lighting and a plant", ar: "ديكور كرسي أبيض بإضاءة دافئة ونبتة" } },
  { src: "/images/studio/studio-floor-5.jpg", w: 2400, h: 1600, alt: { en: "Studio dressed with a Ramadan-themed set", ar: "الاستوديو بديكور رمضاني" } },
];

// ---------------------------------------------------------------------------
// Reviews — copied word for word from the "Wepic photography" Google Maps listing
// on 2026-09-24. Update googleRating when the listing changes.
// Left out on purpose: a review posted by the Wepic Photography account itself
// (not a customer), and a second, shorter review from the same "kim packs" name.
//
// Reviews sent through the website's "Write a review" form arrive on WhatsApp/email.
// To publish one, add it here with source: "website" (only with the writer's permission).
// ---------------------------------------------------------------------------
export const googleListingUrl = "https://www.google.com/maps?cid=3318919443409660594";
export const googleRating = { rating: 4.8, count: 6, checked: "2026-09-24" };

// Text edits: Kurt's doubled word "time time" is shown once; Lemuel's review is the part
// Google shows before "More" (the rest was not visible when copied).
export type Review = { name: string; text: string; source: "google" | "website"; rating?: number };
export const reviews: Review[] = [
  {
    name: "Lemuel Chris Motions",
    source: "google",
    text: "I love the cyclorama wall and the space is packed, incredibly diverse. Creative zones that make it easy to shoot an entire portfolio in one visit ❤️",
  },
  {
    name: "Kurt Casono",
    source: "google",
    text: "Had a great time. The studio is huge, tons of props and background set ups so you'll never run out of ideas. Highly recommended 💯",
  },
  { name: "Kim packs", source: "google", text: "So good" },
];
