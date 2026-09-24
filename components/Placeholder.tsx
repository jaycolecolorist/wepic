import { SHOW_PLACEHOLDERS } from "@/config/site";

/**
 * Small dashed badge marking content that still needs real information from WEPIC.
 * Hidden when NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=false.
 */
export function PlaceholderBadge({ label, className = "" }: { label: string; className?: string }) {
  if (!SHOW_PLACEHOLDERS) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-dashed border-amber-400/70 bg-amber-300/10 px-2.5 py-0.5 text-[0.68rem] font-semibold tracking-wide text-amber-600 ${className}`}
      data-placeholder
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {label}
    </span>
  );
}
