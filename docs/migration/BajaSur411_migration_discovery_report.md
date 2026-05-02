# BajaSur411 Migration Discovery Report

## Date
2026-05-02 (UTC)

## Purpose
This report captures discovery findings for a planned migration from `Bajanomad/baja411` to `Bajanomad/BajaSur411` without changing current app behavior during discovery.

## Source repo
`Bajanomad/baja411`

## Target repo
`Bajanomad/BajaSur411`

## Human-facing project name
**Baja Sur 411**

## Migration feasibility
**Feasible with partial operational blocking**:
- Migration planning and structure design are feasible now.
- New-repo creation from this Codex environment is currently blocked by missing GitHub CLI tooling/auth verification in-session.

## Repo creation capability (this environment)
Current environment cannot directly confirm or execute creation of `Bajanomad/BajaSur411`.

Observed limitation:
- `gh` not installed (`gh: command not found`).

### Manual repo creation steps (exact)
1. Open `https://github.com/new`.
2. Owner: `Bajanomad`.
3. Repository name: `BajaSur411`.
4. Set visibility (recommended: private initially).
5. Leave “Initialize this repository” unchecked if you want clean skeleton-first history.
6. Click **Create repository**.
7. After creation, connect local repo when ready:
   - `git remote add target git@github.com:Bajanomad/BajaSur411.git` (or HTTPS variant)
8. Push only after the approved skeleton task is complete.

## Recommended target structure

```txt
BajaSur411/
  README.md
  PROJECT_GUIDELINES.md
  AGENTS.md
  package.json
  .gitignore
  .env.example
  docs/
    MASTERPLAN.md
    REPO_MAP.md
    MOBILE_ROADMAP.md
    MAP_ARCHITECTURE_AUDIT.md
    DIRECTORY_INTAKE.md
    morning_audits/
    night_audits/
    decisions/
    audits/
    prompts/
  apps/
    web/
      README.md
      AGENTS.md
      CLAUDE.md
      MAP_REGRESSION_CHECKLIST.md
      package.json
      app/
      components/
      lib/
      data/
      prisma/
      public/
      vendor/
    ios/
      README.md
      docs/IOS_PLAN.md
      app/.gitkeep
    android/
      README.md
      docs/ANDROID_PLAN.md
      app/.gitkeep
  packages/
    shared/
      README.md
      package.json
      src/index.ts
    config/
      README.md
      package.json
    database/
      README.md
      package.json
  tooling/
    README.md
    scripts/.gitkeep
  infrastructure/
    README.md
    vercel/README.md
    env/README.md
```

## Source-to-target move map
- `baja411/app` -> `apps/web/app`
- `baja411/components` -> `apps/web/components`
- `baja411/lib` -> `apps/web/lib`
- `baja411/data` -> `apps/web/data`
- `baja411/prisma` -> `apps/web/prisma`
- `baja411/public` -> `apps/web/public`
- `baja411/vendor` -> `apps/web/vendor`
- `package.json` -> `apps/web/package.json`
- `baja411/tsconfig.json` -> `apps/web/tsconfig.json`
- `MAP_REGRESSION_CHECKLIST.md` -> `apps/web/MAP_REGRESSION_CHECKLIST.md`
- `baja411/AGENTS.md` -> `apps/web/AGENTS.md`
- `baja411/CLAUDE.md` -> `apps/web/CLAUDE.md`
- `REPO_MAP.md` -> `docs/REPO_MAP.md`
- `docs/MASTERPLAN.md` -> `docs/MASTERPLAN.md`
- `docs/MAP_ARCHITECTURE_AUDIT.md` -> `docs/MAP_ARCHITECTURE_AUDIT.md`
- `MOBILE_ROADMAP.md` -> `docs/MOBILE_ROADMAP.md`
- `DIRECTORY_INTAKE.md` if present -> `docs/DIRECTORY_INTAKE.md`
- `docs/morning_audits` -> `docs/morning_audits`
- `docs/night_audits` -> `docs/night_audits`

## Docs that must be updated
Path rewrites and structure updates are required in:
- Root `README.md`
- Root `PROJECT_GUIDELINES.md`
- Root `AGENTS.md`
- `baja411/README.md` (to become `apps/web/README.md`)
- `baja411/AGENTS.md` (to become `apps/web/AGENTS.md`)
- `baja411/CLAUDE.md` (to become `apps/web/CLAUDE.md`)
- `REPO_MAP.md` (to become `docs/REPO_MAP.md`)
- `docs/MASTERPLAN.md` (to become `docs/MASTERPLAN.md`)
- `docs/MAP_ARCHITECTURE_AUDIT.md` (to become `docs/MAP_ARCHITECTURE_AUDIT.md`)
- `MAP_REGRESSION_CHECKLIST.md` (to become `apps/web/MAP_REGRESSION_CHECKLIST.md`)
- `MOBILE_ROADMAP.md` (to become `docs/MOBILE_ROADMAP.md`)
- `DIRECTORY_INTAKE.md` (to become `docs/DIRECTORY_INTAKE.md`)

