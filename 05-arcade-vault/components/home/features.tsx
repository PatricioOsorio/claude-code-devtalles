import { cn } from "@/lib/cn";
import type { ITone } from "@/lib/data";
import { SectionHead } from "./section-head";

export interface IFeature {
  icon: "gamepad" | "free" | "trophy" | "rocket";
  title: string;
  desc: string;
  tone: ITone;
}

export interface IFeaturesProps {
  className?: string;
}

const FEATURES: IFeature[] = [
  {
    icon: "gamepad",
    title: "JUEGOS CLÁSICOS",
    desc: "Arkanoid, Tetris, Snake y muchos más. Los mejores arcades de todos los tiempos en un solo lugar.",
    tone: "cyan",
  },
  {
    icon: "free",
    title: "100% GRATIS",
    desc: "Sin suscripciones, sin pagos ocultos. Todos los juegos disponibles de forma gratuita.",
    tone: "yellow",
  },
  {
    icon: "trophy",
    title: "LADDER BOARDS",
    desc: "Compite con jugadores de todo el mundo. Escala el ranking y demuestra quién es el mejor.",
    tone: "magenta",
  },
  {
    icon: "rocket",
    title: "SIEMPRE CRECIENDO",
    desc: "Agregamos nuevos juegos constantemente. Vuelve seguido, siempre habrá algo nuevo que jugar.",
    tone: "green",
  },
];

function FeatureIcon({ kind }: { kind: IFeature["icon"] }) {
  const c = "currentColor";
  if (kind === "gamepad") {
    return (
      <svg
        className="h-11 w-11 drop-shadow-[0_0_8px_currentColor] [image-rendering:pixelated]"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <g fill={c}>
          <rect x="2" y="6" width="12" height="6" />
          <rect x="0" y="8" width="2" height="4" />
          <rect x="14" y="8" width="2" height="4" />
          <rect x="3" y="8" width="2" height="2" />
          <rect x="2" y="9" width="4" height="0.5" />
          <rect x="11" y="7" width="1.5" height="1.5" />
          <rect x="11" y="10" width="1.5" height="1.5" />
        </g>
      </svg>
    );
  }
  if (kind === "free") {
    return (
      <svg
        className="h-11 w-11 drop-shadow-[0_0_8px_currentColor] [image-rendering:pixelated]"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <g fill={c}>
          <rect
            x="3"
            y="3"
            width="10"
            height="10"
            fill="none"
            stroke={c}
            strokeWidth="1.5"
          />
          <rect x="5" y="6" width="1.5" height="4" />
          <rect x="5" y="6" width="4" height="1.5" />
          <rect x="5" y="8" width="3" height="1" />
          <rect x="10" y="6" width="1.5" height="4" />
        </g>
      </svg>
    );
  }
  if (kind === "trophy") {
    return (
      <svg
        className="h-11 w-11 drop-shadow-[0_0_8px_currentColor] [image-rendering:pixelated]"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <g fill={c}>
          <rect x="3" y="2" width="10" height="2" />
          <rect x="3" y="2" width="2" height="6" />
          <rect x="11" y="2" width="2" height="6" />
          <rect x="5" y="8" width="6" height="2" />
          <rect x="7" y="10" width="2" height="3" />
          <rect x="5" y="13" width="6" height="1.5" />
          <rect x="1" y="3" width="2" height="3" />
          <rect x="13" y="3" width="2" height="3" />
        </g>
      </svg>
    );
  }
  return (
    <svg
      className="h-11 w-11 drop-shadow-[0_0_8px_currentColor] [image-rendering:pixelated]"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <g fill={c}>
        <rect x="7" y="1" width="2" height="2" />
        <rect x="6" y="3" width="4" height="2" />
        <rect x="5" y="5" width="6" height="6" />
        <rect x="4" y="11" width="2" height="2" />
        <rect x="10" y="11" width="2" height="2" />
        <rect x="7" y="6" width="2" height="2" fill="#0a0a0f" />
        <rect x="6" y="13" width="1" height="2" />
        <rect x="9" y="13" width="1" height="2" />
      </g>
    </svg>
  );
}

export function Features({ className }: IFeaturesProps) {
  const toneMap: Record<ITone, string> = {
    cyan: "text-cyan hover:border-cyan hover:shadow-[0_18px_40px_-16px_var(--color-cyan)]",
    magenta: "text-magenta hover:border-magenta hover:shadow-[0_18px_40px_-16px_var(--color-magenta)]",
    yellow: "text-yellow hover:border-yellow hover:shadow-[0_18px_40px_-16px_var(--color-yellow)]",
    green: "text-green hover:border-green hover:shadow-[0_18px_40px_-16px_var(--color-green)]",
  };

  return (
    <section
      className={cn("mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-20", className)}
    >
      <SectionHead kicker="// 01" title="¿POR QUÉ ARCADE VAULT?" tone="magenta" />

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            style={{ transitionDelay: `${i * 80}ms` }}
            className={cn(
              "relative flex flex-col gap-3.5 border border-line bg-gradient-to-b from-surface-2 to-surface-3 p-5 md:p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1.5",
              toneMap[f.tone],
            )}
          >
            <FeatureIcon kind={f.icon} />
            <div className="pixel text-xs tracking-[0.1em] text-current drop-shadow-[0_0_8px_currentColor]">
              {f.title}
            </div>
            <div className="text-[13px] leading-[1.6] text-ink-dim">
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
