import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface IFinalCtaProps {
  className?: string;
}

export function FinalCta({ className }: IFinalCtaProps) {
  return (
    <section
      className={cn(
        "relative mx-auto max-w-[900px] px-4 py-24 text-center before:absolute before:top-8 before:left-1/2 before:h-px before:w-3/5 before:-translate-x-1/2 before:bg-gradient-to-r before:from-transparent before:via-cyan/50 before:to-transparent after:absolute after:bottom-8 after:left-1/2 after:h-px after:w-3/5 after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-cyan/50 after:to-transparent md:py-32",
        className,
      )}
    >
      <h2 className="final-title">¿LISTO PARA JUGAR?</h2>

      <Link
        href="/games"
        className={cn(
          buttonVariants({ tone: "cyan", size: "xl" }),
          "animate-pulse-glow px-10 py-5 text-sm tracking-[0.2em] sm:px-12 sm:py-6",
        )}
      >
        INSERTAR MONEDA →
      </Link>

      <p className="mt-7 text-xs tracking-[0.06em] text-ink-dim md:text-sm">
        Gratis. Sin registro obligatorio. Empieza en segundos.
      </p>
    </section>
  );
}
