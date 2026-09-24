import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { Monogram } from "../Logo";
import { Viewfinder } from "../Viewfinder";
import { PinIcon } from "../Icons";
import { HeroVideo } from "./HeroVideo";
import { HeroText } from "./HeroText";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-midnight text-white">
      <HeroVideo label={dict.hero.videoLabel} />
      {/* Deep navy overlay, as on the WEPIC social posts */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,31,52,0.55)_0%,rgba(2,10,19,0.85)_70%)]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-navy/40 to-midnight" />
      <div aria-hidden className="glow-arc -end-[30vmax] -top-[35vmax] h-[70vmax] w-[70vmax] opacity-70" />

      {/* Side labels (vertical text like the posts). Positioned by a wrapper: inside vertical text,
          start/end would mean top/bottom. */}
      <div aria-hidden className="absolute start-6 top-1/2 hidden -translate-y-1/2 lg:block">
        <p className="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-white/60 [writing-mode:vertical-rl] rtl:rotate-180">
          <PinIcon className="h-4 w-4 rotate-90 text-cyan" /> {dict.common.dohaQatar}
        </p>
      </div>
      <div aria-hidden className="absolute end-6 top-1/2 hidden -translate-y-1/2 lg:block">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-white/60 [writing-mode:vertical-rl]">{dict.common.capturingMoments}</p>
      </div>

      <div className="container-x relative py-32">
        <div className="relative mx-auto max-w-5xl px-2 py-14 text-center sm:px-12 sm:py-20">
          <Viewfinder size={36} className="hidden sm:block" />
          <HeroText>
            <Monogram className="mx-auto h-14 w-auto text-cyan drop-shadow-[0_0_24px_rgba(0,175,239,0.6)] sm:h-16" />
            <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cyan-soft sm:text-xs sm:tracking-[0.4em]">{dict.hero.eyebrow}</p>
            <h1 className="display mx-auto mt-5 max-w-4xl text-[2.6rem] sm:text-6xl lg:text-[5.5rem]">{dict.hero.title}</h1>
            <p className="mt-6 font-serif text-2xl italic text-white/85 sm:text-3xl">{dict.hero.subtitle}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={href(locale, "/book?type=package")} className="btn btn-primary w-full sm:w-auto">
                {dict.hero.ctaBook}
              </Link>
              <Link href={href(locale, "/studio")} className="btn btn-ghost w-full sm:w-auto">
                {dict.hero.ctaRent}
              </Link>
            </div>
          </HeroText>
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/60 hover:text-cyan">
        {dict.hero.scroll}
        <span aria-hidden className="h-10 w-px animate-pulse bg-gradient-to-b from-cyan to-transparent" />
      </a>
    </section>
  );
}
