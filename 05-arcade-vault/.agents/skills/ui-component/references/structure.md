# Structure

## Layout

```
components/
├── ui/            # reusable primitives, cva-driven (button.tsx, chip.tsx, card.tsx)
└── <feature>/     # domain composition (library/, hall-of-fame/, player/)
    └── game-card.tsx
```

Root `components/` (alias `@/components/...`). Created on first component.

## Naming

- **DO**: file `game-card.tsx`, export `GameCard`.
- **DO**: variants const `buttonVariants`, exported only if another file needs it.
- **DON'T**: `index.ts` barrels, `.interfaces.ts`, `.styles.css`, `*.component.tsx`.

## Boundaries

- **DO**: Server Component default. Fetch/data in Server Components or route files. Read `node_modules/next/dist/docs/` before data/caching code (Next 16, `cacheComponents` on).
- **DO**: `"use client"` as first line only when file uses `useState`/`useEffect`/handlers/browser APIs.
- **DO**: Push `"use client"` to the smallest leaf (interactive button), not the whole feature.
- **DON'T**: Pass functions from Server to Client components as props (not serializable) unless Server Action.

## Props typing

- **DO**: types inline in the component file, `type IXProps = ...`. All `interface`/`type` names prefixed `I` (AGENTS.md).
- **DO**: extend native element: `React.ComponentProps<"button">`.
- **DO**: add variants: `& VariantProps<typeof buttonVariants>`.
- **DO**: domain data props typed from the domain type, not `any`.
- **DON'T**: `any`, casts, `// @ts-ignore` to make tsc pass. Fix the type.

## Imports

- **DO**: `@/lib/cn`, `@/components/ui/button`. Alias `@/*` → repo root.
- **DON'T**: deep relative `../../../`.
