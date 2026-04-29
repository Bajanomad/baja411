# Map pin warning polish

## Prompt summary
Polish the Add Pin warning modal in `MapClientMapLibre` while keeping warning flow and all map/auth/pin behaviors unchanged. Fix warning body rendering so the warning lines display correctly (not literal `\n\n`) and align visual style with Baja411.

## Files changed
- `baja411/components/MapClientMapLibre.tsx`
- `updates-and-changes/2026-04-29-map-pin-warning-polish.md`

## Behavior changed
Visual polish only. Warning flow, pin submission, auth, GPS, map movement, Drive Mode, Plan Mode, and search behavior unchanged.

## Validation
- `cd baja411 && npm run lint` ❌ failed: `Cannot find package 'eslint' imported from /workspace/The-Baja-Nomad/baja411/eslint.config.mjs`.
- `cd baja411 && npm run build` ❌ failed: `next: not found`.

## Risks / follow up
- Future add pin flow may still need deeper UX polish.
- No map behavior outside the warning modal path was changed.

## PR / commit
- Commit: `f5929bb`
- PR: Not available from local tooling output (make_pr called).

## Final readout
- Changed files:
  - `baja411/components/MapClientMapLibre.tsx`
  - `updates-and-changes/2026-04-29-map-pin-warning-polish.md`
- Behavior summary:
  - Replaced literal escaped newlines in modal body with real paragraph elements.
  - Polished modal spacing, hierarchy, and button treatment for cleaner mobile-friendly Baja411 appearance.
  - Preserved existing modal open/close/continue flow exactly.
- Validation status:
  - `npm run lint`: failed due to missing local tooling/dependency resolution (`eslint` package unavailable in this environment).
  - `npm run build`: failed due to missing local tooling (`next` binary unavailable in this environment).
- Failures:
  - Lint and build could not complete in this environment because required local toolchain/dependencies are not available.
- Commit hash: `f5929bb`
- PR link: Not available from local tooling output (make_pr called).
