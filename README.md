# Baja411

Baja411 is a map-first field utility for Baja California Sur travelers, locals, expats, and overland drivers.

It is built for practical use in the field: map access, weather, storms, emergency information, local services, and community-submitted Baja intel.

## Repository structure

This repository is nested:

- Repository root: shared documentation, process notes, audit reports, and planning artifacts.
- Real app: `baja411/` contains the Next.js app, routes, components, APIs, Prisma schema, and config.

Do not assume app files are at the repository root. App paths begin under `baja411/`.

## Source of truth

- GitHub is the code source of truth.
- Vercel is the live deployment path.
- The first technical context file is `baja411/REPO_MAP.md`.

## Current product priorities

1. Keep SOS emergency access clean and reliable.
2. Protect map behavior.
3. Keep weather and storm tools useful inside Baja411.
4. Improve Plan Mode search suggestions only when scoped.
5. Preserve Drive Mode heading, bearing, recenter, and snap-back behavior.
6. Improve Local Directory usefulness with verified data.
7. Keep navigation and footer clean.
8. Keep the directory user-facing, not sales-first.

## Architecture notes

- Main map ownership lives in `baja411/components/MapClientMapLibre.tsx`.
- `baja411/app/map/MapSearchEnhancer.tsx` is removed and should not be referenced as current architecture.
- Weather uses a native Baja411 forecast UI powered by Open-Meteo.
- Windy remains for visual weather tools such as rain, wind, storms, and satellite layers.
- Public business submissions create `PENDING` records for admin review.
- The public directory shows `APPROVED` businesses only.
- SOS is a global safety layer, not a directory category.

## Important documentation

Read before changing app behavior:

1. `baja411/REPO_MAP.md`
2. `PROJECT_GUIDELINES.md`
3. `baja411/AGENTS.md` for Codex or OpenAI coding agents
4. `baja411/CLAUDE.md` for Claude Code
5. Exact files being changed

Audit reports live in:

- `baja411/docs/morning_audits/`
- `baja411/docs/night_audits/`

## Validation

For app code changes, run from the nested app directory:

```bash
cd baja411
npm run lint
npm run build
```

Documentation-only changes do not require lint or build unless app code changed.

Do not claim validation passed unless it actually passed.
