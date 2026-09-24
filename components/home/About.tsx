import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "../Reveal";
import { Viewfinder } from "../Viewfinder";

export function About({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  const facts = [
    [a.facts.founded, a.facts.foundedValue],
    [a.facts.location, a.facts.locationValue],
    [a.facts.open, a.facts.openValue],
  ];
  return (
    <section id="about" className="relative overflow-hidden bg-offwhite py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-navy/20">
            <Image
              src="/images/portfolio/portrait-red-light.jpg"
              alt={dict.portfolio.alt["portrait-red-light"]}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-top"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
            <Viewfinder className="m-6" />
            <p className="absolute bottom-8 start-8 end-8 font-serif text-2xl italic text-white sm:end-64 sm:text-3xl">{dict.common.tagline}</p>
          </div>
          {/* Small inset: the studio floor (landscape) */}
          <div className="absolute -bottom-8 -end-4 hidden w-60 overflow-hidden rounded-2xl border-4 border-offwhite shadow-xl sm:block">
            <div className="relative aspect-[4/3]">
              <Image src="/images/studio/studio-floor-3.jpg" alt={dict.studio.galleryTitle} fill sizes="240px" className="object-cover" />
            </div>
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow text-cyan-deep">{a.eyebrow}</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">{a.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85">{a.body}</p>
            <p className="mt-4 leading-relaxed text-charcoal/70">{a.body2}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-ink/10 py-6">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-charcoal/50">{k}</dt>
                  <dd className="mt-2 text-base font-bold text-ink sm:text-lg">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              [a.missionTitle, a.mission],
              [a.visionTitle, a.vision],
            ].map(([t, body], i) => (
              <Reveal key={t} delay={0.1 + i * 0.1} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-deep">{t}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/80">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
