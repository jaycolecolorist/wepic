import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { rentalPlans, studioSpecs } from "@/config/site";
import { formatQar, getDictionary, hasLocale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { PlaceholderBadge } from "@/components/Placeholder";
import { StudioGallery } from "@/components/studio/StudioGallery";
import { Reel } from "@/components/portfolio/ReelGrid";
import { BookingForm } from "@/components/booking/BookingForm";
import { CheckIcon } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/studio">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/studio", d.meta.studioTitle, d.meta.studioDescription);
}

export default async function StudioPage({ params }: PageProps<"/[lang]/studio">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const s = dict.studio;
  const featureKeys = ["cyclorama", "sets", "lighting", "makeup", "podcast", "lounge"] as const;
  // Facts not in the assets are shown as "To be confirmed" (fill them in config/site.ts → studioSpecs).
  const specs: [string, string | null][] = [
    [s.specs.size, studioSpecs.size],
    [s.specs.cyclorama, studioSpecs.cyclorama],
    [s.specs.ceiling, studioSpecs.ceiling],
    [s.specs.power, studioSpecs.power],
    [s.specs.parking, studioSpecs.parking],
    [s.specs.access, s.specs.accessValue],
  ];

  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} intro={s.intro} image="/images/studio/studio-floor-3.jpg">
        <Link href="#book-studio" className="btn btn-primary">{s.ctaBook}</Link>
        <Link href="#tour" className="btn btn-ghost">{s.ctaTour}</Link>
      </PageHero>

      {/* Features */}
      <section className="bg-offwhite py-12 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={s.eyebrow} title={s.featuresTitle} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((k, i) => (
              <li key={k}>
                <Reveal delay={(i % 3) * 0.08} className="h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-ink/5">
                  <p className="text-sm font-bold text-cyan-deep">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-xl font-bold text-ink">{s.features[k].title}</h3>
                  <p className="mt-3 leading-relaxed text-charcoal/75">{s.features[k].body}</p>
                  {/* TODO: no lounge is visible in the assets — confirm it exists before launch */}
                  {k === "lounge" && <PlaceholderBadge label={dict.common.tbc} className="mt-4" />}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery + tour */}
      <section className="bg-midnight py-20 text-white sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={s.eyebrow} title={s.galleryTitle} dark />
          <div className="mt-12">
            <StudioGallery />
          </div>
          <div id="tour" className="mt-20 grid scroll-mt-24 items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="display text-4xl sm:text-5xl">{s.tourTitle}</h2>
              <p className="mt-5 max-w-lg text-lg text-mist">{s.intro}</p>
              <h3 className="mt-12 text-2xl font-bold">{s.podcastTitle}</h3>
              <p className="mt-3 max-w-lg text-mist">{s.podcastBody}</p>
            </Reveal>
            <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
              <Reel slug="studio-tour" title={dict.portfolio.reels["studio-tour"]} />
              <Reel slug="podcast-services" title={dict.portfolio.reels["podcast-services"]} className="mt-12" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Specs + equipment */}
      <section className="bg-white py-12 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="display text-3xl text-ink sm:text-4xl">{s.specsTitle}</h2>
            <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {specs.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-6 py-4">
                  <dt className="font-semibold text-charcoal">{label}</dt>
                  <dd className="text-end text-charcoal/80">{value ?? <PlaceholderBadge label={dict.common.tbc} />}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-3xl text-ink sm:text-4xl">{s.equipmentTitle}</h2>
            <p className="mt-4 text-charcoal/70">{s.equipmentIntro}</p>
            <PlaceholderBadge label={dict.common.tbc} className="mt-3" />
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {Object.values(s.equipment).map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-deep">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((it) => (
                      <li key={it} className="flex gap-2 text-charcoal/85">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Rates */}
      <section className="grain relative isolate overflow-hidden bg-navy py-20 text-white sm:py-28">
        <div aria-hidden className="glow-arc -start-[25vmax] -top-[30vmax] h-[60vmax] w-[60vmax] opacity-50" />
        <div className="container-x relative">
          <SectionHeading eyebrow={s.eyebrow} title={s.ratesTitle} intro={s.ratesIntro} dark align="center" />
          <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-3">
            {rentalPlans.map((plan, i) => {
              const r = s.rates[plan.id];
              return (
                <Reveal key={plan.id} delay={i * 0.1} className="flex">
                  <article className={`flex w-full flex-col rounded-[1.75rem] p-8 ${plan.featured ? "bg-gradient-to-b from-cyan/20 to-navy-2 ring-2 ring-cyan" : "bg-white/[0.04] ring-1 ring-white/10"}`}>
                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-cyan">{r.name}</h3>
                    <p className="mt-2 text-white/60">{r.duration}</p>
                    {/* TODO: set rentalPlans[].priceQar in config/site.ts once WEPIC confirms rates */}
                    <p className="display mt-6 text-3xl">{plan.priceQar ? formatQar(plan.priceQar, lang) : dict.common.rateOnRequest}</p>
                    {!plan.priceQar && <PlaceholderBadge label={dict.common.tbc} className="mt-3 self-start" />}
                    <ul className="mt-8 flex-1 space-y-3">
                      {r.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-white/85">
                          <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan" /> {pt}
                        </li>
                      ))}
                    </ul>
                    <Link href={href(lang, `/book?type=studio&item=${plan.id}`)} className={`btn mt-8 w-full ${plan.featured ? "btn-primary" : "btn-ghost"}`}>
                      {s.ctaBook}
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-10 text-center text-mist">{s.addCrew}</p>
        </div>
      </section>

      {/* Rules + booking */}
      <section id="book-studio" className="scroll-mt-20 bg-offwhite py-12 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h2 className="display text-3xl text-ink sm:text-4xl">{s.rulesTitle}</h2>
            {/* TODO: house rules are a draft — confirm with WEPIC (locales → studio.rules) */}
            <PlaceholderBadge label={s.rulesNote} className="mt-4" />
            <ol className="mt-8 space-y-4">
              {s.rules.map((rule, i) => (
                <li key={rule} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-midnight text-sm font-bold text-cyan">{i + 1}</span>
                  <span className="pt-1 leading-relaxed text-charcoal/85">{rule}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[1.75rem] bg-midnight p-6 text-white shadow-2xl shadow-navy/30 sm:p-10">
            <h2 className="display text-3xl">{s.bookingTitle}</h2>
            <p className="mt-3 text-mist">{s.bookingIntro}</p>
            <div className="mt-8">
              <BookingForm initialType="studio" lockType />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
