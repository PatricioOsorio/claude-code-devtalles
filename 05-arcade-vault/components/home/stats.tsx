import { cn } from "@/lib/cn";

export interface IStatsProps {
  className?: string;
}

const STATS = [
  { n: "12+", u: "JUEGOS", s: "Y CONTANDO" },
  { n: "MILES", u: "DE PARTIDAS", s: "JUGADAS CADA DÍA" },
  { n: "GLOBAL", u: "RANKING", s: "COMPITE CON EL MUNDO" },
];

export function Stats({ className }: IStatsProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-line bg-gradient-to-b from-[#06060a] to-[#0c0c14] px-4 py-14 md:px-8 md:py-16 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(80%_60%_at_50%_50%,color-mix(in_oklab,var(--color-yellow)_6%,transparent),transparent_70%)]",
        className,
      )}
    >
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
        {STATS.map((st, i) => (
          <div
            key={i}
            style={{ transitionDelay: `${i * 90}ms` }}
            className="border-t border-line p-5 text-center first:border-t-0 md:border-t-0 md:border-l md:border-line md:first:border-l-0"
          >
            <div className="pixel text-3xl tracking-[0.04em] neon-yellow sm:text-4xl md:text-5xl">
              {st.n}
            </div>
            <div className="mt-2.5 pixel text-[13px] tracking-[0.18em] text-ink">
              {st.u}
            </div>
            <div className="mt-2 font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
              {st.s}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
