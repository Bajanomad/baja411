# 2026-05-02 Flatten Repo Report

## Date
2026-05-02

## Purpose
Document the completed migration that flattened the Next.js app from a nested `baja411/` directory to the repository root, and record doc/instruction cleanup.

## Previous structure
- Repository root contained a nested app directory: `baja411/`
- App routes, components, Prisma, and docs references were commonly prefixed with `baja411/`
- Validation instructions often used `cd baja411 && ...`

## New structure
- The repository root is now the Next.js app root.
- App routes live in `app/`.
- Components live in `components/`.
- Prisma lives in `prisma/`.
- Main map file is `components/MapClientMapLibre.tsx`.
- Validation runs from repo root.

## PR #82 summary
PR #82 completed the flattening migration so the runtime app and tooling execute from repository root paths.

## Commit SHA
`a355ab37be8ada42bfd64bd4aa3c7ad9843b8b58`

## Files moved summary
Core app directories and root config/runtime files are now at repository root (for example: `app/`, `components/`, `prisma/`, `lib/`, `data/`, `public/`, `vendor/`, `package.json`, `tsconfig.json`, `next.config.ts`, `vercel.json`).

## Docs fixed
Updated root guidance and operational docs to reflect root-based paths and commands, including agent instructions, repo map, master planning docs, map architecture notes, and audit docs.

## Stale references removed
- Replaced stale nested-path references in current instructions.
- Replaced stale `cd baja411` validation command variants with root commands.
- Kept historical context only where explicitly described as historical.

## Validation note
This was a documentation-only cleanup. Lint/build validation was not required because no app code or runtime config behavior was changed.

## Vercel note
Vercel Root Directory was changed from `baja411` to repo root, and the production redeploy for commit `a355ab3` is READY. No Vercel settings were changed in this task.

## Remaining risks
- Some historical audit entries can still mention pre-flatten paths; these must remain clearly historical and not treated as current architecture.
- Future instructions must avoid reintroducing nested path assumptions.

## Files changed
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `REPO_MAP.md`
- `PROJECT_GUIDELINES.md`
- `MAP_REGRESSION_CHECKLIST.md`
- `docs/MASTERPLAN.md`
- `docs/MAP_ARCHITECTURE_AUDIT.md`
- `docs/morning_audits/*`
- `docs/night_audits/*`
- `docs/migrations/2026_05_02_flatten_repo_report.md`
