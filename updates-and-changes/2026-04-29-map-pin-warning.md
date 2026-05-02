# Map pin warning

## Prompt summary
Add a short warning modal before users can continue in the existing Add Pin flow. Keep all map behavior, auth behavior, pin submission behavior, and map movement logic unchanged.

## Files changed
- `components/MapClientMapLibre.tsx`
- `updates-and-changes/2026-04-29-map-pin-warning.md`

## Behavior changed
Add Pin now shows a warning before continuing. Pin submission, auth, GPS, map movement, Drive Mode, Plan Mode, and search behavior unchanged.

## Validation
- `npm run lint` (from `baja411/`) failed: `Cannot find package 'eslint' imported from .../eslint.config.mjs`.
- `npm run build` (from `baja411/`) failed: `next: not found`.

## Risks / follow up
- Future moderation may add a sensitive location denial reason.
- Future suggest listing flow should include the same warning.
- No surf break data was added.
- Map behavior outside the Add Pin click path was not touched.

## PR / commit
- Commit hash: `884859d0d8d425ec9b0ec22a28ee2312828d6179`
- PR link: Created via `make_pr` tool (link not returned by environment).

## Final readout copy
- Added a pre-submit warning modal for Add Pin with exact required copy and two actions: **I understand** and **Cancel**.
- Cancel now closes the warning and does nothing else.
- I understand now continues into the exact prior Add Pin flow (including redirect to `/signin` when unauthenticated, and opening add pin mode when authenticated).
- Did not change GPS behavior, Drive Mode, Plan Mode, heading/bearing/recenter/follow behavior, search suggestions behavior, MapLibre init, pin fetch, pin submit API, pin payload, auth stack, NextAuth, Prisma, or DB schema.
- Validation could not complete successfully in this environment due to missing local tooling (`eslint` and `next` commands not available).
