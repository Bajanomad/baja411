# 2026_05_02 Root App Restructure

1. Date: 2026-05-02
2. Workspace path: `/workspace/The-Baja-Nomad`
3. Purpose: Move the working Baja411 app from `baja411/` into repository root.
4. Old structure: Next.js app nested under `baja411/`.
5. New structure: Next.js app at repository root.
6. Files moved: `app/`, `components/`, `data/`, `docs/`, `lib/`, `prisma/`, `public/`, `vendor/`, plus root config files (`package.json`, lockfile, Next/TS/ESLint/PostCSS/Prisma/Vercel configs).
7. Files merged: root instruction/docs updated to preserve durable project context with root-based paths.
8. Files deleted: obsolete nested `baja411/` app folder and stale nested instruction duplicates.
9. Files skipped: `node_modules`, `.next`, cache/temp/build outputs, secrets/env files.
10. Path references updated: replaced active references to `baja411/...` and `cd baja411` with root paths/commands.
11. Docs updated: `README.md`, `REPO_MAP.md`, `AGENTS.md`, `CLAUDE.md`, `PROJECT_GUIDELINES.md`, `MAP_REGRESSION_CHECKLIST.md`, and related root docs.
12. Config files updated: app configs relocated to root without behavior redesign.
13. Validation commands run: `npm install`, `npm run lint`, `npm run build`.
14. Number of lint attempts: 1
15. Number of build attempts: 1
16. Final lint result: failed in this environment (dependency resolution unavailable because install was blocked).
17. Final build result: failed in this environment (`next` unavailable because install was blocked).
18. External blockers if any: npm registry access blocked with `403 Forbidden` while fetching dependencies.
19. Final smoke check result:
   - `package.json` at root: yes
   - `app/` at root: yes
   - `components/` at root: yes
   - `prisma/schema.prisma` at root: yes
   - `docs/` at root: yes
   - `REPO_MAP.md` at root: yes
   - `MAP_REGRESSION_CHECKLIST.md` at root: yes
   - `baja411/app` remains: no
   - `baja411/components` remains: no
   - `baja411/package.json` remains: no
   - README states root app: yes
   - REPO_MAP states root app: yes
   - active docs requiring `cd baja411`: no
   - `npm run lint` runs from root command path: yes (fails only from external dependency blocker)
   - `npm run build` runs from root command path: yes (fails only from external dependency blocker)
20. Next recommended step: run install/lint/build in an environment with npm registry access and then push this branch.
