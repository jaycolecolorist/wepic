import type { Dictionary } from "@/lib/i18n";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { PlaceholderBadge } from "../Placeholder";

/**
 * TODO: these are placeholder testimonials (none were in the assets folder).
 * Replace the quotes in locales/en.json + ar.json → testimonials.items with real client reviews.
 */
export function Testimonials({ dict }: { dict: Dictionary }) {
  const t = dict.testimonials;
  return (
    <section className="bg-offwhite py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} align="center" />
        <div className="mt-4 flex justify-center">
          <PlaceholderBadge label={t.note} />
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {t.items.map((item, i) => (
            <li key={i}>
              <Reveal delay={i * 0.1} className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink/5">
                <span aria-hidden className="font-serif text-6xl leading-none text-cyan">“</span>
                <blockquote className="mt-2 flex-1 text-lg leading-relaxed text-charcoal/80">{item.quote}</blockquote>
                <p className="mt-6 font-bold text-ink">{item.name}</p>
                <p className="text-sm text-charcoal/60">{item.role}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
