"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface INavProps {
  className?: string;
}

export function Nav({ className }: INavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isInicioActive = pathname === "/";
  const isBibliotecaActive =
    pathname.startsWith("/games") || pathname.startsWith("/play");
  const isSalonActive = pathname.startsWith("/hall-of-fame");
  const isAboutActive = pathname.startsWith("/about");
  const isAuthActive = pathname.startsWith("/auth");

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-40 flex items-center gap-6 border-b border-line bg-surface/90 px-4 py-3.5 backdrop-blur-md md:px-8",
          className,
        )}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="logo-mark shrink-0" />
          <span className="pixel text-xs tracking-[0.12em] neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </span>
        </Link>

        <div className="ml-8 hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className={cn(
              "relative px-3.5 py-2.5 pixel text-[9px] tracking-[0.16em] transition-colors",
              isInicioActive
                ? "neon-cyan after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-cyan after:shadow-[0_0_8px_var(--color-cyan),0_0_16px_var(--color-cyan)]"
                : "text-ink-dim hover:text-ink",
            )}
          >
            Inicio
          </Link>
          <Link
            href="/games"
            className={cn(
              "relative px-3.5 py-2.5 pixel text-[9px] tracking-[0.16em] transition-colors",
              isBibliotecaActive
                ? "neon-cyan after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-cyan after:shadow-[0_0_8px_var(--color-cyan),0_0_16px_var(--color-cyan)]"
                : "text-ink-dim hover:text-ink",
            )}
          >
            Biblioteca
          </Link>
          <Link
            href="/hall-of-fame"
            className={cn(
              "relative px-3.5 py-2.5 pixel text-[9px] tracking-[0.16em] transition-colors",
              isSalonActive
                ? "neon-cyan after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-cyan after:shadow-[0_0_8px_var(--color-cyan),0_0_16px_var(--color-cyan)]"
                : "text-ink-dim hover:text-ink",
            )}
          >
            Salón de la Fama
          </Link>
          <Link
            href="/about"
            className={cn(
              "relative px-3.5 py-2.5 pixel text-[9px] tracking-[0.16em] transition-colors",
              isAboutActive
                ? "neon-cyan after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-cyan after:shadow-[0_0_8px_var(--color-cyan),0_0_16px_var(--color-cyan)]"
                : "text-ink-dim hover:text-ink",
            )}
          >
            Acerca de
          </Link>
        </div>

        <div className="flex-1" />

        <div className="hidden items-center gap-2 pixel text-[9px] text-yellow md:flex">
          <span className="coin-badge" />
          <span>CRÉDITOS · 03</span>
        </div>

        <Link
          href="/auth"
          className={cn(
            buttonVariants({ tone: "cyan", size: "md" }),
            "ml-4 hidden md:inline-flex",
          )}
        >
          Iniciar Sesión
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú de navegación"
          className={cn(
            buttonVariants({ tone: "ghost", size: "md" }),
            "px-3 py-2 md:hidden",
          )}
        >
          ≡
        </button>
      </nav>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 transition-opacity duration-200 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(320px,86vw)] flex-col gap-2 border-l border-line bg-surface-2 p-6 transition-transform duration-200 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Menú móvil"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="pixel text-[11px] neon-cyan">MENÚ</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="pixel text-xs text-ink-dim hover:text-ink"
          >
            ✕
          </button>
        </div>

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={cn(
            "border-b border-dashed border-line-2 p-3.5 pixel text-[11px] transition-colors",
            isInicioActive ? "neon-cyan" : "text-ink-dim hover:text-ink",
          )}
        >
          Inicio
        </Link>
        <Link
          href="/games"
          onClick={() => setOpen(false)}
          className={cn(
            "border-b border-dashed border-line-2 p-3.5 pixel text-[11px] transition-colors",
            isBibliotecaActive ? "neon-cyan" : "text-ink-dim hover:text-ink",
          )}
        >
          Biblioteca
        </Link>
        <Link
          href="/hall-of-fame"
          onClick={() => setOpen(false)}
          className={cn(
            "border-b border-dashed border-line-2 p-3.5 pixel text-[11px] transition-colors",
            isSalonActive ? "neon-cyan" : "text-ink-dim hover:text-ink",
          )}
        >
          Salón de la Fama
        </Link>
        <Link
          href="/about"
          onClick={() => setOpen(false)}
          className={cn(
            "border-b border-dashed border-line-2 p-3.5 pixel text-[11px] transition-colors",
            isAboutActive ? "neon-cyan" : "text-ink-dim hover:text-ink",
          )}
        >
          Acerca de
        </Link>
        <Link
          href="/auth"
          onClick={() => setOpen(false)}
          className={cn(
            "border-b border-dashed border-line-2 p-3.5 pixel text-[11px] transition-colors",
            isAuthActive ? "neon-cyan" : "text-ink-dim hover:text-ink",
          )}
        >
          Iniciar Sesión
        </Link>

        <div className="flex-1" />

        <div className="pixel text-[9px] tracking-[0.16em] text-ink-faint">
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
