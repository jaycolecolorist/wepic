import { site } from "@/config/site";

/** Google Map pinned on the studio's Google Maps listing. */
export function MapEmbed({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-navy ring-1 ring-white/10 ${className}`}>
      <iframe
        title={title}
        src={site.mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 grayscale-[0.4] contrast-[1.05]"
        allowFullScreen
      />
    </div>
  );
}
