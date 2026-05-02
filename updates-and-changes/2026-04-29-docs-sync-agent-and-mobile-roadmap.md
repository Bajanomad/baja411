# Sync agent docs and mobile roadmap

## Prompt summary
Aligned repository documentation with the current nested app structure, current map ownership, current location provider usage, and mobile planning guidance. Added root-level agent instructions and a root mobile roadmap document without changing runtime behavior.

## Files changed
- `AGENTS.md` (new)
- `MOBILE_ROADMAP.md` (new)
- `PROJECT_GUIDELINES.md`
- `baja411/AGENTS.md`
- `baja411/README.md`
- `REPO_MAP.md`
- `updates-and-changes/2026-04-29-docs-sync-agent-and-mobile-roadmap.md` (this log)

## Behavior changed
Documentation only. No app behavior changed.

## Validation
- `npm run lint` (from `baja411/`) failed: missing local eslint package resolution in current environment (`Cannot find package 'eslint'`).
- `npm run build` (from `baja411/`) failed: `next` binary not found in current environment.

## Risks / follow-up
- Next likely safe task is implementing clean React Plan Mode search suggestions in the map system (`MapClientMapLibre` or a proper React child component), without reintroducing DOM enhancer hacks.

## PR / commit
- Commit hash: `488d803`
- PR link: PR creation attempted via `make_pr`; URL was not returned by tool output in this environment.
