# Baja411 Codex Instructions

This file is for Codex and OpenAI coding agents working inside the Baja411 app directory.

The actual Next.js app is here:

```txt
baja411/
```

Do not assume app files are at the repository root.

Before editing, read:

1. `REPO_MAP.md`
2. `../AGENTS.md` if present
3. The exact files being changed

If instructions conflict, stop and report the conflict instead of guessing.

## Stack note

This project uses a newer Next.js version than most training data. Before changing framework specific behavior, inspect the current files and, when available, relevant docs in `node_modules/next/dist/docs/`.

## Working order

Think in this order:

1. End user need
2. CEO and business strategy
3. Engineering execution

## Scope rules

Patch the smallest safe part.

Do not do broad rewrites unless explicitly requested.

Do not change map behavior unless the task specifically scopes it.

High risk areas:

1. `components/MapClientMapLibre.tsx`
2. `app/map/MapLoader.tsx`
3. `components/LocationProvider.tsx`
4. `components/Nav.tsx`
5. `app/weather/page.tsx`
6. `app/emergency/page.tsx`
7. `prisma/schema.prisma`

Protect Drive Mode, Plan Mode, heading rotation, recenter, GPS tracking, search, pin rendering, SOS access, weather, auth, Prisma, and Vercel behavior.

Do not add MutationObserver hacks, polling loops, injected fake controls, hidden CSS hacks, or fake architecture.

## Validation

After code changes, attempt:

```bash
npm run lint
npm run build
```

If validation cannot run because tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```

Do not claim validation passed unless it actually passed.
