import { cn } from "@/lib/cn";

export interface IContactIntroProps {
  className?: string;
}

export function ContactIntro({ className }: IContactIntroProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-3.5 pixel text-[11px] tracking-[0.24em] neon-cyan">
        ▸ CONTACTO
      </div>
      <h2 className="pixel text-[clamp(22px,3.5vw,36px)] tracking-[0.06em] text-cyan drop-shadow-[0_0_12px_color-mix(in_oklab,var(--color-cyan)_40%,transparent)]">
        CONTÁCTANOS
      </h2>
      <p className="my-5 font-mono text-sm leading-[1.7] text-ink-dim md:my-6">
        ¿Tienes alguna sugerencia, quieres proponer un juego, o simplemente quieres saludar? Escríbenos.
      </p>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5 pixel text-[9px] tracking-[0.14em] text-ink-dim">
          <span className="h-2 w-2 shrink-0 rounded-full bg-green shadow-[0_0_6px_var(--color-green)] animate-pulse-led" />
          RESPUESTA EN 24-48H
        </div>
        <div className="flex items-center gap-2.5 pixel text-[9px] tracking-[0.14em] text-ink-dim">
          <span className="h-2 w-2 shrink-0 rounded-full bg-yellow shadow-[0_0_6px_var(--color-yellow)] animate-pulse-led [animation-delay:-0.6s]" />
          SUGERENCIAS BIENVENIDAS
        </div>
        <div className="flex items-center gap-2.5 pixel text-[9px] tracking-[0.14em] text-ink-dim">
          <span className="h-2 w-2 shrink-0 rounded-full bg-magenta shadow-[0_0_6px_var(--color-magenta)] animate-pulse-led [animation-delay:-1.2s]" />
          SIN SPAM, JAMÁS
        </div>
      </div>
    </div>
  );
}
