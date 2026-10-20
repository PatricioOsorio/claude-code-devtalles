import { cn } from "@/lib/cn";
import type { ITone } from "@/lib/data";

export interface ISectionHeadProps {
  kicker: string;
  title: string;
  tone?: ITone;
  className?: string;
}

export function SectionHead({
  kicker,
  title,
  tone = "magenta",
  className,
}: ISectionHeadProps) {
  const toneClasses: Record<ITone, string> = {
    cyan: "neon-cyan",
    magenta: "neon-magenta",
    yellow: "neon-yellow",
    green: "neon-green",
  };

  return (
    <div className={cn("mb-9 flex items-center gap-4", className)}>
      <div className={cn("pixel text-[11px] tracking-[0.22em]", toneClasses[tone])}>
        {kicker}
      </div>
      <h2 className="pixel text-lg tracking-[0.06em] text-ink sm:text-xl md:text-2xl">
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
    </div>
  );
}
