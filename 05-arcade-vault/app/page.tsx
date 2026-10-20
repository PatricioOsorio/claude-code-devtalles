import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { GamesPreview } from "@/components/home/games-preview";
import { Stats } from "@/components/home/stats";
import { Activity } from "@/components/home/activity";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Arcade Vault | El Arcade Clásico Está de Vuelta",
  description:
    "Juega los mejores clásicos directamente en tu navegador. Sin descargas. Sin costo. Solo diversión.",
};

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <Hero />

      <Reveal>
        <Features />
      </Reveal>

      <Reveal>
        <GamesPreview />
      </Reveal>

      <Reveal>
        <Stats />
      </Reveal>

      <Reveal>
        <Activity />
      </Reveal>

      <Reveal>
        <Pricing />
      </Reveal>

      <Reveal>
        <FinalCta />
      </Reveal>
    </div>
  );
}
