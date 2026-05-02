# Flatten Repo Migration Report

- Date: 2026-05-02
- Purpose: Move the Baja411 Next.js app from `baja411/` to repository root.
- Previous structure: App under nested `baja411/`.
- New structure: App at repository root (`app/`, `components/`, `lib/`, `prisma/`, configs, package files).

## Files moved
Used `git mv` for app directories and config/package files, including `app/`, `components/`, `data/`, `docs/`, `lib/`, `prisma/`, `public/`, `vendor/`, `package.json`, lockfile, Next/TS/Prisma configs, `MAP_REGRESSION_CHECKLIST.md`, and `REPO_MAP.md`.

## Files merged
- `README.md` merged into root canonical app README.
- `AGENTS.md` merged into root canonical agent guidance.
- `.gitignore` merged root + app ignore rules.

## Files deleted
- Removed obsolete nested wrapper files and deleted old `baja411/` directory after migration.

## Stale references fixed
Updated primary instruction and validation references to root-based commands and paths.
Historical references may remain in dated audit/change-log files; these are retained as historical records.

## Validation results
- `npm run lint`: failed in this environment (`ERR_MODULE_NOT_FOUND` for `eslint` import resolution).
- `npm run build`: failed in this environment (Google font fetch/module resolution failures during Turbopack build).

## Remaining risks
- Historical docs in `updates-and-changes/` and dated audits may still mention old `baja411/` paths.

## Final git status summary
See `git status --short` run during final checks; migration committed in a single flattening commit.
