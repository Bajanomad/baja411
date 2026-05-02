# 2026-05-02 Map Selected Pin Camera Offset Bugfix Report

## 1) Date
2026-05-02

## 2) Bug summary
In Plan Mode, selected pins were centered in the full map container with `map.easeTo({ center: [lng, lat] })` but without viewport-aware offset. On mobile, top search controls and the bottom selected pin drawer reduce usable map area, causing selected pins to appear too high and partially hidden/crowded by overlays.

## 3) Files inspected
- `REPO_MAP.md`
- `MAP_REGRESSION_CHECKLIST.md`
- `components/MapClientMapLibre.tsx`

## 4) Root cause
Selected-pin camera logic used direct center targeting with no overlay-aware offset in multiple selected-pin flows (marker click and pin suggestion). Single-pin search fit also lacked selected-pin centering behavior.

## 5) Files changed
- `components/MapClientMapLibre.tsx`
- `docs/bugfixes/2026_05_02_map_selected_pin_camera_offset.md`

## 6) Exact behavior changed
- Added `getSelectedPinCameraOffset()` helper to calculate a mobile-only vertical camera offset from viewport height and estimated top/bottom overlay occupancy.
- Added `centerOnSelectedPin(pin, minZoom)` helper to centralize selected-pin camera behavior (`easeTo` with offset, duration 650, essential true, min zoom 14).
- Replaced duplicate selected-pin camera calls with `centerOnSelectedPin` in:
  - Marker click selected-pin flow.
  - Search suggestion pin flow.
- Updated single-result pin flow in `fitPins(matches)` to set `selectedPin` and call `centerOnSelectedPin` when exactly one pin matches.
- Town search and multi-pin fit behavior were not changed.
- Drive Mode, GPS, heading rotation, recenter, Directions link, Close behavior, and search matching logic were not intentionally changed.

## 7) Validation results
- `npm run lint` failed due to missing local ESLint package resolution (`Cannot find package 'eslint' imported from eslint.config.mjs`).
- `npm run build` failed because `next` was not available in this environment (`sh: 1: next: not found`).

Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.

## 8) Map regression checklist summary
Checklist was reviewed before and after code changes. Code-path verification indicates:
- Selected pin flows now use shared viewport-aware centering helper.
- Search suggestions behavior remains intact.
- Directions and close actions remain unchanged in selected pin drawer.
- No Drive Mode or GPS flow modifications were introduced.

Full runtime/manual verification on mobile device is still required because local build/lint tooling was unavailable.

## 9) Remaining risks
- Mobile overlay sizes are estimated from viewport heuristics, not measured from live DOM panels; some device/layout combinations may still need offset tuning.
- Environment lacked runnable Next.js tooling, so no local runtime validation was possible in this session.
