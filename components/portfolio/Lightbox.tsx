"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fmt } from "@/lib/i18n";
import { useI18n } from "../I18nProvider";
import { ChevronIcon, CloseIcon } from "../Icons";

export type LightboxImage = { src: string; alt: string; w: number; h: number };

/** Full-screen image viewer: Esc closes, ←/→ navigate (mirrored in Arabic), swipe on touch screens. */
export function Lightbox({ images, index, onChange }: { images: LightboxImage[]; index: number | null; onChange: (i: number | null) => void }) {
  const { dict, locale } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const rtl = locale === "ar";

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      if (e.key === "Tab") {
        // keep keyboard focus inside the viewer
        const focusables = document.querySelectorAll<HTMLElement>("[data-lightbox] button");
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      returnFocus.current?.focus();
    };
  }, [open, go, onChange, rtl]);

  const img = index !== null ? images[index] : null;
  return (
    <AnimatePresence>
      {img && (
        <motion.div
          data-lightbox
          role="dialog"
          aria-modal="true"
          aria-label={img.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-midnight/95 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go((dx < 0 ? 1 : -1) * (rtl ? -1 : 1));
            touchX.current = null;
          }}
        >
          <motion.div
            key={img.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative h-[82vh] w-[92vw] max-w-6xl"
          >
            <Image src={img.src} alt={img.alt} fill sizes="92vw" quality={80} className="object-contain" />
          </motion.div>
          <p className="absolute bottom-5 inset-x-0 px-16 text-center text-sm text-white/70">
            <span className="sr-only">{fmt(dict.common.imageOf, { n: (index ?? 0) + 1, total: images.length })}. </span>
            {img.alt}
            <span aria-hidden className="ms-3 text-white/40">
              {(index ?? 0) + 1} / {images.length}
            </span>
          </p>
          <button ref={closeRef} type="button" onClick={() => onChange(null)} aria-label={dict.common.close} className="absolute end-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-cyan hover:text-midnight">
            <CloseIcon className="h-6 w-6" />
          </button>
          <button type="button" onClick={() => go(-1)} aria-label={dict.common.previous} className="absolute start-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-cyan hover:text-midnight">
            <ChevronIcon className="h-6 w-6 -scale-x-100 rtl:scale-x-100" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={dict.common.next} className="absolute end-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-cyan hover:text-midnight">
            <ChevronIcon className="h-6 w-6 rtl:-scale-x-100" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