## Path rewrite requirements
- `REPO_MAP.md` -> `docs/REPO_MAP.md`
- `docs/MASTERPLAN.md` -> `docs/MASTERPLAN.md`
- `docs/MAP_ARCHITECTURE_AUDIT.md` -> `docs/MAP_ARCHITECTURE_AUDIT.md`
- `MAP_REGRESSION_CHECKLIST.md` -> `apps/web/MAP_REGRESSION_CHECKLIST.md`
- `components/MapClientMapLibre.tsx` -> `apps/web/components/MapClientMapLibre.tsx`
- `app/map/MapLoader.tsx` -> `apps/web/app/map/MapLoader.tsx`
- `components/LocationProvider.tsx` -> `apps/web/components/LocationProvider.tsx`
- `app/weather/page.tsx` -> `apps/web/app/weather/page.tsx`
- `components/HomeWeatherStrip.tsx` -> `apps/web/components/HomeWeatherStrip.tsx`
- `app/emergency/page.tsx` -> `apps/web/app/emergency/page.tsx`
- `prisma/schema.prisma` -> `apps/web/prisma/schema.prisma`
- `npm run lint` -> `cd apps/web && npm run lint`
- `npm run build` -> `cd apps/web && npm run build`

## Recommended package manager/workspace setup
**Recommendation: npm workspaces (initially), no turbo yet.**

Why:
- Existing app already uses npm and lockfile continuity.
- Workspaces add structure with minimal operational risk.
- Avoid simultaneous package-manager migration during repo migration.
- Turborepo can be introduced later when CI caching/task orchestration needs are real.

## Risks and mitigations
1. **Path references risk**
   - Risk: stale `baja411/...` strings in docs/scripts create broken instructions.
   - Mitigation: global path-rewrite pass + targeted docs QA checklist.

2. **tsconfig paths risk**
   - Risk: alias `@/*` resolution breaks if root assumptions shift.
   - Mitigation: keep `apps/web/tsconfig.json` path mapping rooted to `apps/web`.

3. **Next config risk**
   - Risk: `next.config.*` not colocated with app package.
   - Mitigation: keep config inside `apps/web`.

4. **Prisma risk**
   - Risk: schema/client generation path breaks if moved prematurely.
   - Mitigation: keep Prisma in `apps/web/prisma`; do not move to `packages/database` yet.

5. **NextAuth/vendor risk**
   - Risk: local tarball dependencies break if `vendor/` not moved intact.
   - Mitigation: move `vendor/` as-is into `apps/web/vendor` and verify install.

6. **Vercel root-directory risk (later)**
   - Risk: deploy failures if Vercel still points at old root.
   - Mitigation: after migration only, set Vercel root directory to `apps/web` in a separate controlled step.

7. **Environment variable risk**
   - Risk: env docs and runtime references drift during path changes.
   - Mitigation: keep env variable names unchanged; update only docs path context.

8. **Documentation drift risk (“docs lying to agents”)**
   - Risk: old instructions continue pointing to nested `baja411/`.
   - Mitigation: prioritize REPO_MAP/MASTERPLAN/AGENTS rewrite immediately after structure migration.

9. **Accidental app behavior change risk**
   - Risk: migration tasks accidentally include feature edits.
   - Mitigation: enforce structure-only commits first; no behavior edits in migration PR.

10. **Map behavior regression risk**
   - Risk: high-risk map ownership area regresses from incidental changes.
   - Mitigation: no map code edits during migration; run map regression checklist after structural move.

## Migration rules
- Do not touch production Vercel during migration.
- Do not delete or mutate the current source repo.
- Do not move Prisma into `packages/database` yet.
- Do not generate fake iOS or Android projects yet.
- Keep `apps/ios` and `apps/android` as placeholders.
- Keep app behavior unchanged.
- Validate only after migration.

## Recommended next task (exact)
**Create or initialize `Bajanomad/BajaSur411` skeleton only.**

## Proposed next Codex task summary
The next Codex prompt should:
- create target repo if permitted,
- create skeleton structure,
- add placeholder docs,
- commit skeleton,
- and **not** migrate app code yet.

## Validation
Validation was **not required** for this task because this was documentation-only and no app code was changed.

## Files changed
- `docs/migration/BajaSur411_migration_discovery_report.md`

## Final status
- Documentation-only: **Yes**
- App code changed: **No**
- App behavior changed: **No**
- Vercel changes: **No**
- Repo migration performed yet: **No**
