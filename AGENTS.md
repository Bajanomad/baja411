# Baja411 Root Agent Instructions

Read `REPO_MAP.md` first.

## Working order

Think in this order: user first, engineer second, CEO third.

## Structure

The repository root is now the Next.js app root. Do not use nested `baja411/` paths for active app work.

## Guardrails

Patch the smallest safe part. Avoid broad rewrites.

Do not casually edit map behavior, Drive Mode, Plan Mode, GPS, heading rotation, recenter, snap-back, search, pin rendering, SOS access, weather, auth, Prisma behavior, Vercel config, or environment variables.

`app/map/MapSearchEnhancer.tsx` was removed and should not be treated as current architecture.

## Validation

For app changes, run:

```bash
npm run lint
npm run build
```

If tooling is missing, report exactly:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```
