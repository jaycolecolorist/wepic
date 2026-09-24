/** Hero entrance animation in pure CSS, so the headline never waits for JavaScript to appear. */
export function HeroText({ children }: { children: React.ReactNode }) {
  return <div className="hero-in">{children}</div>;
}
