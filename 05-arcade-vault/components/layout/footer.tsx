import { cn } from "@/lib/cn";

export interface IFooterProps {
  className?: string;
}

export function Footer({ className }: IFooterProps) {
  return (
    <footer
      className={cn(
        "relative z-10 border-t border-line px-4 py-5 text-center font-mono text-[11px] tracking-[0.16em] text-ink-faint md:px-8",
        className,
      )}
    >
      © 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0
    </footer>
  );
}
