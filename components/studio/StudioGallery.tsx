"use client";
import Image from "next/image";
import { useState } from "react";
import { studioGallery } from "@/config/site";
import { fmt } from "@/lib/i18n";
import { useI18n } from "../I18nProvider";
import { Lightbox } from "../portfolio/Lightbox";

export function StudioGallery() {
  const { locale, dict } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const images = studioGallery.map((g) => ({ src: g.src, alt: g.alt[locale], w: g.w, h: g.h }));
  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {images.map((img, i) => (
          <li key={img.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={fmt(dict.portfolio.open, { alt: img.alt })}
              className="group relative block w-full overflow-hidden rounded-xl bg-navy"
              style={{ aspectRatio: `${img.w} / ${img.h}` }}
            >
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={open} onChange={setOpen} />
    </>
  );
}
