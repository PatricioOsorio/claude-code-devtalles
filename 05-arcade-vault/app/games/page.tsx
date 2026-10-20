import { GAMES } from "@/lib/data";
import { LibraryFilters } from "@/components/library/library-filters";

export default function GamesPage() {
  return (
    <div className="animate-fade-in">
      <section className="mx-auto max-w-[1320px] px-4 pt-10 pb-8 text-center md:px-8 md:pt-16">
        <h1 className="hero-title animate-flicker">ARCADE VAULT</h1>
        <div className="mt-4.5 pixel text-[10px] tracking-[0.2em] text-yellow md:text-sm">
          INSERTA UNA MONEDA PARA JUGAR <span className="animate-blink">_</span>
        </div>
      </section>

      <LibraryFilters games={GAMES} />
    </div>
  );
}
