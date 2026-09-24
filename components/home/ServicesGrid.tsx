import Link from "next/link";
import { services } from "@/config/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../Icons";
import { ServiceVisual } from "../ServiceVisual";

export function ServicesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={dict.services.eyebrow} title={dict.services.title} intro={dict.services.intro} />
          <Reveal>
            <Link href={href(locale, "/services")} className="btn btn-outline-dark">
              {dict.common.learnMore} <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {services.map((s, i) => {
            const item = dict.services.items[s.id];
            return (
              <li key={s.id}>
                <Reveal delay={(i % 5) * 0.06}>
                  <Link
                    href={`${href(locale, "/services")}#${s.id}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-midnight"
                  >
                    <ServiceVisual src={s.image} alt="" sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw" placeholderLabel={dict.common.placeholder} />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
                      <span className="text-xs font-bold text-cyan">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-1 text-sm font-bold leading-tight text-white sm:text-lg">{item.title}</h3>
                      <p className="mt-2 max-h-0 overflow-hidden text-sm leading-snug text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100 group-focus-visible:max-h-32 group-focus-visible:opacity-100">
                        {item.short}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
