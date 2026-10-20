"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { seededScores, type IGame } from "@/lib/data";
import { cn } from "@/lib/cn";

export interface IHallTabsProps {
  games: IGame[];
  className?: string;
}

export function HallTabs({ games, className }: IHallTabsProps) {
  const [tab, setTab] = useState(games[0]?.id ?? "bloque-buster");

  const rows = useMemo(() => {
    return seededScores(tab.length * 23 + 7, 12);
  }, [tab]);

  const champion = rows[0];
  const second = rows[1];
  const third = rows[2];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Game selector chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {games.map((g) => {
          const isActive = tab === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setTab(g.id)}
              className={cn(
                "cursor-pointer border px-3.5 py-3 pixel text-[9px] tracking-[0.12em] transition-colors duration-150",
                isActive
                  ? "border-magenta bg-surface-2 text-magenta shadow-[0_0_10px_color-mix(in_oklab,var(--color-magenta)_35%,transparent)]"
                  : "border-line bg-surface-2 text-ink-dim hover:border-ink-dim hover:text-ink",
              )}
            >
              {g.title}
            </button>
          );
        })}
      </div>

      {/* Podium: visual order 02 (silver) - 01 (gold) - 03 (bronze) */}
      <div className="my-2 grid grid-cols-1 items-end gap-3.5 md:grid-cols-[1fr_1.2fr_1fr]">
        {/* Slot 02 - Silver */}
        <div className="relative border border-silver bg-surface-2 p-4 text-center">
          <div className="pixel text-3xl text-silver drop-shadow-[0_0_12px_var(--color-silver)]">
            02
          </div>
          <div className="mt-2 pixel text-xs tracking-wider text-ink">
            {second.name}
          </div>
          <div className="mt-2 pixel text-base neon-cyan">
            {second.score.toLocaleString("es-ES")}
          </div>
          <div className="mt-1.5 font-mono text-[11px] tracking-wider text-ink-faint">
            {second.date}
          </div>
        </div>

        {/* Slot 01 - Gold (Champion) */}
        <div className="relative border border-gold bg-surface-2 p-5 text-center shadow-[0_0_22px_color-mix(in_oklab,var(--color-gold)_35%,transparent)]">
          <div className="pixel text-[9px] tracking-[0.18em] text-gold">
            CAMPEÓN
          </div>
          <div className="mt-1 pixel text-4xl text-gold drop-shadow-[0_0_16px_var(--color-gold)]">
            01
          </div>
          <div className="mt-2 pixel text-sm tracking-wider text-ink">
            {champion.name}
          </div>
          <div className="mt-2 pixel text-xl neon-cyan">
            {champion.score.toLocaleString("es-ES")}
          </div>
          <div className="mt-1.5 font-mono text-[11px] tracking-wider text-ink-faint">
            {champion.date}
          </div>
        </div>

        {/* Slot 03 - Bronze */}
        <div className="relative border border-bronze bg-surface-2 p-4 text-center">
          <div className="pixel text-3xl text-bronze drop-shadow-[0_0_12px_var(--color-bronze)]">
            03
          </div>
          <div className="mt-2 pixel text-xs tracking-wider text-ink">
            {third.name}
          </div>
          <div className="mt-2 pixel text-base neon-cyan">
            {third.score.toLocaleString("es-ES")}
          </div>
          <div className="mt-1.5 font-mono text-[11px] tracking-wider text-ink-faint">
            {third.date}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="border border-line bg-surface-2">
        <div className="grid grid-cols-[50px_1fr_90px_90px] gap-2.5 border-b border-line px-3 py-3 font-mono pixel text-[10px] tracking-[0.16em] text-ink-faint md:grid-cols-[70px_1fr_1fr_140px] md:px-4.5">
          <div>RANGO</div>
          <div>JUGADOR</div>
          <div>PUNTUACIÓN</div>
          <div>FECHA</div>
        </div>

        {rows.map((r, i) => {
          const isTop1 = i === 0;
          const isTop2 = i === 1;
          const isTop3 = i === 2;

          return (
            <div
              key={`${tab}-${r.name}-${i}`}
              style={{ animationDelay: `${i * 50}ms` }}
              className="grid grid-cols-[50px_1fr_90px_90px] items-center gap-2.5 border-b border-line-2 px-3 py-2.5 font-mono text-xs animate-rise last:border-b-0 md:grid-cols-[70px_1fr_1fr_140px] md:px-4.5 md:text-[13px]"
            >
              <div
                className={cn(
                  "pixel text-[11px]",
                  isTop1 && "text-gold drop-shadow-[0_0_6px_var(--color-gold)]",
                  isTop2 && "text-silver",
                  isTop3 && "text-bronze",
                  !isTop1 && !isTop2 && !isTop3 && "text-ink-dim",
                )}
              >
                #{String(r.rank).padStart(2, "0")}
              </div>
              <div className="text-ink">{r.name}</div>
              <div
                className={cn(
                  "pixel text-xs",
                  isTop1 && "text-gold drop-shadow-[0_0_6px_var(--color-gold)]",
                  isTop2 && "text-silver",
                  isTop3 && "text-bronze",
                  !isTop1 && !isTop2 && !isTop3 && "neon-cyan",
                )}
              >
                {r.score.toLocaleString("es-ES")}
              </div>
              <div className="text-ink-faint">{r.date}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/games"
          className={buttonVariants({ tone: "cyan", size: "lg" })}
        >
          VOLVER A LA BIBLIOTECA
        </Link>
      </div>
    </div>
  );
}
