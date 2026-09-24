import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingFromQuery } from "@/components/booking/BookingFromQuery";
import { ContactDetails } from "@/components/ContactDetails";
import { Reveal } from "@/components/Reveal";
import { Viewfinder } from "@/components/Viewfinder";

export async function generateMetadata({ params }: PageProps<"/[lang]/book">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/book", d.meta.bookTitle, d.meta.bookDescription);
}

export default async function BookPage({ params }: PageProps<"/[lang]/book">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <section className="grain relative isolate min-h-screen overflow-hidden bg-midnight pb-24 pt-36 text-white">
      <div aria-hidden className="glow-arc -end-[25vmax] -top-[35vmax] h-[60vmax] w-[60vmax] opacity-60" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <p className="eyebrow">{dict.booking.eyebrow}</p>
          <h1 className="display mt-4 text-5xl sm:text-6xl">{dict.booking.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-mist">{dict.booking.intro}</p>
          <div className="relative mt-10 rounded-[1.75rem] bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-10">
            <Viewfinder size={22} className="-m-px" />
            <Suspense fallback={<BookingForm />}>
              <BookingFromQuery />
            </Suspense>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="lg:pt-40">
          <ContactDetails dict={dict} />
        </Reveal>
      </div>
    </section>
  );
}
