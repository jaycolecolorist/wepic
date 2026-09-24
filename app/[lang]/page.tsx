import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { Packages } from "@/components/Packages";
import { StudioTeaser } from "@/components/home/StudioTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactSection } from "@/components/home/ContactSection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowIcon } from "@/components/Icons";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <>
      <Hero locale={lang} dict={dict} />
      <About dict={dict} />
      <ServicesGrid locale={lang} dict={dict} />
      <Packages locale={lang} dict={dict} />
      <section id="portfolio" className="bg-midnight py-14 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={dict.portfolio.eyebrow} title={dict.portfolio.title} intro={dict.portfolio.intro} dark />
          </div>
          <div className="mt-10">
            <PortfolioGrid limit={8} />
          </div>
          <div className="mt-12 text-center">
            <Link href={href(lang, "/portfolio")} className="btn btn-ghost">
              {dict.common.viewAll} <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <StudioTeaser locale={lang} dict={dict} />
      <Testimonials dict={dict} locale={lang} />
      <ContactSection dict={dict} />
    </>
  );
}
