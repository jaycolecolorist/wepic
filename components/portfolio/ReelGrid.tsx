"use client";
import { useRef, useState } from "react";
import { reels } from "@/config/site";
import { fmt } from "@/lib/i18n";
import { useI18n } from "../I18nProvider";
import { PlayIcon } from "../Icons";
import { asset } from "@/lib/asset";

/** Click-to-play video reel. Nothing but the poster image loads until the visitor presses play. */
export function Reel({ slug, title, landscape = false, className = "" }: { slug: string; title: string; landscape?: boolean; className?: string }) {
  const { dict } = useI18n();
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden rounded-2xl bg-navy ${landscape ? "aspect-video" : "aspect-[9/16]"}`}>
        {playing ? (
          <video ref={ref} src={asset(`/media/reels/${slug}.mp4`)} poster={asset(`/media/reels/${slug}.jpg`)} controls autoPlay playsInline className="h-full w-full object-cover" aria-label={title} />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={fmt(dict.common.playVideo, { title })}>
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny poster frames, already web-sized */}
            <img src={asset(`/media/reels/${slug}.jpg`)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
            <span aria-hidden className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan/90 text-midnight shadow-[0_0_40px_-4px_rgba(0,175,239,0.9)] transition group-hover:scale-110">
              <PlayIcon className="ms-1 h-7 w-7" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-sm font-semibold text-white/80">{title}</figcaption>
    </figure>
  );
}

export function ReelGrid() {
  const { dict } = useI18n();
  const titles = dict.portfolio.reels as Record<string, string>;
  const portrait = reels.filter((r) => !r.landscape);
  const wide = reels.filter((r) => r.landscape);
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {portrait.map((r) => (
          <Reel key={r.slug} slug={r.slug} title={titles[r.slug]} />
        ))}
      </div>
      {wide.map((r) => (
        <Reel key={r.slug} slug={r.slug} title={titles[r.slug]} landscape className="mt-8" />
      ))}
    </div>
  );
}
