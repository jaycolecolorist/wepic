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
    <section id="reviews" className="scroll-mt-20 bg-offwhite py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} align="center" />

        {/* Google rating summary */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
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

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.name + i}>
              <Reveal delay={i * 0.1} className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink/5">
                <span aria-hidden className="font-serif text-6xl leading-none text-cyan">“</span>
                {/* Reviews are shown exactly as written (English), so mark their language. */}
                <blockquote lang="en" dir="ltr" className="mt-2 flex-1 text-lg leading-relaxed text-charcoal/80">
                  {r.text}
                </blockquote>
                {r.rating && <Stars value={r.rating} className="mt-5 h-4 w-4" label={fmt(dict.review.stars, { n: r.rating })} />}
                <p lang="en" className="mt-5 font-bold text-ink">{r.name}</p>
                <p className="text-sm text-charcoal/60">{r.source === "google" ? t.sourceGoogle : t.sourceSite}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <a href={googleListingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-deep hover:underline">
            {t.readAll} <ArrowIcon className="h-4 w-4" />
          </a>
        </div>

        <WriteReview />
      </div>
    </section>
  );
}
