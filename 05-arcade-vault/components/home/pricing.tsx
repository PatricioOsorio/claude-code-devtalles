import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { SectionHead } from "./section-head";

export interface IPricingProps {
  className?: string;
}

const PERKS = [
  "✔ Acceso a todos los juegos",
  "✔ Ranking global y salón de la fama",
  "✔ Sin anuncios entre partidas",
  "✔ Guarda tus puntuaciones",
  "✔ Nuevos juegos cada mes",
  "✔ Funciona en cualquier navegador",
];

const FAQS = [
  {
    q: "¿REALMENTE ES GRATIS?",
    a: "Sí. Arcade Vault es un proyecto sin fines de lucro hecho por amor a los clásicos. No hay versión \"premium\" escondida.",
    borderTone: "border-l-cyan",
  },
  {
    q: "¿NECESITO CREAR CUENTA?",
    a: "No. Puedes jugar como invitado. Si quieres guardar tu puntuación y aparecer en el ranking, regístrate en 10 segundos.",
    borderTone: "border-l-magenta",
  },
  {
    q: "¿CÓMO SOBREVIVEN SIN COBRAR?",
    a: "Es un proyecto comunitario. Si te gusta, compártelo. Esa es toda la moneda que aceptamos.",
    borderTone: "border-l-yellow",
  },
];

export function Pricing({ className }: IPricingProps) {
  return (
    <section
      className={cn("mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-20", className)}
    >
      <SectionHead kicker="// 04" title="PRECIOS" tone="green" />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        {/* Plan Card */}
        <div className="relative flex flex-col gap-3.5 border border-green bg-gradient-to-b from-surface-2 to-[#0a0e16] p-7 shadow-[0_0_28px_color-mix(in_oklab,var(--color-green)_18%,transparent),inset_0_0_14px_color-mix(in_oklab,var(--color-green)_8%,transparent)] sm:p-8 before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-green/30">
          <div className="pixel text-[9px] tracking-[0.22em] text-ink-dim">
            PLAN ÚNICO
          </div>
          <div className="pixel text-base tracking-[0.08em] neon-green">
            JUGADOR VAULT
          </div>

          <div className="mt-1.5 flex items-baseline gap-2.5">
            <span className="pixel text-5xl tracking-[0.02em] text-transparent bg-gradient-to-b from-white to-green bg-clip-text drop-shadow-[0_0_12px_color-mix(in_oklab,var(--color-green)_50%,transparent)] sm:text-6xl">
              $0
            </span>
            <span className="pixel text-[11px] tracking-[0.16em] text-ink-dim">
              / SIEMPRE
            </span>
          </div>

          <div className="pixel text-[9px] tracking-[0.18em] text-yellow [text-shadow:0_0_6px_color-mix(in_oklab,var(--color-yellow)_45%,transparent)]">
            SIN TRUCOS · SIN LETRA PEQUEÑA
          </div>

          <ul className="my-2.5 flex flex-col gap-2 font-mono text-[13px] text-ink">
            {PERKS.map((perk, i) => (
              <li key={i} className="tracking-[0.02em]">
                {perk}
              </li>
            ))}
          </ul>

          <Link
            href="/auth"
            className={cn(
              buttonVariants({ tone: "green", size: "xl" }),
              "w-full animate-pulse-glow text-center",
            )}
          >
            EMPEZAR GRATIS →
          </Link>

          <div className="text-center font-mono text-[11px] tracking-[0.1em] text-ink-faint">
            No pedimos tarjeta. Nunca lo haremos.
          </div>

          <div
            className="pointer-events-none absolute -top-4 -right-4 rotate-12 border-2 border-magenta bg-surface/85 px-4 py-2 pixel text-xs tracking-[0.16em] text-magenta shadow-[0_0_14px_color-mix(in_oklab,var(--color-magenta)_35%,transparent),inset_0_0_8px_color-mix(in_oklab,var(--color-magenta)_20%,transparent)] [text-shadow:0_0_8px_color-mix(in_oklab,var(--color-magenta)_60%,transparent)] sm:-top-5 sm:-right-5 sm:text-sm"
            aria-hidden="true"
          >
            FREE<br />PLAY
          </div>
        </div>

        {/* FAQs */}
        <div className="flex flex-col justify-center gap-3.5">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "border border-line bg-surface-2 p-5 border-l-4",
                faq.borderTone,
              )}
            >
              <div className="mb-2 pixel text-[10px] tracking-[0.12em] text-ink">
                {faq.q}
              </div>
              <div className="font-mono text-[13px] leading-[1.6] text-ink-dim">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
