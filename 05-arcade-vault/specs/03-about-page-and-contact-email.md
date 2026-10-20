# SPEC 03 — About page and contact email via Resend

> **Status:** Implemented
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-10-20
> **Objective:** Replace the `/about` placeholder with the full About + Contact page ported from `references/templates/home-about/about.jsx`, and send the contact form through Resend using env vars read from a single `lib/env.ts`.

## Why this spec exists

SPEC 02 left `/about` as "EN CONSTRUCCIÓN" and deferred mission, highlights, divider and contact form. This spec lands them and adds the first server-side integration, so it also fixes the convention for environment variables: one file is the source of truth and nothing else reads `process.env`.

## Scope

**In:**

- `/about` ported from `about.jsx`: hero (kicker, title, mission, 3 highlights with pixel icons), animated pixel divider, contact section (intro, 3 tips, form).
- Contact form: name, email, message. Client-side `shake` on invalid submit. Terminal-style success panel with `ENVIAR OTRO MENSAJE` reset. Matches prototype copy.
- Server Action `sendContact` in `app/about/actions.ts`: validates input, sends the email with Resend, returns a typed result.
- `lib/env.ts`: only file allowed to read `process.env`. Exports a typed, validated `env` object.
- `.env` (gitignored, empty values for the user to fill) and `.env.example` (committed template).
- `.gitignore` exception `!.env.example`.
- New dependency: `resend`.
- ESLint `no-process-env` rule, with `lib/env.ts` as the only exception.
- Components built with `/ui-component`: Tailwind v4 tokens, cva, `cn`, mobile-first. Reuse `Input`, `Button`, `Reveal`.
- Missing tokens/effects (shake, caret blink, divider pixel pulse, tip LED) go to `theme.css`/`effects.css` first.

**Out of scope (for future specs):**

- Rate limiting, captcha or honeypot against spam.
- Verified sending domain. `onboarding@resend.dev` is the dev sender; it only delivers to the Resend account owner.
- Storing messages in a database.
- Auto-reply email to the sender.
- HTML email templates (plain `text` only).
- Tests (no runner configured).

## Data model

```ts
// app/about/actions.ts
export interface IContactState {
  status: 'idle' | 'error' | 'sent';
  name?: string; // sender name, shown in the success panel
}
```

```ts
// lib/env.ts
export const env: {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string; // patriciomiguel_12@hotmail.com
  CONTACT_FROM_EMAIL: string; // onboarding@resend.dev until a domain is verified
};
```

Conventions:

- `lib/env.ts` imports `server-only`; importing it in a client component fails the build.
- A missing or empty var throws `Missing env var: <NAME>` on first access.
- Email is sent with `replyTo` = sender email, `subject` = `[Arcade Vault] Mensaje de <name>`, body as `text` (no HTML, no injection surface).

## Implementation plan

Before step 1: read relevant guides in `node_modules/next/dist/docs/` (Server Actions, `cacheComponents`).

1. **Env.** `bun add resend`. Create `lib/env.ts`, `.env` (empty keys, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` prefilled), `.env.example`, `.gitignore` exception. Add `no-process-env` to `eslint.config.mjs` with override for `lib/env.ts`. Check: `bun run lint` passes; `process.env` elsewhere fails lint.
2. **Tokens/effects.** Add shake, caret blink, divider pixel pulse, tip LED to `theme.css`/`effects.css` (after reading `home-about/styles.css`). Check: `bun dev` still runs, no visual change.
3. **Static sections.** `components/about/about-hero.tsx`, `highlight-icon.tsx`, `divider.tsx`, `contact-intro.tsx`. Compose in `app/about/page.tsx` inside `Reveal`s, contact form slot empty. Check: `/about` renders hero and divider at 375px and 1280px.
4. **Server Action.** `app/about/actions.ts` with `sendContact(prev, formData)`: trims, rejects empty fields and invalid email, calls `new Resend(env.RESEND_API_KEY).emails.send(...)`, returns `IContactState`. Resend error → `status: "error"`. Check: `bunx tsc --noEmit`.
5. **Form.** `components/about/contact-form.tsx` (`"use client"`, `useActionState(sendContact, { status: "idle" })`): fields, shake on error, terminal success panel, reset button. Wire into the page. Check: with a real key, submitting delivers the email to `CONTACT_TO_EMAIL`.

Each step leaves `bun dev` runnable and is commitable alone.

## Acceptance criteria

- [ ] `bun run lint`, `bunx tsc --noEmit` and `bun run build` finish with zero errors.
- [ ] `grep -rn "process.env" app components lib` matches only `lib/env.ts`.
- [ ] `.env` is ignored by git; `.env.example` is tracked and lists all three vars without values for secrets.
- [ ] Starting the app without `RESEND_API_KEY` and submitting the form shows the error state; the server log contains `Missing env var: RESEND_API_KEY`.
- [ ] `/about` shows hero, 3 highlights, divider and contact section in prototype order.
- [ ] Submitting with any empty field or an invalid email shakes the form and sends nothing.
- [ ] Submitting valid data delivers an email to `patriciomiguel_12@hotmail.com` with `Reply-To` = the sender email.
- [ ] After success the terminal panel shows `MENSAJE RECIBIDO` with the uppercased sender name; `ENVIAR OTRO MENSAJE` restores an empty form.
- [ ] The API key never appears in the client bundle (`grep -r "re_" .next/static` is empty).
- [ ] No component uses `dark:`, `@apply`, raw hex/rgba (except SVG icon fills matching the prototype), `.av-*` classes, or default exports (except Next route files).
- [ ] Every `interface`/`type` introduced is prefixed with `I`.
- [ ] `references/templates/` is unchanged (`git diff --stat references/` empty).
- [ ] Visual parity with `references/templates/home-about/arcade-vault-standalone.html` About page checked at 375px and 1280px.

## Decisions

- **Yes:** Server Action. Less boilerplate than a Route Handler and `useActionState` is native in React 19.
- **No:** Route Handler (`app/api/contact/route.ts`). Needs manual fetch, JSON parsing and client state for no gain.
- **Yes:** `lib/env.ts` as the only `process.env` reader, enforced by ESLint. A convention nobody enforces drifts.
- **No:** `zod` or `@t3-oss/env-nextjs`. Three string vars do not justify a dependency; a 4-line `required()` is enough.
- **Yes:** fail on first access, not at import. Keeps `next build` working on machines without the key.
- **Yes:** plain `text` body. No HTML means nothing to escape.
- **Yes:** `.env.example` committed via `!.env.example`. New clones know which vars exist.
- **No:** extracting `Textarea` to `components/ui/`. One use; extract on the third.
- **No:** rate limiting now. No verified domain and no traffic; add with the domain spec.

## Risks

| Risk                                                               | Mitigation                                                                              |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `onboarding@resend.dev` only delivers to the Resend account owner  | `CONTACT_TO_EMAIL` must be that account's email until a domain is verified.             |
| Public form can be spammed, burning the Resend quota               | Accepted for now; rate limit / honeypot in a follow-up spec.                            |
| `cacheComponents` changes Server Action / dynamic access semantics | Read Next 16 docs before step 4; `env` is read only inside the action, at request time. |
| Real API key committed by mistake                                  | `.env*` stays ignored; only `.env.example` (no secrets) is whitelisted.                 |

## What is **not** in this spec

- Spam protection of any kind.
- Verified domain and production sender.
- Message persistence or auto-reply.
- HTML email templates.

Each one of those, if it lands, goes in its own spec.
