"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

/**
 * Full-bleed background video for the hero.
 * - The poster image renders immediately (and is what Google measures for LCP).
 * - The video file is only attached after the page has loaded, so it never delays first paint.
 * - Phones get a vertical 720×1280 cut; larger screens a 1920×1080 triptych.
 * - Visitors with "reduce motion" switched on keep the still poster.
 * Files: public/media/hero-*.mp4 (built by scripts/prepare-media.sh from the WEPIC reels).
 */
export function HeroVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setMobile(isMobile);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const attach = () => setSrc(asset(isMobile ? "/media/hero-mobile.mp4" : "/media/hero-desktop.mp4"));
    if (document.readyState === "complete") attach();
    else window.addEventListener("load", attach, { once: true });
    return () => window.removeEventListener("load", attach);
  }, []);

  useEffect(() => {
    if (src) ref.current?.play().catch(() => {});
  }, [src]);

  return (
    <div className="absolute inset-0" aria-hidden>
      <Image src="/images/hero-poster.jpg" alt="" fill priority sizes="100vw" quality={70} className="hidden object-cover md:block" />
      <Image src="/images/hero-poster-mobile.jpg" alt="" fill priority sizes="100vw" quality={70} className="object-cover md:hidden" />
      {src && (
        <video
          ref={ref}
          key={src}
          src={src}
          poster={asset(mobile ? "/images/hero-poster-mobile.jpg" : "/images/hero-poster.jpg")}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          aria-label={label}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
