---
name: ui-component
description: >
  Create or restyle React components for Arcade Vault (Next.js 16, React 19, Tailwind v4,
  cva, cn). Covers file placement (`components/ui/` primitives vs `components/<feature>/`),
  props typing, cva variants, token usage from `app/styles/theme.css`, and porting the
  read-only prototype in `references/templates/*.jsx` + `styles.css` to Tailwind utilities.
  Use whenever user asks to create, add, scaffold, port, style, restyle, or extract a
  component, button, card, chip, nav, modal, form, section, or UI piece. Also trigger on
  "crear componente", "nuevo componente", "portar del template", "estilos del componente",
  "extraer a ui", even if user does not name this skill. Aesthetic direction → `/frontend-design`.
---

# ui-component

Component + style = one file. No per-component CSS. Utilities inline, variants via `cva`, merge via `cn`.

## Core rules

- **DO**: `components/ui/<name>.tsx` for reusable primitives (cva). `components/<feature>/<name>.tsx` for domain composition.
- **DO**: kebab-case filenames, PascalCase named exports. One component per file. No barrels.
- **DO**: Server Component default. `"use client"` only for state, effects, handlers, browser APIs.
- **DO**: Name props type `I<Name>Props` (all types/interfaces prefixed `I`). Props = `React.ComponentProps<"el">` (+ `VariantProps<typeof xVariants>`). `ref` is a plain prop in React 19.
- **DO**: `className` merged last: `cn(variants({ ... }), className)` from `@/lib/cn`.
- **DO**: Tokens only (`bg-surface-2`, `text-ink-dim`, `border-line`, `shadow-glow-cyan`, `text-shadow-neon-magenta`, `animate-pulse-glow`). Missing token → add to `app/styles/theme.css` first, then use generated utility.
- **DO**: Mobile-first (`md:` up). Prototype CSS is desktop-first (`max-width`); invert when porting.
- **DO**: Colors per variant as full literal class strings in cva (Tailwind scans statically).
- **DO**: Image → `next/image`. Link → `next/link`. Font → already bound in `app/layout.tsx`.
- **DON'T**: BEM, `.btn--primary`, global `.av-*` classes, per-component `.css`.
- **DON'T**: `@apply` (ask first), `dark:` variants (dark-only app), raw hex/rgba.
- **DON'T**: `memo`, `forwardRef`, `React.FC`, `enum`, `defaultProps`, default exports (except Next route files).
- **DON'T**: Build class strings dynamically (`` `text-${c}` ``). Lookup map of full strings.
- **DON'T**: Repeat same arbitrary value (`text-[9px]`) more than twice. Tokenize.
- **DON'T**: Extract to `ui/` on first use. 1st use inline, 3rd use extract.
- **DON'T**: Create test files. No runner configured.

## Where style goes

| Need | Where |
|---|---|
| Plain layout, color, spacing, state (`hover:`, `md:`) | Utilities inline |
| Variants/sizes of a reused element | `cva` in component file |
| Single-purpose style needing variants Tailwind lacks | `@utility` in `app/styles/effects.css` (e.g. `pixel`) |
| Pseudo-elements, masks, stacked gradients, multi-element | `@layer components` in `effects.css` |
| Game cover art | `app/styles/covers.css` (`.cover-{slug}`) |
| New color/shadow/animation/font | `app/styles/theme.css` `@theme` |

## References (read when needed)

- `references/structure.md` — folders, naming, client/server boundary, props typing.
- `references/styling.md` — token catalog pointers, cva rules, prototype → Tailwind porting table, `tailwind-merge` caveat.
- `references/examples.md` — two templates: `ui/` cva primitive, feature composition.

## Process

1. Clarify only if blocking: name, primitive vs feature, needs state? Else assume and state assumption.
2. Check `components/ui/` for existing primitive. Reuse > create.
3. Porting from prototype: read matching `references/templates/*.jsx` + its rules in `references/templates/styles.css` (read-only). Map via `references/styling.md`.
4. Read `app/styles/theme.css` for tokens. Missing → add token first.
5. Write component. Aesthetic doubts → `/frontend-design`.
6. Run `bun run lint` and `bunx tsc --noEmit`. Show result.

## Checklist

- [ ] Path + filename per `structure.md`; named export; no barrel.
- [ ] `"use client"` only if needed.
- [ ] Props from `React.ComponentProps` (+ `VariantProps`); no `React.FC`.
- [ ] `className` last in `cn()`.
- [ ] Zero hex/rgba, zero `dark:`, zero `@apply`, zero BEM.
- [ ] Every color/shadow/animation is a token utility.
- [ ] Mobile-first breakpoints.
- [ ] cva class strings are full literals.
- [ ] lint + tsc pass.
