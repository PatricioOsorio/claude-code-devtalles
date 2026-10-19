import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const inputVariants = cva(
  "h-11 w-full border border-line bg-surface px-3 font-mono text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-cyan focus:shadow-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {},
    defaultVariants: {},
  },
);

export type IInputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>;

export function Input({ className, type = "text", ...props }: IInputProps) {
  return (
    <input
      type={type}
      className={cn(inputVariants(), className)}
      {...props}
    />
  );
}
