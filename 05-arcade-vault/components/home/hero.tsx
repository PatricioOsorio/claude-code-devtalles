import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { FloatingSilhouettes } from "./silhouettes";

export interface IHeroProps {
  className?: string;
}

export function Hero({ className }: IHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100vh-60px)] items-center justify-center overflow-hidden px-4 py-20 md:px-8 md:py-24",
        className,
      )}
    >
      <FloatingSilhouettes />

      <div className="relative z-3 mx-auto max-w-[1100px] text-center">
        <div className="mb-6 pixel text-[11px] tracking-[0.24em] neon-yellow">
          ▸ INSERTA UNA MONEDA<span className="animate-blink">_</span>
        </div>

        <h1 className="home-title">
          <span className="home-title-line-1">EL ARCADE</span>
          <span className="home-title-line-2">CLÁSICO ESTÁ</span>
          <span className="home-title-line-3">DE VUELTA</span>
        </h1>

        <p className="mx-auto my-7 max-w-[640px] text-sm leading-[1.7] tracking-[0.04em] text-ink-dim md:my-9 md:text-[15px]">
          Juega los mejores clásicos directamente en tu navegador.
          <br className="hidden sm:inline" /> Sin descargas. Sin costo. Solo
          diversión.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/games"
            className={cn(
              buttonVariants({ tone: "cyan", size: "xl" }),
              "animate-pulse-glow",
            )}
          >
            ▶ EXPLORAR JUEGOS
          </Link>
          <Link
            href="/auth"
            className={buttonVariants({ tone: "magenta", size: "xl" })}
          >
            ✦ CREAR CUENTA
          </Link>
        </div>

        <div
          className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pixel text-[9px] tracking-[0.2em] text-ink-faint md:bottom-6"
          aria-hidden="true"
        >
          <span>DESLIZA</span>
          <span className="animate-bounce-subtle text-cyan">▼</span>
        </div>
      </div>
    </section>
  );
}
