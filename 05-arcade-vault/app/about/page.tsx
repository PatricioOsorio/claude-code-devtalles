import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutDivider } from "@/components/about/divider";
import { ContactIntro } from "@/components/about/contact-intro";
import { ContactForm } from "@/components/about/contact-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Acerca de | Arcade Vault",
  description: "Información sobre la plataforma Arcade Vault y contacto.",
};

export default function AboutPage() {
  return (
    <div className="animate-fade-in pb-20">
      <AboutHero />

      <Reveal>
        <AboutDivider />
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-[1200px] px-6 pb-20 md:px-8">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1.2fr]">
            <ContactIntro />
            <ContactForm />
          </div>
        </section>
      </Reveal>
    </div>
  );
}
