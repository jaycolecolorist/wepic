/**
 * WEPIC monogram, redrawn as a vector from the logo in "Wepic Monthly Packages.pdf"
 * (the assets folder has no standalone logo file).
 * TODO: swap for the official vector logo (SVG/AI) when WEPIC supplies it.
 */
export function Monogram({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 421 340" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <g fill="currentColor" fillRule="evenodd">
        <polygon points="3,58 53,58 188,295 163,335" />
        <polygon points="373,58 418,58 309,253 283,209" />
        <path d="M211 3 L287 126 L240 206 L287 295 L262 337 L139 127 Z M212 86 L191 126 L213 162 L234 126 Z" />
      </g>
    </svg>
  );
}

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
      <Monogram className="h-8 w-auto text-cyan drop-shadow-[0_0_10px_rgba(0,175,239,0.45)]" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[1.55rem] font-medium tracking-[0.08em] text-white">WEPIC</span>
          <span className="mt-0.5 text-[0.5rem] font-bold tracking-[0.34em] text-white/80">PHOTOGRAPHY</span>
        </span>
      )}
    </span>
  );
}
