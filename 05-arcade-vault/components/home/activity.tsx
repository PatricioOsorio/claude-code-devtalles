import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ITone } from "@/lib/data";
import { SectionHead } from "./section-head";

export interface IActivityRow {
  player: string;
  game: string;
  score: number;
  ago: string;
  tone: ITone;
}

export interface ITopPlayer {
  rank: number;
  name: string;
  score: number;
}

export interface IActivityProps {
  className?: string;
}

const ACTIVITIES: IActivityRow[] = [
  { player: "NEONFOX", game: "Caída", score: 184220, ago: "hace 2 min", tone: "magenta" },
  { player: "PX_KAI", game: "Glotón", score: 96400, ago: "hace 5 min", tone: "yellow" },
  { player: "Z3R0COOL", game: "Invasores", score: 54190, ago: "hace 8 min", tone: "green" },
  { player: "VAULT_07", game: "Rocas", score: 41200, ago: "hace 12 min", tone: "cyan" },
  { player: "GLITCHA", game: "Bloque Buster", score: 28450, ago: "hace 18 min", tone: "cyan" },
  { player: "ARKADYA", game: "Serpentina", score: 7820, ago: "hace 24 min", tone: "green" },
  { player: "CYBER_LU", game: "Ranaria", score: 18900, ago: "hace 31 min", tone: "yellow" },
];

const TOP_PLAYERS: ITopPlayer[] = [
  { rank: 1, name: "NEONFOX", score: 312840 },
  { rank: 2, name: "PX_KAI", score: 248110 },
  { rank: 3, name: "M00NRYU", score: 196720 },
  { rank: 4, name: "VAULT_07", score: 154300 },
  { rank: 5, name: "GLITCHA", score: 138900 },
];

export function Activity({ className }: IActivityProps) {
  const playerToneClass: Record<ITone, string> = {
    cyan: "neon-cyan",
    magenta: "neon-magenta",
    yellow: "neon-yellow",
    green: "neon-green",
  };

  return (
    <section
      className={cn("mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-20", className)}
    >
      <SectionHead kicker="// 03" title="ACTIVIDAD EN VIVO" tone="yellow" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        {/* Ticker card */}
        <div className="border border-line bg-surface-2">
          <div className="flex items-center justify-between gap-2.5 border-b border-line px-3.5 py-3">
            <div className="pixel text-[10px] tracking-[0.1em] neon-cyan">
              ▸ ÚLTIMAS PUNTUACIONES
            </div>
            <div className="flex items-center gap-1.5 border border-green/35 bg-green/10 px-2 py-1 pixel text-[8px] tracking-[0.14em] text-green">
              <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_8px_var(--color-green)] animate-pulse" />
              <span>EN VIVO</span>
            </div>
          </div>

          <div className="py-1.5">
            {ACTIVITIES.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-1 items-center gap-1 border-b border-line-2 px-4 py-3 font-mono text-[13px] last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-3"
              >
                <span
                  className={cn(
                    "pixel text-[10px] tracking-[0.06em]",
                    playerToneClass[r.tone],
                  )}
                >
                  {r.player}
                </span>
                <span className="text-xs text-ink-dim">▸ {r.game}</span>
                <span className="pixel text-[11px] text-yellow [text-shadow:0_0_6px_color-mix(in_oklab,var(--color-yellow)_50%,transparent)]">
                  +{r.score.toLocaleString("es-ES")}
                </span>
                <span className="text-[11px] tracking-[0.08em] text-ink-faint">
                  {r.ago}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top players leaderboard */}
        <div className="border border-line bg-surface-2">
          <div className="flex items-center justify-between gap-2.5 border-b border-line px-3.5 py-3">
            <div className="pixel text-[10px] tracking-[0.1em] neon-magenta">
              ▸ TOP JUGADORES · HOY
            </div>
            <Link
              href="/hall-of-fame"
              className="border border-line bg-transparent px-2.5 py-1.5 pixel text-[9px] tracking-[0.14em] text-ink-dim transition-colors hover:border-magenta hover:text-magenta hover:shadow-[0_0_8px_color-mix(in_oklab,var(--color-magenta)_35%,transparent)]"
            >
              VER SALÓN →
            </Link>
          </div>

          <div className="flex flex-col gap-2.5 p-4 sm:px-5 sm:py-4.5">
            {TOP_PLAYERS.map((r, i) => {
              const rankColor =
                r.rank === 1
                  ? "text-gold [text-shadow:0_0_6px_color-mix(in_oklab,var(--color-gold)_60%,transparent)]"
                  : r.rank === 2
                    ? "text-silver"
                    : r.rank === 3
                      ? "text-bronze"
                      : "text-cyan";

              const barBg =
                r.rank === 1
                  ? "bg-gradient-to-r from-gold/15 to-transparent"
                  : r.rank === 2
                    ? "bg-gradient-to-r from-silver/10 to-transparent"
                    : r.rank === 3
                      ? "bg-gradient-to-r from-bronze/10 to-transparent"
                      : "bg-gradient-to-r from-cyan/5 to-transparent";

              return (
                <div
                  key={i}
                  className="relative grid grid-cols-[36px_1fr_auto] items-center gap-2.5 py-2 font-mono"
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-y-0 left-9 right-0",
                      barBg,
                    )}
                  />
                  <span className={cn("relative z-1 pixel text-[10px]", rankColor)}>
                    #{String(r.rank).padStart(2, "0")}
                  </span>
                  <span className="relative z-1 pixel text-[11px] tracking-[0.06em] text-ink truncate">
                    {r.name}
                  </span>
                  <span className={cn("relative z-1 pixel text-[11px]", rankColor)}>
                    {r.score.toLocaleString("es-ES")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
