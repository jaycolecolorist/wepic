import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/config/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Packages } from "@/components/Packages";
import { Reveal } from "@/components/Reveal";
import { ServiceVisual } from "@/components/ServiceVisual";
import { Reel } from "@/components/portfolio/ReelGrid";
import { ArrowIcon, CheckIcon } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/services", d.meta.servicesTitle, d.meta.servicesDescription);
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <>
      <PageHero eyebrow={dict.services.eyebrow} title={dict.services.pageTitle} intro={dict.services.pageIntro} image="/images/portfolio/commercial-ferrari-sunset.jpg">
        <Link href={href(lang, "/book?type=service")} className="btn btn-primary">{dict.hero.ctaBook}</Link>
        <Link href="#packages" className="btn btn-ghost">{dict.packages.title}</Link>
      </PageHero>

      <section className="bg-offwhite py-20 sm:py-28">
        <div className="container-x space-y-20 sm:space-y-28">
          {services.map((s, i) => {
            const item = dict.services.items[s.id];
            const flip = i % 2 === 1;
            return (
              <article key={s.id} id={s.id} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal className={flip ? "lg:order-2" : ""}>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-midnight shadow-xl shadow-navy/15 sm:aspect-[5/4]">
                    <ServiceVisual src={s.image} alt={item.title} sizes="(min-width: 1024px) 45vw, 100vw" placeholderLabel={dict.common.placeholder} />
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="text-sm font-bold text-cyan-deep">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">{item.title}</h2>
                  <p className="mt-5 text-lg leading-relaxed text-charcoal/85">{item.long}</p>
                  <ul className="mt-6 space-y-3">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-charcoal">
                        <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-deep" /> {pt}
                      </li>
                    ))}
                  </ul>
                  <Link href={href(lang, `/book?type=service&item=${s.id}`)} className="btn btn-dark mt-8">
                    {dict.services.bookService} <ArrowIcon className="h-4 w-4" />
                  </Link>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-midnight py-20 text-white sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="eyebrow">{dict.common.photoVideo}</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">{dict.services.videoTitle}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">{dict.services.videoBody}</p>
            <Link href={href(lang, "/portfolio#reels")} className="btn btn-ghost mt-8">
              {dict.portfolio.reelsTitle} <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
            <Reel slug="fashion-editorial" title={dict.portfolio.reels["fashion-editorial"]} />
            <Reel slug="zeekr-speed-ramp" title={dict.portfolio.reels["zeekr-speed-ramp"]} className="mt-10" />
          </Reveal>
        </div>
      </section>

      <Packages locale={lang} dict={dict} />
    </>
  );
}
