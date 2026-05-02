# Restore Plan Mode search suggestions

## Prompt summary
Restore Plan Mode map search suggestions as clean React behavior inside `MapClientMapLibre.tsx` without DOM enhancers, MutationObserver, polling loops, fake control injection, or broad map rewrites. Suggestions should appear while typing in Plan Mode, include towns/categories/(safe) pins, and trigger the same behavior as submitted search.

## Files changed
- `components/MapClientMapLibre.tsx`
- `updates-and-changes/2026-04-29-plan-mode-search-suggestions.md`

## Behavior changed
- Added React-managed Plan Mode suggestion state and suggestion item typing.
- Added memoized suggestion generation for matching towns, categories, and visible pins.
- Added `runSearch(query)` helper so both submit and suggestion taps use one safe search path.
- Added suggestion tap behavior:
  - town/category taps execute search behavior (town center or category filter+fit pins),
  - pin taps center to that pin and open selected pin card.
- Suggestions hide when query is empty, on submit, on clear, on suggestion tap, and when switching to Drive Mode.
- No changes made to Drive Mode heading/bearing/recenter/tracking/orientation logic.

## Validation
- `npm run lint` failed due to missing `eslint` package in local environment (`ERR_MODULE_NOT_FOUND: Cannot find package 'eslint'`).
- `npm run build` failed due to missing `next` binary in local environment (`sh: 1: next: not found`).

## Risks / follow-up
- Suggestion ordering is town → category → pin and capped to keep list compact; if product wants stricter ranking, add explicit scoring next.
- Lint/build could not run successfully due to missing dependencies/binaries in this environment; rerun after restoring project toolchain.

## PR / commit
- Commit: `7b8fd433274723e78ab7473df591ed5bdfdbdd52`
- PR: Created via `make_pr` tool (link not returned by tool output).

## Final readout
- Implemented clean React Plan Mode suggestions in `MapClientMapLibre.tsx` with town/category/pin suggestion support and safe tap behavior.
- Drive Mode map motion/orientation logic was left untouched.
- Validation commands were executed but blocked by missing local dependencies (`eslint`, `next`).
