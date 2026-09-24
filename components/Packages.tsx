import Link from "next/link";
import { packages } from "@/config/site";
import { fmt, type Dictionary, type Locale } from "@/lib/i18n";
import { href } from "@/lib/links";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { CheckIcon } from "./Icons";

/** Monthly package pricing cards (prices in config/site.ts, wording in locales). */
export function Packages({ locale, dict, id = "packages" }: { locale: Locale; dict: Dictionary; id?: string }) {
  const nf = new Intl.NumberFormat("en-US");
  return (
    <section id={id} className="grain relative isolate overflow-hidden bg-navy py-24 text-white sm:py-32">
      <div aria-hidden className="glow-arc -start-[25vmax] -top-[30vmax] h-[60vmax] w-[60vmax] opacity-60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(2,120,190,0.35),transparent_60%)]" />
      <div className="container-x relative">
        <SectionHeading eyebrow={dict.packages.eyebrow} title={dict.packages.title} intro={dict.packages.intro} dark align="center" />
        <div className="mt-10 grid items-stretch gap-6 sm:mt-16 lg:grid-cols-3 lg:gap-8">
          {packages.map((p, i) => {
            const item = dict.packages.items[p.id];
            return (
              <Reveal key={p.id} delay={i * 0.1} className="flex">
                <article
                  className={`relative flex w-full flex-col rounded-[1.75rem] p-8 sm:p-10 ${
                    p.featured
                      ? "bg-gradient-to-b from-cyan/25 to-navy-2 shadow-[0_0_60px_-10px_rgba(0,175,239,0.6)] ring-2 ring-cyan lg:-my-4 lg:py-14"
                      : "bg-white/[0.04] ring-1 ring-white/10"
                  }`}
                >
                  {p.featured && (
                    <p className="absolute -top-4 start-1/2 -translate-x-1/2 rounded-full bg-cyan px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-midnight rtl:translate-x-1/2">
                      {dict.common.mostPopular}
                    </p>
                  )}
                  <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-cyan">{item.name}</h3>
                  <p className="mt-5 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-white/70">{dict.common.qar}</span>
                    <span className="display text-5xl sm:text-6xl">{nf.format(p.priceQar)}</span>
                    <span className="text-white/60">{dict.common.perMonth}</span>
                  </p>
                  <ul className="mt-8 flex-1 space-y-3.5">
                    {item.features.map((f) => (
                      <li key={f} className="flex gap-3 text-white/85">
                        <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href(locale, `/book?type=package&item=${p.id}`)}
                    className={`btn mt-10 w-full ${p.featured ? "btn-primary" : "btn-ghost"}`}
                  >
                    {fmt(dict.common.choosePackage, { name: item.name })}
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="mx-auto mt-14 max-w-xl text-center text-mist">{dict.packages.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
