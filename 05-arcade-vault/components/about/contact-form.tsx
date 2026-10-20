"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { sendContact, type IContactState } from "@/app/about/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export interface IContactFormProps {
  className?: string;
}

const INITIAL_STATE: IContactState = { status: "idle" };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ className }: IContactFormProps) {
  const [state, formAction, isPending] = useActionState(sendContact, INITIAL_STATE);
  const [, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerShake = () => {
    setIsShaking(true);
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false);
    }, 400);
  };

  useEffect(() => {
    if (state.status === "error") {
      const timeout = setTimeout(() => {
        setIsShaking(true);
      }, 0);
      const clearShake = setTimeout(() => {
        setIsShaking(false);
      }, 400);
      return () => {
        clearTimeout(timeout);
        clearTimeout(clearShake);
      };
    }
  }, [state]);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!name.trim() || !email.trim() || !message.trim() || !EMAIL_REGEX.test(email.trim())) {
      e.preventDefault();
      triggerShake();
      return;
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    startTransition(() => {
      formAction(new FormData());
    });
  };

  return (
    <div
      className={cn(
        "relative border border-line bg-surface-2 p-7 transition-transform duration-80 before:pointer-events-none before:absolute before:inset-1 before:border before:border-dashed before:border-cyan/15",
        isShaking && "animate-shake",
        className,
      )}
    >
      {state.status !== "sent" ? (
        <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className="pixel text-[9px] tracking-[0.14em] text-ink-dim">
              NOMBRE
            </label>
            <Input
              id="contact-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="px_kai"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className="pixel text-[9px] tracking-[0.14em] text-ink-dim">
              CORREO ELECTRÓNICO
            </label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jugador@vault.gg"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className="pixel text-[9px] tracking-[0.14em] text-ink-dim">
              MENSAJE
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntanos qué tienes en mente…"
              disabled={isPending}
              className="w-full resize-y border border-line bg-surface p-3 font-mono text-sm text-ink outline-none transition-[border-color,box-shadow] duration-140 placeholder:text-ink-faint focus:border-cyan focus:shadow-focus disabled:pointer-events-none disabled:opacity-50"
            />
          </div>

          {state.status === "error" && (
            <p className="pixel text-[9px] tracking-[0.12em] text-magenta">
              [ERROR] No se pudo enviar el mensaje. Revisa los datos o inténtalo más tarde.
            </p>
          )}

          <Button
            type="submit"
            size="xl"
            tone="cyan"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "ENVIANDO…" : "▶  ENVIAR MENSAJE"}
          </Button>
        </form>
      ) : (
        <div className="overflow-hidden border border-green bg-black font-mono shadow-[0_0_22px_rgba(0,255,136,0.25)]">
          <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 pixel text-[9px] tracking-[0.14em] text-ink-faint">
              VAULT-OS // TERMINAL
            </span>
          </div>

          <div className="p-4 sm:p-5 text-[13px] leading-[1.8]">
            <div className="text-green">
              <span className="mr-2 text-cyan">vault@arcade:~$</span> ./send_message --to=team
            </div>
            <div className="text-ink-dim">[OK] Conectando con servidor…</div>
            <div className="text-ink-dim">[OK] Validando contenido…</div>
            <div className="text-ink-dim">[OK] Transmitiendo paquete…</div>
            <div className="mt-3 whitespace-pre-wrap font-bold text-green drop-shadow-[0_0_6px_rgba(0,255,136,0.45)]">
              &gt; MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, {(state.name ?? name).toUpperCase()}.
              <span className="animate-blink">_</span>
            </div>

            <div className="mt-4 pt-1">
              <Button type="button" tone="ghost" size="md" onClick={handleReset}>
                ENVIAR OTRO MENSAJE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
