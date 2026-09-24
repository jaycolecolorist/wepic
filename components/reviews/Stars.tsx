/** Read-only star rating (supports fractions, e.g. 4.8). Stars fill from the reading start (right in Arabic). */
export function Stars({ value, label, className = "h-5 w-5" }: { value: number; label: string; className?: string }) {
  return (
    <span role="img" aria-label={label} className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} aria-hidden className={`relative inline-block ${className}`}>
            <StarShape className="absolute inset-0 h-full w-full text-ink/15" />
            <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarShape className={`h-full text-amber-400 ${className}`} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function StarShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
    </svg>
  );
}
