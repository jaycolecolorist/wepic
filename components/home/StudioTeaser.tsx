import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { Reveal } from "../Reveal";
import { Viewfinder } from "../Viewfinder";
import { ArrowIcon } from "../Icons";

export function StudioTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.studioTeaser;
  const shots = [
    { src: "/images/studio/set-purple-lounge.jpg", cls: "col-span-2 aspect-[16/10]" },
    { src: "/images/studio/set-panel-wall.jpg", cls: "aspect-[3/4]" },
    { src: "/images/studio/set-majlis.jpg", cls: "aspect-[3/4]" },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-midnight py-24 text-white sm:py-32">
      <Image src="/images/studio/studio-floor-1.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/60 rtl:bg-gradient-to-l" />
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">{t.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">{t.body}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {t.points.map((pt) => (
              <li key={pt} className="rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 text-sm text-cyan-soft">
                {pt}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={href(locale, "/studio")} className="btn btn-primary">
              {t.cta} <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link href={href(locale, "/book?type=studio")} className="btn btn-ghost">
              {dict.studio.ctaBook}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="relative grid grid-cols-2 gap-4 p-3">
          <Viewfinder />
          {shots.map((s) => (
            <div key={s.src} className={`relative overflow-hidden rounded-xl ${s.cls}`}>
              <Image src={s.src} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
