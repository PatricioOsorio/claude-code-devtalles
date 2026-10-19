"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/library/game-card";
import { CATS, type ICategory, type IGame } from "@/lib/data";
import { cn } from "@/lib/cn";

export interface ILibraryFiltersProps {
  games: IGame[];
  className?: string;
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function LibraryFilters({ games, className }: ILibraryFiltersProps) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ICategory>("TODOS");

  const filtered = useMemo(() => {
    const query = normalize(q.trim());
    return games.filter((g) => {
      const matchesCat = cat === "TODOS" || g.cat === cat;
      const matchesQuery = !query || normalize(g.title).includes(query);
      return matchesCat && matchesQuery;
    });
  }, [games, q, cat]);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Search & category filters */}
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center gap-3 px-4 md:px-8">
        <div className="relative flex h-12 min-w-[220px] flex-1 items-center gap-2.5 border border-line bg-surface-2 px-4 transition-colors focus-within:border-cyan focus-within:shadow-focus">
          <span className="pixel text-[11px] text-cyan">⌕</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar un juego por nombre…"
            className="w-full border-0 bg-transparent font-mono text-xs tracking-wide text-ink outline-none placeholder:text-ink-faint md:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => {
            const isActive = cat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  "cursor-pointer border px-3.5 py-3 pixel text-[9px] tracking-[0.12em] transition-colors duration-150",
                  isActive
                    ? "border-magenta bg-surface-2 text-magenta shadow-[0_0_10px_color-mix(in_oklab,var(--color-magenta)_35%,transparent)]"
                    : "border-line bg-surface-2 text-ink-dim hover:border-ink-dim hover:text-ink",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of games */}
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5.5 px-4 pb-20 md:px-8">
        {filtered.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            short={game.short}
            cat={game.cat}
            cover={game.cover}
            tone={game.tone}
            best={game.best}
          />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-ink-faint">
            <div className="mb-3 pixel text-sm neon-magenta">
              NO HAY RESULTADOS
            </div>
            <p className="text-sm">Intenta otra búsqueda o categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
