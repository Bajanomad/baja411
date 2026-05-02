# Baja411 Claude Code Instructions

This file is for Claude and Claude Code when working inside the Baja411 app directory.

The actual Next.js app is here: ``. Do not assume app files are at the repository root.

## Required reading

Before editing, read:

1. `REPO_MAP.md`
2. This file
3. The exact files being changed

If instructions conflict, stop and report the conflict instead of guessing.

## Role

Claude is the product brain when the user is working in Claude chat.

Claude can handle product thinking, UX review, architecture review, diff review, decision support, and small scoped patches when appropriate.

Claude Code handles larger repo work, deeper investigation, bigger patches, build fixes, validation, and complex implementation when explicitly scoped.

Do not have Claude and Claude Code rewrite the same area blindly.

## Working order

Think in this order: user first, engineer second, CEO third. Start with why a real person would care.

## High-risk areas

1. Map behavior
2. Drive Mode heading and bearing rotation
3. Recenter behavior
4. Plan Mode search
5. GPS and fallback location
6. Weather and storm tools
7. SOS emergency access
8. Auth
9. Prisma
10. Vercel config and environment variables

Patch the smallest safe part. Avoid broad rewrites. Inspect relevant files before proposing or making changes.

Do not casually change Drive Mode, Plan Mode, heading rotation, recenter, snap-back, GPS tracking, search, pin rendering, SOS access, weather, auth, Prisma, Vercel config, or environment variables.

`app/map/MapSearchEnhancer.tsx` was removed and should not be treated as current architecture.

Use `MAP_REGRESSION_CHECKLIST.md` before and after map-related changes.

## Current product rules

Keep SOS emergency access clean and reliable. Keep weather and storm tools useful inside Baja411. Public business submissions require login, create `PENDING` records, and public directory output remains `APPROVED` only. Public business submit location choices are `Use my location`, `Input location`, and `Has no location`.

## gstack

Use the `/browse` skill from gstack for web browsing when available. Do not use `mcp__claude-in-chrome__*` tools.

Useful gstack skills include:

`/investigate`, `/review`, `/careful`, `/qa`, `/qa-only`, `/ship`, `/land-and-deploy`, `/browse`, `/design-review`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`.

## Audit documentation

For Baja411 morning checklists, night audits, repo audits, daily cleanup, end-of-day reviews, status summaries, or “what did we do today” workflows, require a permanent dated markdown report unless the user explicitly says not to write files.

Default paths: morning audits at `docs/morning_audits/YYYY_MM_DD_morning_audit.md`; night audits at `docs/night_audits/YYYY_MM_DD_night_audit.md`.

The prompt must require creating the folder if missing, writing completed findings, committing the file, not rerunning the audit if only the file is missing, and final response with file path, commit SHA, docs-only/app-code status, and summary.

Required audit sections: date, purpose, recent merged PR summary, open PR status, deployment/Vercel status if checked, files inspected, bugs found, dead or duplicate code found, validation results, recommended next task, files changed.

## Validation

For app changes, attempt:

```bash
npm run lint
npm run build
```

Documentation-only changes do not require lint/build unless app code changed.

Do not claim validation passed unless it actually passed.

If tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```
