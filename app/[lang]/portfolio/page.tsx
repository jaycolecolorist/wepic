import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { ReelGrid } from "@/components/portfolio/ReelGrid";
import { SectionHeading } from "@/components/SectionHeading";

export async function generateMetadata({ params }: PageProps<"/[lang]/portfolio">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/portfolio", d.meta.portfolioTitle, d.meta.portfolioDescription);
}

export default async function PortfolioPage({ params }: PageProps<"/[lang]/portfolio">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <>
      <PageHero eyebrow={dict.portfolio.eyebrow} title={dict.portfolio.title} intro={dict.portfolio.pageIntro} image="/images/portfolio/portrait-red-smoke.jpg" />
      <section className="bg-midnight py-16 sm:py-24">
        <div className="container-x">
          <PortfolioGrid />
        </div>
      </section>
      <section id="reels" className="scroll-mt-20 bg-navy py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={dict.common.photoVideo} title={dict.portfolio.reelsTitle} intro={dict.portfolio.reelsIntro} dark />
          <div className="mt-12">
            <ReelGrid />
          </div>
        </div>
      </section>
    </>
  );
}
