import type { Dictionary } from "@/lib/i18n";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { ContactDetails } from "../ContactDetails";
import { MapEmbed } from "../MapEmbed";

export function ContactSection({ dict }: { dict: Dictionary }) {
  return (
    <section id="contact" className="grain relative isolate overflow-hidden bg-navy py-24 text-white sm:py-32">
      <div aria-hidden className="glow-arc -bottom-[40vmax] -end-[20vmax] h-[60vmax] w-[60vmax] rotate-180 opacity-50" />
      <div className="container-x relative grid gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={dict.contact.eyebrow} title={dict.contact.title} intro={dict.contact.intro} dark />
          <Reveal delay={0.1} className="mt-12">
            <ContactDetails dict={dict} />
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <MapEmbed title={dict.contact.mapTitle} className="h-[420px] lg:h-full lg:min-h-[520px]" />
        </Reveal>
      </div>
    </section>
  );
}
