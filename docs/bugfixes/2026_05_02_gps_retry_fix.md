# 2026-05-02 GPS Retry Fix

## Date
- 2026-05-02

## Bug summary
- Live map GPS could fail once and then stop retrying from the recenter button until a full page reload.

## Files inspected
- `REPO_MAP.md`
- `components/LocationProvider.tsx`
- `components/MapClientMapLibre.tsx`
- `app/layout.tsx`
- `MAP_REGRESSION_CHECKLIST.md`

## Root cause found
- In `MapClientMapLibre`, `startTracking()` exits early when `watchIdRef.current !== null`.
- On geolocation watch error, the error callback set `tracking/following/locating` state but did not clear the existing geolocation watch id reference.
- That left `watchIdRef.current` stuck as non-null in failure states, so later `recenter()` retries called `startTracking()` but immediately returned.

## Files changed
- `components/MapClientMapLibre.tsx`
- `components/LocationProvider.tsx`

## Exact behavior changed
- Added a small helper to clear and null geolocation watch ids.
- Cleanup now uses the same helper.
- Geolocation watch error callback now clears the watch id before resetting GPS states, allowing retry without reload.
- In `LocationProvider`, `requestLocation()` now:
  - updates `permissionState` to `denied` on permission-denied errors,
  - clears stale stored GPS on `POSITION_UNAVAILABLE` and `TIMEOUT` errors.

## Validation results
- `npm run lint` failed in this environment: `ERR_MODULE_NOT_FOUND` for `eslint` import resolution.
- `npm run build` failed in this environment: `next: not found`.
- Repo path grep check executed and returned only historical/documentation references.

## Map regression checklist summary
- Reasoned through required map checks against the touched GPS code path:
  1. Map renders: unchanged map initialization/render path.
  2. Drive Mode opens: unchanged mode defaults and controls.
  3. GPS prompt/attempt works: unchanged startup `startTracking()` call.
  4. GPS failure does not lock retry: fixed by clearing watch id on error.
  5. Recenter retries GPS: `recenter()` still calls `startTracking()` when not tracking; now unblocked after failures.
  6. Plan Mode does not auto-follow: preserved existing `modeRef.current === "PLAN"` branch behavior.
  7. Search suggestions still work: untouched.
  8. Pin selection still works: untouched.
  9. Add pin flow untouched: untouched.
  10. Directions to Google Maps untouched: untouched.

## Remaining risks
- Manual device/browser GPS behavior still needs live mobile verification because this environment cannot execute full app lint/build or browser GPS integration checks.
