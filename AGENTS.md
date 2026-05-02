# Baja411 Codex Instructions

This file is for Codex and OpenAI coding agents working inside the Baja411 app directory.

The actual Next.js app is here: ``. Do not assume app files are at the repository root.

## Required reading

Before editing, read:

1. `REPO_MAP.md`
2. `../AGENTS.md` if present
3. The exact files being changed

If instructions conflict, stop and report the conflict instead of guessing.

## Stack note

This project uses a newer Next.js version than most training data. Before changing framework-specific behavior, inspect the current files and use installed docs when available.

## Working order

Think in this order: user first, engineer second, CEO third. Start with why a real person would care.

## Scope rules

Patch the smallest safe part. Do not do broad rewrites unless explicitly requested.

Do not change map behavior unless the task specifically scopes it.

High-risk files and areas:

1. `components/MapClientMapLibre.tsx`
2. `app/map/MapLoader.tsx`
3. `components/LocationProvider.tsx`
4. `components/Nav.tsx`
5. `components/Footer.tsx`
6. `app/weather/page.tsx`
7. `components/HomeWeatherStrip.tsx`
8. `app/emergency/page.tsx`
9. `prisma/schema.prisma`

Protect Drive Mode, Plan Mode, heading rotation, recenter, snap-back, GPS tracking, search, pin rendering, SOS access, weather, auth, Prisma, Vercel config, and environment variables.

Do not use DOM patching tricks, polling loops, injected controls, hidden styling behavior, or fake architecture.

`app/map/MapSearchEnhancer.tsx` was removed and should not be treated as current architecture.

Use `MAP_REGRESSION_CHECKLIST.md` before and after map-related changes.

## Current product rules

Keep SOS emergency access clean and reliable. Keep weather and storm tools useful inside Baja411. Public business submissions require login, create `PENDING` records, and public directory output remains `APPROVED` only. Public business submit location choices are `Use my location`, `Input location`, and `Has no location`.

## Audit documentation

For Baja411 morning checklists, night audits, repo audits, daily cleanup, end-of-day reviews, status summaries, or “what did we do today” workflows, require a permanent dated markdown report unless the user explicitly says not to write files.

Default paths: morning audits at `docs/morning_audits/YYYY_MM_DD_morning_audit.md`; night audits at `docs/night_audits/YYYY_MM_DD_night_audit.md`.

The prompt must require creating the folder if missing, writing completed findings, committing the file, not rerunning the audit if only the file is missing, and final response with file path, commit SHA, docs-only/app-code status, and summary.

Required audit sections: date, purpose, recent merged PR summary, open PR status, deployment/Vercel status if checked, files inspected, bugs found, dead or duplicate code found, validation results, recommended next task, files changed.

## Validation

After app code changes, attempt:

```bash
npm run lint
npm run build
```

Documentation-only changes do not require lint/build unless app code changed.

If validation cannot run because tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```

Do not claim validation passed unless it actually passed.
