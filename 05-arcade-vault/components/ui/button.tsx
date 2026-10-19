import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "pixel clip-notch relative inline-flex cursor-pointer items-center justify-center gap-2.5 border bg-transparent tracking-[0.16em] transition-[transform,box-shadow,color] duration-150 before:pointer-events-none before:absolute before:inset-[3px] before:border before:border-cyan/25 before:[clip-path:inherit] before:content-[''] active:translate-y-px active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        cyan: "border-cyan text-ink hover:text-cyan hover:shadow-glow-cyan before:border-cyan/25",
        magenta: "border-magenta text-ink hover:text-magenta hover:shadow-glow-magenta before:border-magenta/25",
        yellow: "border-yellow text-ink hover:text-yellow hover:shadow-glow-yellow before:border-yellow/25",
        green: "border-green text-ink hover:text-green hover:shadow-glow-green before:border-green/25",
        ghost: "border-ink-faint text-ink-dim hover:border-ink-dim hover:text-ink before:border-ink-faint/25",
      },
      size: {
        md: "px-5 py-3 text-[10px]",
        lg: "px-7 py-4 text-xs",
        xl: "px-9 py-5 text-sm tracking-[0.2em]",
      },
    },
    defaultVariants: { tone: "cyan", size: "md" },
  },
);

type IButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ tone, size, className, ...props }: IButtonProps) {
  return (
    <button className={cn(buttonVariants({ tone, size }), className)} {...props} />
  );
}
