import { cn } from "@/lib/cn";

export interface IAboutDividerProps {
  className?: string;
}

export function AboutDivider({ className }: IAboutDividerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[1200px] items-center gap-4 px-6 py-12 md:px-8 md:py-16",
        className,
      )}
      aria-hidden="true"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-magenta to-transparent" />
      <div className="flex gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 80}ms` }}
            className={cn(
              "h-1.5 w-1.5 animate-pxblink",
              (i + 1) % 5 === 0
                ? "bg-yellow shadow-[0_0_6px_var(--color-yellow)]"
                : (i + 1) % 3 === 0
                  ? "bg-magenta shadow-[0_0_6px_var(--color-magenta)]"
                  : "bg-cyan shadow-[0_0_6px_var(--color-cyan)]",
            )}
          />
        ))}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-magenta to-transparent" />
    </div>
  );
}
