# Examples

Both files below are real, verified (`tsc`, `eslint`, `next build`, classes present in generated CSS). Read them as the reference; adapt, do not copy blindly.

## 1. `ui/` primitive (cva) → `components/ui/button.tsx`

Ported from prototype `.btn`. Shows: cva axes, tone-per-variant full literals, `@utility` for the notched silhouette (`clip-notch` in `effects.css`), `before:` utilities for the inner border, `buttonVariants` exported because `<Link>` needs button styling (a `<button>` inside `<a>` is invalid HTML).

```tsx
export const buttonVariants = cva("pixel clip-notch relative inline-flex ... before:border-cyan/25 before:[clip-path:inherit] before:content-['']", {
  variants: {
    tone: { cyan: "border-cyan text-ink hover:text-cyan hover:shadow-glow-cyan", /* magenta, yellow, ghost */ },
    size: { md: "px-5 py-3 text-[10px]", lg: "px-7 py-4 text-xs", xl: "px-9 py-5 text-sm tracking-[0.2em]" },
  },
  defaultVariants: { tone: "cyan", size: "md" },
});

type IButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ tone, size, className, ...props }: IButtonProps) {
  return <button className={cn(buttonVariants({ tone, size }), className)} {...props} />;
}
```

Why `tone`, not `color`: `color` collides with the native HTML attribute type. Use `tone`.

## 2. Feature composition → `components/library/game-card.tsx`

Ported from prototype `Card` in `biblioteca.jsx`. Server Component. Shows: props from domain data, cover art, token utilities, `buttonVariants` on `Link`.

Key points:

- Cover art classes are **not** per game slug. Data carries `cover: "cover-bricks"`; markup is `<div className={cn("cover-bg", cover)} />` inside a `relative` box (`.cover-bg` is `position:absolute; inset:0`). Defined in `covers.css`, not Tailwind-generated, so dynamic class is safe.
- Tailwind utilities stay literal: `bg-linear-to-b from-surface-2 to-surface-3`, `aspect-4/3`, `text-shadow-neon-yellow`.
- Card is `<article>`; action is `<Link className={buttonVariants({ tone })}>`. Never `<Link><Button/></Link>`.
- Prototype pointer-tilt (`onMouseMove` + inline transform) skipped on purpose: needs `"use client"` + ref. Hover lift via `hover:-translate-y-1.5` keeps card a Server Component. Add tilt only if requested, as a client wrapper leaf.

## 3. Client leaf (pattern)

Isolate interactivity; parent stays server.

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function Chip({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive((v) => !v)}
      className={cn(
        "pixel border border-ink-faint px-3 py-2 text-[10px] text-ink-dim hover:text-ink",
        active && "border-magenta text-magenta",
      )}
    >
      {children}
    </button>
  );
}
```
