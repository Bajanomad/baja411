# Baja Sur 411

This is the **Baja Sur 411** platform repository.

## Current migration status

- `apps/web` will contain the production web app after migration from `Bajanomad/baja411`.
- `apps/ios` is a placeholder for the future iOS app.
- `apps/android` is a placeholder for the future Android app.
- `docs/MASTERPLAN.md` will be the canonical product build plan after migration.
- `docs/REPO_MAP.md` will be the technical source of truth after migration.

## Source of truth and deployment

- GitHub is the source of truth.
- Vercel should **not** be connected until the migrated web app validates.
- The current active app still lives in `Bajanomad/baja411` until migration is complete.

## Workspace scripts

Root workspace scripts are scaffolded for future `apps/web` usage:

- `npm run dev:web`
- `npm run lint:web`
- `npm run build:web`

These scripts become active after web migration is in place and `apps/web/package.json` exists.
