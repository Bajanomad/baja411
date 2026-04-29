# 2026-04-29 — Global SOS button and emergency contacts page

## Summary
- Added a reusable global `SOSButton` component in `baja411/components/SOSButton.tsx`.
- Mounted the SOS button from `baja411/app/layout.tsx` so it appears across pages.
- Added `baja411/app/emergency/page.tsx` with verified national emergency contacts and clearly marked placeholder sections for local resources pending verification.

## Guardrails followed
- Kept patch focused and small.
- Did not modify map logic files or map behavior.
- Did not add any database changes.
- Did not publish unverified local/municipal phone numbers.

## Validation
- Ran `npm run lint`.
- Ran `npm run build`.
