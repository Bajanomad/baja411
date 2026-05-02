# Clean Org Repo Migration Report

1. **Date**: 2026-05-02
2. **Source repo**: Bajanomad/baja411
3. **Target repo**: BajaSur411/BajaSur411
4. **Purpose**: Move the working Baja411 app from nested source layout into a clean root app structure in the target org repo.
5. **Final repo structure**: Root now contains `app/`, `components/`, `data/`, `lib/`, `prisma/`, `public/`, `vendor/`, `docs/`, `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `middleware.ts` (if present), plus root docs (`README.md`, `REPO_MAP.md`, `PROJECT_GUIDELINES.md`, `AGENTS.md`, `CLAUDE.md`, `MAP_REGRESSION_CHECKLIST.md`).
6. **Files and folders copied**: All app/runtime/docs content from source nested app directory into repository root, excluding prohibited transient artifacts.
7. **Files and folders skipped**: `node_modules/`, `.next/`, build outputs, caches, and temp artifacts.
8. **Files updated for new paths**: Root and docs markdown/config references updated from nested paths to root paths (including validation commands and repo references).
9. **Old references removed**: Removed stale `cd baja411`, `baja411/...` path assumptions, and old repo references to `Bajanomad/baja411` where migration-related.
10. **App code changed**: No (migration/path relocation focus only).
11. **Docs changed**: Yes.
12. **Validation commands run**:
   - `npm install`
   - `npm run lint`
   - `npm run build`
13. **Number of lint iterations**: 1
14. **Number of build iterations**: 1
15. **Final validation result**: Not fully passable in this environment due to external dependency installation blocker.
16. **Any external blocker if one exists**: `npm install` failed with `403 Forbidden` while fetching `maplibre-gl` from npm registry; as a result, local dependency binaries (`eslint`, `next`) were unavailable for lint/build execution.
17. **Next recommended step**: Run `npm install` in an environment with npm registry access/credentials and rerun `npm run lint` then `npm run build` from repo root.
