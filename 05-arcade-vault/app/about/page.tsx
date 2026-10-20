import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de | Arcade Vault",
  description: "Información sobre la plataforma Arcade Vault.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 text-center animate-fade-in md:px-8 md:py-24">
      <div className="mb-3 pixel text-xs tracking-[0.16em] neon-yellow">
        ▸ ACERCA DE
      </div>
      <h1 className="hero-title">ACERCA DE ARCADE VAULT</h1>
      <p className="mt-8 pixel text-sm tracking-[0.2em] text-yellow animate-blink md:text-base">
        EN CONSTRUCCIÓN
      </p>
    </div>
  );
}
