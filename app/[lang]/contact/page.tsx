import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { ContactDetails } from "@/components/ContactDetails";
import { ContactForm } from "@/components/booking/ContactForm";
import { MapEmbed } from "@/components/MapEmbed";
import { Reveal } from "@/components/Reveal";
import { WHATSAPP_NUMBER, site } from "@/config/site";
import { InstagramIcon, WhatsAppIcon } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/contact", d.meta.contactTitle, d.meta.contactDescription);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const c = dict.contact;
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} image="/images/studio/studio-floor-4.jpg">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <WhatsAppIcon className="h-5 w-5" /> {c.whatsappCta}
        </a>
        <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <InstagramIcon className="h-5 w-5" /> <span className="ltr">{site.instagram.handle}</span>
        </a>
      </PageHero>
      <section className="bg-offwhite py-12 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-10">
            <h2 className="display text-3xl text-ink">{c.formTitle}</h2>
            <p className="mt-3 text-charcoal/70">{c.formIntro}</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-10">
            <ContactDetails dict={dict} />
          </Reveal>
        </div>
      </section>
      <section className="bg-offwhite pb-20 sm:pb-28">
        <div className="container-x">
          <MapEmbed title={c.mapTitle} className="h-[460px]" />
        </div>
      </section>
    </>
  );
}
