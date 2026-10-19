"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export interface IAuthCardProps {
  className?: string;
}

export function AuthCard({ className }: IAuthCardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  const handleGuest = () => {
    router.push("/");
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[440px] border border-line bg-surface-2 p-7 shadow-[0_0_30px_color-mix(in_oklab,var(--color-cyan)_18%,transparent)] before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-cyan/20",
        className,
      )}
    >
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 h-14 w-14 border border-white/20 shadow-[0_0_16px_color-mix(in_oklab,var(--color-cyan)_55%,transparent),inset_0_0_8px_color-mix(in_oklab,var(--color-magenta)_50%,transparent)] [background:linear-gradient(45deg,var(--color-magenta)_0_50%,transparent_50%),linear-gradient(-45deg,var(--color-cyan)_0_50%,transparent_50%)] [background-blend-mode:screen]" />
        <h2 className="pixel text-base tracking-[0.1em] neon-cyan">ARCADE VAULT</h2>
        <div className="mt-1.5 font-mono text-[11px] tracking-[0.16em] text-ink-faint">
          ACCESO AL SISTEMA · v2.6
        </div>
      </div>

      <div className="my-4.5 grid grid-cols-2 border border-line">
        <button
          type="button"
          onClick={() => setTab("in")}
          className={cn(
            "cursor-pointer p-3 pixel text-[9px] tracking-[0.14em] transition-colors",
            tab === "in"
              ? "bg-cyan/10 neon-cyan"
              : "bg-transparent text-ink-dim hover:text-ink",
          )}
        >
          INICIAR SESIÓN
        </button>
        <button
          type="button"
          onClick={() => setTab("up")}
          className={cn(
            "cursor-pointer p-3 pixel text-[9px] tracking-[0.14em] transition-colors",
            tab === "up"
              ? "bg-cyan/10 neon-cyan"
              : "bg-transparent text-ink-dim hover:text-ink",
          )}
        >
          CREAR CUENTA
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="auth-user"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
          >
            Usuario
          </label>
          <Input
            id="auth-user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="px_kai"
          />
        </div>

        {tab === "up" && (
          <div className="flex flex-col gap-1.5 animate-slide-in">
            <label
              htmlFor="auth-email"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
            >
              Correo electrónico
            </label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jugador@vault.gg"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="auth-pass"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
          >
            Contraseña
          </label>
          <Input
            id="auth-pass"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className={cn(buttonVariants({ tone: "cyan", size: "lg" }), "mt-2 w-full")}
        >
          {tab === "in" ? "ENTRAR AL VAULT" : "CREAR Y JUGAR"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGuest}
        className={cn(buttonVariants({ tone: "ghost", size: "md" }), "mt-2.5 w-full")}
      >
        JUGAR COMO INVITADO
      </button>

      <div className="my-4 flex items-center gap-3 pixel text-[8px] tracking-[0.16em] text-ink-faint before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
        O CONTINÚA CON
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          className={buttonVariants({ tone: "ghost", size: "md" })}
        >
          ◆ GOOGLE
        </button>
        <button
          type="button"
          className={buttonVariants({ tone: "ghost", size: "md" })}
        >
          ▣ GITHUB
        </button>
      </div>

      <div className="mt-4.5 text-center font-mono text-[11px] tracking-[0.1em] text-ink-faint">
        AL ENTRAR ACEPTAS LOS TÉRMINOS DEL SALÓN ARCADE
      </div>
    </div>
  );
}
