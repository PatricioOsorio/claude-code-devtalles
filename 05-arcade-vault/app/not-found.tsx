import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 py-16 text-center animate-fade-in">
      <div className="pixel text-6xl text-magenta text-shadow-neon-magenta md:text-8xl">
        404
      </div>
      <h2 className="mt-4 pixel text-base text-cyan text-shadow-neon-cyan md:text-xl">
        ZONA NO ENCONTRADA
      </h2>
      <p className="mt-2 text-sm text-ink-dim">
        El juego o ruta que buscas no está disponible en el salón.
      </p>
      <Link
        href="/games"
        className={cn(buttonVariants({ tone: "cyan", size: "lg" }), "mt-8")}
      >
        VOLVER AL VAULT
      </Link>
    </div>
  );
}
