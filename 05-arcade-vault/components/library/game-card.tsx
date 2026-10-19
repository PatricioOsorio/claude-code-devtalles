import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type IGameCardProps = {
  id: string;
  title: string;
  short: string;
  cat: string;
  cover: string;
  tone: "cyan" | "magenta" | "yellow";
  best: number;
  className?: string;
};

export function GameCard({
  id,
  title,
  short,
  cat,
  cover,
  tone,
  best,
  className,
}: IGameCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3.5 border border-line bg-linear-to-b from-surface-2 to-surface-3 p-3.5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1.5 hover:border-cyan hover:shadow-glow-cyan",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden border border-line-2">
        <div className={cn("cover-bg", cover)} />
        <span className="pixel absolute bottom-2 left-2 z-10 border border-line bg-black/60 px-1.5 py-1 text-[8px] text-cyan">
          {cat}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="pixel text-[13px] text-ink">{title}</h3>
        <p className="min-h-9 text-xs text-ink-dim">{short}</p>
        <div className="mt-1 flex items-center justify-between gap-2.5">
          <div className="font-mono flex flex-col text-[10px] uppercase tracking-wider text-ink-faint">
            <span>Mejor puntuación</span>
            <b className="pixel text-xs text-yellow text-shadow-neon-yellow">
              {best.toLocaleString("es-ES")}
            </b>
          </div>
          <Link
            href={`/games/${id}`}
            className={buttonVariants({ tone })}
          >
            Jugar
          </Link>
        </div>
      </div>
    </article>
  );
}
