import type { Dictionary, Locale } from "@/lib/i18n";
import { fmt } from "@/lib/i18n";
import { googleListingUrl, googleRating, reviews } from "@/config/site";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../Icons";
import { Stars } from "../reviews/Stars";
import { WriteReview } from "../reviews/WriteReview";

/**
 * Real client reviews (copied from the Google Maps listing — see config/site.ts → reviews)
 * plus a "Write a review" form that sends new reviews to the studio for approval.
 */
export function Testimonials({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.testimonials;
  const rating = googleRating.rating.toLocaleString(locale === "ar" ? "ar-QA-u-nu-latn" : "en-GB");
  return (
    <section id="reviews" className="scroll-mt-20 bg-offwhite py-14 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} align="center" />

        {/* Google rating summary */}
        <div className="mt-5 flex flex-col items-center gap-2 text-center sm:mt-6">
          <a
            href={googleListingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-ink/5 transition hover:ring-cyan/40"
          >
            <span className="text-2xl font-bold text-ink ltr">{rating}</span>
            <Stars value={googleRating.rating} className="h-5 w-5" label={fmt(t.googleRating, { rating })} />
            <span className="text-sm text-charcoal/70">{fmt(t.googleCount, { count: googleRating.count })}</span>
          </a>
          <p className="text-sm text-charcoal/60">{t.originalNote}</p>
        </div>

        {/* Phones: a swipeable row of compact cards. Tablet and up: three columns. */}
        <ul className="scrollbar-none -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mt-12 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {reviews.map((r, i) => (
            <li key={r.name + i} className="w-[78%] max-w-[300px] shrink-0 snap-start md:w-auto md:max-w-none">
              <Reveal delay={i * 0.1} className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5 sm:p-8">
                <span aria-hidden className="h-6 font-serif text-5xl leading-none text-cyan sm:h-auto sm:text-6xl">“</span>
                {/* Reviews are shown exactly as written (English), so mark their language. */}
                <blockquote lang="en" dir="ltr" className="mt-2 flex-1 text-[1.05rem] leading-relaxed text-charcoal/80 sm:text-lg">
                  {r.text}
                </blockquote>
                {r.rating && <Stars value={r.rating} className="mt-5 h-4 w-4" label={fmt(dict.review.stars, { n: r.rating })} />}
                <p lang="en" className="mt-4 font-bold text-ink sm:mt-5">{r.name}</p>
                <p className="text-sm text-charcoal/60">{r.source === "google" ? t.sourceGoogle : t.sourceSite}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center sm:mt-10">
          <a href={googleListingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-deep hover:underline">
            {t.readAll} <ArrowIcon className="h-4 w-4" />
          </a>
        </div>

        <WriteReview />
      </div>
    </section>
  );
}
