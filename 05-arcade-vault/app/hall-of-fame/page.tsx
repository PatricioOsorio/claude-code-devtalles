import type { Metadata } from "next";
import { HallTabs } from "@/components/hall/hall-tabs";
import { GAMES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Salón de la Fama | Arcade Vault",
  description: "Los récords históricos y campeones de todos los juegos de Arcade Vault.",
};

export default function HallOfFamePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 animate-fade-in md:px-8 md:py-12">
      <div className="mb-7 text-center">
        <h1 className="hall-title">SALÓN DE LA FAMA</h1>
        <p className="mt-3 pixel text-[10px] tracking-[0.1em] text-ink-dim">
          LOS NOMBRES QUE NUNCA SE BORRAN DE LA PANTALLA
        </p>
      </div>

      <HallTabs games={GAMES} />
    </div>
  );
}
