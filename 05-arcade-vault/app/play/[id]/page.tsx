import { notFound } from "next/navigation";
import { PlayerShell } from "@/components/play/player-shell";
import { GAMES, getGame } from "@/lib/data";

export function generateStaticParams() {
  return GAMES.map((game) => ({ id: game.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/play/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) return { title: "Juego no encontrado | Arcade Vault" };
  return {
    title: `${game.title} - En Juego | Arcade Vault`,
    description: `Jugando a ${game.title} en Arcade Vault.`,
  };
}

export default async function PlayGamePage({
  params,
}: PageProps<"/play/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) {
    notFound();
  }

  return (
    <div className="py-6 md:py-8">
      <PlayerShell game={game} />
    </div>
  );
}
