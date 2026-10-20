import { HighlightIcon } from "@/components/about/highlight-icon";
import { cn } from "@/lib/cn";

interface IHighlightItem {
  icon: "HEART" | "BROWSER" | "PLANT";
  text: string;
  colorClass: string;
}

const HIGHLIGHTS: IHighlightItem[] = [
  {
    icon: "HEART",
    text: "HECHO CON ❤️ PARA JUGADORES",
    colorClass: "text-magenta hover:border-magenta hover:shadow-[0_12px_28px_-14px_var(--color-magenta)]",
  },
  {
    icon: "BROWSER",
    text: "JUEGOS EN HTML — CORREN EN CUALQUIER NAVEGADOR",
    colorClass: "text-cyan hover:border-cyan hover:shadow-[0_12px_28px_-14px_var(--color-cyan)]",
  },
  {
    icon: "PLANT",
    text: "PROYECTO EN CONSTANTE CRECIMIENTO",
    colorClass: "text-green hover:border-green hover:shadow-[0_12px_28px_-14px_var(--color-green)]",
  },
];

export function AboutHero() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 pt-16 pb-10 text-center md:px-8 md:pt-20">
      <div className="mb-4 pixel text-[11px] tracking-[0.24em] neon-yellow">
        ▸ ACERCA DE
      </div>
      <h1 className="pixel text-[clamp(26px,5vw,52px)] tracking-[0.06em] bg-gradient-to-b from-white to-cyan/80 bg-clip-text text-transparent filter drop-shadow-[0_0_14px_color-mix(in_oklab,var(--color-cyan)_40%,transparent)]">
        ACERCA DE ARCADE VAULT
      </h1>
      <p className="mx-auto mt-7 max-w-[720px] font-mono text-[15px] leading-[1.8] tracking-[0.03em] text-ink-dim">
        ARCADE VAULT nació del amor por los videojuegos clásicos. Nuestra misión es preservar y celebrar
        los arcades que definieron una generación, haciéndolos accesibles para todos, en cualquier lugar
        y sin costo.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-[18px] md:grid-cols-3">
        {HIGHLIGHTS.map((item, index) => (
          <div
            key={item.text}
            style={{ transitionDelay: `${index * 80}ms` }}
            className={cn(
              "flex items-center gap-4 border border-line bg-surface-2 p-[18px_20px] text-left transition-[transform,border-color,box-shadow] duration-220 hover:-translate-y-[3px]",
              item.colorClass,
            )}
          >
            <HighlightIcon
              kind={item.icon}
              className="h-9 w-9 shrink-0 filter drop-shadow-[0_0_6px_currentColor] [image-rendering:pixelated]"
            />
            <div className="pixel text-[10px] leading-[1.5] tracking-[0.1em] text-ink">
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
