"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio, portfolioSrc, type Category } from "@/config/site";
import { fmt } from "@/lib/i18n";
import { useI18n } from "../I18nProvider";
import { CameraIcon } from "../Icons";
import { Lightbox, type LightboxImage } from "./Lightbox";

type Filter = "all" | Category;
const FILTERS: Filter[] = ["all", "portraits", "products", "commercial", "events"];

/** Filterable portfolio grid. `limit` shows only the first N (home page preview). */
export function PortfolioGrid({ limit, dark = true }: { limit?: number; dark?: boolean }) {
  const { dict } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);

  const items = useMemo(() => {
    const list = filter === "all" ? portfolio : portfolio.filter((p) => p.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit]);

  const images: LightboxImage[] = items.map((p) => ({
    src: portfolioSrc(p.slug),
    alt: dict.portfolio.alt[p.slug as keyof typeof dict.portfolio.alt] ?? "",
    w: p.w,
    h: p.h,
  }));

  return (
    <div>
      <div role="group" aria-label={dict.portfolio.filterLabel} className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              filter === f
                ? "bg-cyan text-midnight shadow-[0_0_24px_-6px_rgba(0,175,239,0.8)]"
                : dark
                  ? "bg-white/5 text-white/75 ring-1 ring-white/10 hover:text-white"
                  : "bg-ink/5 text-charcoal hover:bg-ink/10"
            }`}
          >
            {dict.portfolio.filters[f]}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        // TODO: add event photos to config/site.ts → portfolio with category "events"
        <div className={`mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed py-20 text-center ${dark ? "border-white/15 text-white/60" : "border-ink/15 text-charcoal/60"}`}>
          <CameraIcon className="h-10 w-10 text-cyan" />
          <p>{dict.portfolio.eventsEmpty}</p>
        </div>
      ) : (
        <motion.ul layout className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.li
                layout
                key={p.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={fmt(dict.portfolio.open, { alt: images[i].alt })}
                  className="group relative block w-full overflow-hidden rounded-xl bg-navy"
                >
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={images[i].src}
                      alt={images[i].alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <span aria-hidden className="absolute bottom-3 start-3 rounded-full bg-midnight/60 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-cyan opacity-0 backdrop-blur transition group-hover:opacity-100">
                    {dict.portfolio.filters[p.category]}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
      <Lightbox images={images} index={open} onChange={setOpen} />
    </div>
  );
}
