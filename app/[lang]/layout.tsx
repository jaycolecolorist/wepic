import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "../globals.css";
import { SITE_URL } from "@/config/site";
import { dirOf, getDictionary, hasLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { I18nProvider } from "@/components/I18nProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "WEPIC Photography",
    keywords: ["photography Doha", "studio rental Doha", "photo studio Qatar", "videography Qatar", "تصوير الدوحة", "تأجير استوديو الدوحة", "استوديو تصوير قطر"],
    ...pageMetadata(lang, ""),
  };
}

export const viewport: Viewport = { themeColor: "#020a13", colorScheme: "dark" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <html lang={lang} dir={dirOf(lang)} className={`${inter.variable} ${plexArabic.variable} ${cormorant.variable}`}>
      <body>
        <LocalBusinessJsonLd locale={lang} />
        <I18nProvider locale={lang} dict={dict}>
          <MotionProvider>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer locale={lang} dict={dict} />
            <ChatWidget />
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
