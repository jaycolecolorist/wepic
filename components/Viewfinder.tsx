/** Camera-viewfinder corner marks — the framing device used on every WEPIC post. */
export function Viewfinder({ className = "", size = 28 }: { className?: string; size?: number }) {
  const s = { width: size, height: size };
  const c = "absolute border-cyan/80";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span style={s} className={`${c} start-0 top-0 border-s-2 border-t-2`} />
      <span style={s} className={`${c} end-0 top-0 border-e-2 border-t-2`} />
      <span style={s} className={`${c} bottom-0 start-0 border-b-2 border-s-2`} />
      <span style={s} className={`${c} bottom-0 end-0 border-b-2 border-e-2`} />
    </div>
  );
}
