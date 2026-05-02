# Flatten Repo Inventory

Date: 2026-05-02

## Repo root top-level entries (before migration)
.git
.gitignore
AGENTS.md
DIRECTORY_INTAKE.md
MOBILE_ROADMAP.md
PROJECT_GUIDELINES.md
README.md
baja411
docs
updates-and-changes

## baja411/ top-level entries (before migration)
.gitignore
AGENTS.md
CLAUDE.md
DEBUG_SCAN_REPORT.md
MAP_REGRESSION_CHECKLIST.md
README.md
REPO_MAP.md
app
components
data
docs
eslint.config.mjs
lib
next.config.ts
package-lock.json
package.json
postcss.config.mjs
prisma
prisma.config.ts
public
tsconfig.json
updates-and-changes
vendor
vercel.json

## Collision report and decisions

- AGENTS.md: **C (merge)**. Keep root as canonical agent file, merge critical app instructions from nested file, update paths to flattened root.
- README.md: **C (merge)**. Use root README as canonical, merge app-specific setup/details and remove nested-root wording.
- .gitignore: **C (merge)**. Ensure root includes app ignores from nested .gitignore.
- updates-and-changes/: **B (preserve root doc folder)**. Keep repo-level history folder at root; migrate nested app copy under it if needed then remove duplicate.
- docs/: **A (move nested app docs to root)** because docs should live under root app after flattening.
- data/: **A (move nested app data to root)** (no existing root data folder).
- public/: **A (move nested app public to root)** (no existing root public folder).
- Remaining app/config paths (app, components, lib, prisma, vendor, package/config files): **A (move to root)**.
