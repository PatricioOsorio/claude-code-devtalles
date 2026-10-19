import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { GAMES, getGame, seededScores } from "@/lib/data";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return GAMES.map((game) => ({ id: game.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/games/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) return { title: "Juego no encontrado | Arcade Vault" };
  return {
    title: `${game.title} | Arcade Vault`,
    description: game.short,
  };
}

export default async function GameDetailPage({
  params,
}: PageProps<"/games/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) {
    notFound();
  }

  const scores = seededScores(id.length * 17 + 3, 10);

  return (
    <div className="mx-auto my-6 grid max-w-[1320px] grid-cols-1 gap-8 px-4 animate-fade-in md:my-12 md:grid-cols-[1.4fr_1fr] md:px-8">
      {/* Game Detail Left Column */}
      <div>
        <div className="relative aspect-16/10 overflow-hidden border border-line">
          <div className={cn("cover-bg", game.cover)} />
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="border border-line px-2.5 py-1.5 pixel text-[9px] tracking-[0.12em] text-ink-dim">
              {game.cat}
            </span>
            <span className="border border-line px-2.5 py-1.5 pixel text-[9px] tracking-[0.12em] text-ink-dim">
              1 JUGADOR
            </span>
            <span className="border border-line px-2.5 py-1.5 pixel text-[9px] tracking-[0.12em] text-ink-dim">
              TECLADO / TÁCTIL
            </span>
            <span className="border border-line px-2.5 py-1.5 pixel text-[9px] tracking-[0.12em] text-ink-dim">
              RETRO 1985
            </span>
          </div>

          <h2 className="pixel text-2xl tracking-[0.06em] neon-cyan md:text-3xl">
            {game.title}
          </h2>

          <p className="text-sm leading-relaxed text-ink-dim">{game.long}</p>

          <div className="mt-2 grid grid-cols-3 gap-px border border-line bg-line">
            <div className="bg-surface-2 p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                Partidas
              </div>
              <div className="mt-1.5 pixel text-base neon-cyan">
                {game.plays}
              </div>
            </div>
            <div className="bg-surface-2 p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                Mejor global
              </div>
              <div className="mt-1.5 pixel text-base neon-magenta">
                {game.best.toLocaleString("es-ES")}
              </div>
            </div>
            <div className="bg-surface-2 p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                Dificultad
              </div>
              <div className="mt-1.5 pixel text-sm neon-yellow">
                ★ ★ ★ ☆ ☆
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/play/${game.id}`}
              className={cn(buttonVariants({ tone: "cyan", size: "xl" }), "animate-pulse-glow")}
            >
              ▶ JUGAR AHORA
            </Link>
            <Link
              href="/"
              className={buttonVariants({ tone: "ghost", size: "lg" })}
            >
              VOLVER AL VAULT
            </Link>
          </div>
        </div>
      </div>

      {/* Leaderboard Aside */}
      <aside>
        <div className="border border-line bg-surface-2">
          <h3 className="border-b border-line p-3.5 pixel text-[11px] tracking-[0.14em] neon-magenta md:p-4">
            MEJORES PUNTUACIONES
          </h3>
          <div>
            {scores.map((r, i) => {
              const rankStr = `#${String(r.rank).padStart(2, "0")}`;
              const isTop1 = i === 0;
              const isTop2 = i === 1;
              const isTop3 = i === 2;

              return (
                <div
                  key={r.name}
                  className="grid grid-cols-[36px_1fr_110px] items-center gap-2.5 border-b border-line-2 px-4 py-2.5 font-mono text-[13px] last:border-b-0"
                >
                  <div
                    className={cn(
                      "pixel text-[11px]",
                      isTop1 && "text-gold drop-shadow-[0_0_6px_var(--color-gold)]",
                      isTop2 && "text-silver drop-shadow-[0_0_6px_var(--color-silver)]",
                      isTop3 && "text-bronze drop-shadow-[0_0_6px_var(--color-bronze)]",
                      !isTop1 && !isTop2 && !isTop3 && "text-ink-faint",
                    )}
                  >
                    {rankStr}
                  </div>
                  <div className="text-ink">
                    <div>{r.name}</div>
                    <div className="font-mono text-[10px] tracking-[0.1em] text-ink-faint">
                      {r.date}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-right pixel text-xs",
                      isTop1 && "text-gold drop-shadow-[0_0_6px_var(--color-gold)]",
                      isTop2 && "text-silver drop-shadow-[0_0_6px_var(--color-silver)]",
                      isTop3 && "text-bronze drop-shadow-[0_0_6px_var(--color-bronze)]",
                      !isTop1 && !isTop2 && !isTop3 && "text-cyan",
                    )}
                  >
                    {r.score.toLocaleString("es-ES")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
