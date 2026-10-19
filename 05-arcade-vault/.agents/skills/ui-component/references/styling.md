# Styling

## Token source

Single truth: `app/styles/theme.css` (`@theme`). Read it before styling; never guess names.

Generated utilities seen today:

- Colors: `surface`, `surface-2`, `surface-3`, `ink`, `ink-dim`, `ink-faint`, `cyan`, `magenta`, `yellow`, `green`, `gold`, `silver`, `bronze`, `line`, `line-2` → `bg-*`, `text-*`, `border-*`.
- Shadows: `shadow-glow-cyan|magenta|yellow`, `shadow-focus`.
- Text shadow: `text-shadow-neon-cyan|magenta|yellow|green`.
- Animations: `animate-gridscroll|flicker|blink|pulse-glow|bob|drift|spinpix|typewriter|rise|fade-in|slide-in`.
- Utilities in `effects.css`: `pixel` (pixel font, uppercase, tracking), `clip-notch` (chamfered corners).
- Alpha on theme colors: `border-cyan/25`, `bg-black/60` (v4 uses `color-mix`; no raw rgba).
- Gradients: `bg-linear-to-b from-surface-2 to-surface-3` (v4 name; not `bg-gradient-to-b`).
- Aspect: `aspect-4/3`.

Raw CSS (only in `effects.css`/`covers.css`): `var(--color-*)`, alpha via `color-mix(in oklab, var(--color-x) N%, transparent)`.

## cva rules

- **DO**: `base` string = structure + shared states. `variants` = one axis each (`color`, `size`, `tone`). `defaultVariants` always set.
- **DO**: full literal class strings per variant value.
- **DO**: `compoundVariants` only for real cross-axis combos.
- **DON'T**: boolean props that duplicate a variant axis.
- **DON'T**: cva for one-off elements. Inline utilities.

## tailwind-merge caveat

`twMerge` does not know custom tokens (`shadow-glow-*`, `text-shadow-neon-*`) conflict with built-in `shadow-*`. First real conflict → add `extendTailwindMerge` to `lib/cn.ts`. Not before.

## Porting prototype → Tailwind

Source: `references/templates/styles.css` + `*.jsx`. Read-only spec.

| Prototype | Tailwind v4 |
|---|---|
| `.btn`, `.chip`, `.card` | cva primitive in `components/ui/` (once used 3×), else inline |
| `.btn.magenta`, `.btn.lg` | cva variants `color: magenta`, `size: lg` |
| `var(--cyan)` | `cyan` token utilities |
| `box-shadow: 0 0 14px rgba(...)` | `shadow-glow-*` |
| `.neon-cyan` text glow | `text-cyan text-shadow-neon-cyan` |
| `.active` class toggle | `data-[active=true]:` or conditional `cn()` |
| `:hover:not(.active)` | `hover:` + conditional class |
| `@media (max-width: X)` overrides | base = mobile, add `md:`/`lg:` up |
| `::before` / `::after` decoration | `before:` utilities if one simple box (e.g. inner border). Else `@layer components` in `effects.css` |
| `clip-path` reused on 2+ elements | `@utility` in `effects.css` |
| `.cover-bg` + `.cover-*` art | already in `covers.css`; reuse as-is, parent must be `relative` |
| `animation: pulse 1.6s ...` | `animate-pulse-glow` |
| Hex/rgba literal | find or add token |

## Don'ts

- **DON'T**: edit `references/templates/*`.
- **DON'T**: port `av-*` class names. Port the look, not the selector.
- **DON'T**: leave a template-only value as arbitrary (`p-[17px]`). Round to scale or tokenize.
