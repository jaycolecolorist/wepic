import Image from "next/image";
import { Viewfinder } from "./Viewfinder";

/** Shorter cinematic header used at the top of inner pages. */
export function PageHero({ eyebrow, title, intro, image, children }: { eyebrow: string; title: string; intro: string; image: string; children?: React.ReactNode }) {
  return (
    <section className="grain relative isolate flex min-h-[70svh] items-end overflow-hidden bg-midnight pb-16 pt-36 text-white sm:pb-24">
      <Image src={image} alt="" fill priority sizes="100vw" quality={70} className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/75 to-navy/50" />
      <div aria-hidden className="glow-arc -end-[25vmax] -top-[35vmax] h-[60vmax] w-[60vmax] opacity-60" />
      <div className="container-x relative">
        <div className="relative max-w-4xl p-6 sm:p-10">
          <Viewfinder size={24} />
          <p className="eyebrow hero-in">{eyebrow}</p>
          <h1 className="display hero-in mt-5 text-5xl sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="hero-in mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{intro}</p>
          {children && <div className="hero-in mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
      </div>
    </section>
  );
}
