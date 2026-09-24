import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = "start",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  dark?: boolean;
  align?: "start" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${dark ? "" : "text-cyan-deep"}`}>{eyebrow}</p>}
      <Tag className={`display mt-4 text-4xl sm:text-5xl lg:text-6xl ${dark ? "text-white" : "text-ink"}`}>{title}</Tag>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-mist" : "text-charcoal/80"}`}>{intro}</p>}
    </Reveal>
  );
}
