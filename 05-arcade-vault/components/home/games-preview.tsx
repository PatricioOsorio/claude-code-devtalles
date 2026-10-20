import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { GAMES, type IGame } from "@/lib/data";
import { SectionHead } from "./section-head";

export interface IGamesPreviewProps {
  className?: string;
}

function MiniCard({ game }: { game: IGame }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex flex-col border border-line bg-surface-2 transition-[transform,border-color] duration-180 hover:-translate-y-1 hover:border-cyan"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className={cn("cover-bg", game.cover)} />
      </div>
      <div className="p-2.5 sm:p-3">
        <div className="pixel text-[10px] tracking-[0.06em] text-ink group-hover:text-cyan">
          {game.title}
        </div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.14em] text-ink-faint">
          {game.cat}
        </div>
      </div>
    </Link>
  );
}

export function GamesPreview({ className }: IGamesPreviewProps) {
  const previewGames = GAMES.slice(0, 9);

  return (
    <section
      className={cn("mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-20", className)}
    >
      <SectionHead kicker="// 02" title="JUEGOS DISPONIBLES AHORA" tone="cyan" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {previewGames.map((g) => (
          <MiniCard key={g.id} game={g} />
        ))}
      </div>

      <div className="mt-8 text-center md:mt-10">
        <Link
          href="/games"
          className={buttonVariants({ tone: "cyan", size: "lg" })}
        >
          VER TODOS LOS JUEGOS →
        </Link>
      </div>
    </section>
  );
}
