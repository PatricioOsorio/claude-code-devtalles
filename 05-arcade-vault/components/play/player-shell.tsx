"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IGame } from "@/lib/data";
import { cn } from "@/lib/cn";

export interface IPlayerShellProps {
  game: IGame;
  className?: string;
}

export function PlayerShell({ game, className }: IPlayerShellProps) {
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [initials, setInitials] = useState("INVITADO");
  const [saved, setSaved] = useState(false);

  const restart = () => {
    setPaused(false);
    setOver(false);
    setSaved(false);
  };

  return (
    <div className={cn("mx-auto max-w-[1100px] px-4 pb-16 animate-fade-in md:px-6", className)}>
      {/* Player HUD */}
      <div className="mb-4.5 flex flex-wrap items-center justify-between gap-4 border border-line bg-surface-2 p-3.5 md:p-4.5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              Jugador
            </span>
            <span className="pixel text-sm text-ink">{initials}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              Puntuación
            </span>
            <span className="pixel text-base neon-cyan">0</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              Vidas
            </span>
            <span className="pixel text-base neon-magenta">♥ ♥ ♥</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              Nivel
            </span>
            <span className="pixel text-base neon-cyan">01</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className={buttonVariants({ tone: "yellow", size: "md" })}
          >
            {paused ? "REANUDAR" : "PAUSA"}
          </button>
          <button
            type="button"
            onClick={() => setOver(true)}
            className={buttonVariants({ tone: "magenta", size: "md" })}
          >
            FIN
          </button>
          <Link
            href={`/games/${game.id}`}
            className={buttonVariants({ tone: "ghost", size: "md" })}
          >
            SALIR
          </Link>
        </div>
      </div>

      {/* CRT Display */}
      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena">
            <div className="grid-floor" />
            <div className="enemy e1" />
            <div className="enemy e2" />
            <div className="enemy e3" />
            <div className="player-ship" />
          </div>

          {/* Pause overlay */}
          {paused && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-center">
              <div>
                <div className="pixel text-xl neon-yellow md:text-2xl">
                  EN PAUSA
                </div>
                <div className="mt-2.5 font-mono text-[11px] tracking-[0.16em] text-ink-dim">
                  PULSA REANUDAR PARA CONTINUAR
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CRT Bottom Bezel info bar */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 px-2 pixel text-[8px] tracking-[0.16em] text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_6px_var(--color-green)]" />
            SEÑAL OK
          </span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>CARGA · 1MB</span>
        </div>
      </div>

      {/* Game Over Modal */}
      {over && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-[min(480px,96vw)] border border-magenta bg-surface-2 p-8 text-center shadow-[0_0_30px_color-mix(in_oklab,var(--color-magenta)_40%,transparent),inset_0_0_16px_color-mix(in_oklab,var(--color-magenta)_18%,transparent)] before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-magenta/40">
            <h2 className="mb-4 pixel text-xl tracking-[0.12em] neon-magenta md:text-2xl">
              FIN DEL JUEGO
            </h2>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              PUNTUACIÓN FINAL
            </div>
            <div className="my-4 pixel text-4xl neon-yellow md:text-5xl">
              0
            </div>

            {!saved ? (
              <div className="my-5 flex flex-col gap-2 sm:flex-row">
                <Input
                  type="text"
                  value={initials}
                  onChange={(e) =>
                    setInitials(e.target.value.toUpperCase().slice(0, 10))
                  }
                  placeholder="TUS INICIALES"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setSaved(true)}
                  className={buttonVariants({ tone: "yellow", size: "md" })}
                >
                  GUARDAR PUNTUACIÓN
                </button>
              </div>
            ) : (
              <div className="my-5 inline-block overflow-hidden whitespace-nowrap border-r-2 border-green pixel text-xs neon-green animate-typewriter">
                ▸ PUNTUACIÓN GUARDADA_
              </div>
            )}

            <div className="mt-4.5 flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={restart}
                className={buttonVariants({ tone: "cyan", size: "md" })}
              >
                JUGAR DE NUEVO
              </button>
              <Link
                href="/"
                className={buttonVariants({ tone: "magenta", size: "md" })}
              >
                VOLVER AL VAULT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
