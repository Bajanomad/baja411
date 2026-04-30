# Baja411 Debug Scan Report

> ⚠️ **Historical Report (Point-in-Time Scan):** This document reflects a static scan performed at a prior point in time and may include stale recommendations. The current source of truth for architecture and implementation guidance is `baja411/REPO_MAP.md`.
> 
> Current confirmed direction:
> - Native forecast UI remains in `baja411/app/weather/page.tsx` using Open-Meteo with Today, 7 Day, and 16 Day modes.
> - Windy remains for rain, wind, storm, and satellite visual tools; do not replace the native forecast panel with the old Windy forecast iframe.
> - Directory iPhone Enter/Search keyboard dismissal is fixed in `baja411/components/BusinessDirectoryClient.tsx`.
> - Previous stricter satellite proxy hardening attempt broke satellite tools and was rolled back to known working behavior.
> - Do not reapply the same satellite proxy hardening recommendation without a new scoped design and live validation.

## Executive Summary

The repository is **partially blocked for full validation in this environment** because required local tooling dependencies are missing (`eslint` package and `next` binary are not available). Based on static inspection, the app architecture is coherent but has **moderate operational risk** concentrated in map behavior coupling, weather external-dependency handling, and a few likely stale-documentation/dependency setup gaps.

## Validation Results

Commands run:

1. `cd baja411 && npm run lint`
   - **Result:** Failed
   - **Observed:** `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'eslint' imported from .../eslint.config.mjs`
   - **Interpretation:** Validation did not execute actual lint rules due to missing dependency.

2. `cd baja411 && npm run build`
   - **Result:** Failed
   - **Observed:** `sh: 1: next: not found`
   - **Interpretation:** Build tooling is not installed/available in this environment.

Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.

## Critical Issues

1. **Validation pipeline currently non-runnable locally (confirmed)**
   - **File path(s):** `baja411/package.json` (implied scripts), `baja411/eslint.config.mjs` (import target)
   - **Component/section:** Local quality gate commands (`lint`, `build`)
   - **Observed:** Lint fails before rule execution because `eslint` package cannot be resolved; build fails because `next` CLI is missing.
   - **Why it matters:** CI/local release confidence is blocked; regressions in map/SOS/weather cannot be safely validated.
   - **Evidence level:** **Validation-backed**

## High Priority Fixes

1. **Harden map runtime against missing browser geolocation permission APIs (suspected edge-case risk)**
   - **File path:** `baja411/components/MapClientMapLibre.tsx`
   - **Section:** `startTracking`, map setup effect cleanup paths
   - **Observed:** `navigator.geolocation.watchPosition` is used directly once map initializes. There is a guard for `navigator.geolocation`, but no surfaced UX status when permission is denied at watch-level except internal state flips.
   - **Why it matters:** Drive Mode follow/recenter confidence can degrade silently on denied/restricted geolocation conditions.
   - **Evidence level:** **Code inspection** (behavior likely by design, but UX resilience should be manually confirmed)

2. **Weather storm classifier may produce false alerts/monitors from broad keyword matching (suspected)**
   - **File path:** `baja411/app/api/weather/storm-status/route.ts`
   - **Section:** `classifyStatus`
   - **Observed:** Classifier relies on simple substring checks in scraped widget text.
   - **Why it matters:** Safety/weather messaging can be noisy or incorrect, impacting trust.
   - **Evidence level:** **Code inspection** (needs runtime sample corpus verification)

3. **Satellite proxy hardening recommendation is now historical (requires redesign before any retry)**
   - **File path:** `baja411/app/api/satellite/route.ts`
   - **Section:** `GET` URL allowlist logic
   - **Observed:** Hostnames are allowlisted, but path-level restriction and response size cap are not enforced.
   - **Why it matters:** Any stricter hardening must be redesigned and validated live because the previous stricter approach broke satellite tools and was rolled back.
   - **Evidence level:** **Code inspection**

## Medium Priority Fixes

1. **Duplicated weather page logic likely increases maintenance risk**
   - **File path:** `baja411/app/weather/page.tsx`, `baja411/components/HomeWeatherStrip.tsx`
   - **Section:** Location status messaging and GPS fallback UI
   - **Observed:** Similar location/fallback patterns appear in both components with different presentation and partial logic overlap.
   - **Why it matters:** Divergent behavior over time (especially denied/prompt/stale states) is likely.
   - **Evidence level:** **Code inspection**

2. **Footer includes auth-oriented CTA while primary strategy is user-facing directory-first (suspected product mismatch)**
   - **File path:** `baja411/components/Footer.tsx`
   - **Section:** Footer links array (`/signin`)
   - **Observed:** Footer includes Sign In in top-level nav list.
   - **Why it matters:** Could shift perceived emphasis away from end-user utility; strategy review item.
   - **Evidence level:** **Suspected** (product decision dependent)

3. **Location persistence may retain outdated fallback labels if future fallback options are introduced (low technical risk now)**
   - **File path:** `baja411/components/LocationProvider.tsx`
   - **Section:** `readStoredLocation`, initial hydration effect
   - **Observed:** Stored fallback locations are trusted if source is `fallback`.
   - **Why it matters:** If fallback strategy changes later, old local storage could persist old defaults.
   - **Evidence level:** **Suspected**

## Low Priority Cleanup

1. **Minor formatting inconsistency**
   - **File path:** `baja411/components/Footer.tsx`
   - **Section:** `links` array indentation
   - **Observed:** One item has mismatched indentation.
   - **Why it matters:** Cosmetic readability only.
   - **Evidence level:** **Code inspection**

2. **Comment could become stale quickly**
   - **File path:** `baja411/prisma/schema.prisma`
   - **Section:** Header comment (`Month 1 Schema`)
   - **Observed:** Time-bound comment may no longer reflect current project phase.
   - **Why it matters:** Documentation clarity.
   - **Evidence level:** **Code inspection**

## Refactor Candidates

1. **Extract shared location status presenter for weather surfaces**
   - **File path:** `baja411/components/HomeWeatherStrip.tsx`, `baja411/app/weather/page.tsx`, `baja411/components/LocationProvider.tsx`
   - **What should change:** Centralize fallback/permission/status text into a shared helper/hook.
   - **Why it helps:** Prevents drift between homepage strip and weather route behavior.
   - **Risk level:** low
   - **Recommendation:** do later
   - **Evidence:** confirmed (code duplication pattern)

2. **Split non-map utility logic from `MapClientMapLibre.tsx` into local modules**
   - **File path:** `baja411/components/MapClientMapLibre.tsx`
   - **What should change:** Move pure helpers (normalization, town/category matching, distance formatting) into dedicated utility files.
   - **Why it helps:** Reduces file complexity while preserving behavior.
   - **Risk level:** medium
   - **Recommendation:** do later (map-sensitive)
   - **Evidence:** confirmed (large multi-responsibility file)

3. **Satellite proxy hardening requires a new scoped design**
   - **File path:** `baja411/app/api/satellite/route.ts`
   - **What should change:** Do not reapply prior strict hardening as-is. Define a new scoped design, then validate behavior live to ensure satellite tools keep working.
   - **Why it helps:** Better abuse resistance and operational predictability.
   - **Risk level:** low
   - **Recommendation:** wait for explicit scoped design and live validation plan
   - **Evidence:** suspected/inspection-backed

4. **Storm parser robustness improvements**
   - **File path:** `baja411/app/api/weather/storm-status/route.ts`
   - **What should change:** More explicit parsing markers + test fixtures from known NHC payload variants.
   - **Why it helps:** Reduces false positive/negative storm states.
   - **Risk level:** medium
   - **Recommendation:** do later
   - **Evidence:** suspected

## Map Risk Review

Inspected files: `baja411/components/MapClientMapLibre.tsx`, `baja411/app/map/MapLoader.tsx`, `baja411/app/map/page.tsx`.

- **Drive Mode:** Confirmed logic exists for follow + bearing updates + snap-back timer.
- **Plan Mode:** Confirmed mode switch and search/suggestion behavior are separate from Drive follow mechanics.
- **Search:** Confirmed in-file search supports towns, categories, and pin title/description/category term matching.
- **Suggestions:** Confirmed implemented via React panel (`PlanSearchPanel`) and not DOM hacks.
- **Recenter:** Confirmed explicit `recenter()` function uses latest GPS center when available.
- **Snap back:** Confirmed via `setTimeout` after user map movement in Drive Mode.
- **Heading/bearing rotation:** Confirmed orientation listeners with smoothing and minimal-delta threshold.
- **GPS/fallback handling:** Confirmed provider center fallback + map watchPosition tracking coexist.
- **Pin rendering:** Confirmed marker rendering filtered by visible categories and search.
- **Selected pin behavior:** Confirmed marker click selects pin and can force PLAN mode.

**Risk statement:** Map behavior is heavily concentrated in one component and should be treated as high fragility for future refactors. No immediate confirmed breakage from static scan, but regression risk is high whenever touching this file.

## Weather and Location Review

Inspected files: `baja411/components/LocationProvider.tsx`, `baja411/components/HomeWeatherStrip.tsx`, `baja411/app/weather/page.tsx`.

- **GPS source of truth:** Hybrid. `LocationProvider` provides app-wide location; map also maintains its own watchPosition loop.
- **Todos Santos fallback behavior:** Confirmed fallback defaults to lat `23.4464`, lon `-110.2265`.
- **Weather page behavior:** Uses provider location and shows GPS/fallback status, includes storm/rain/satellite panels.
- **Home weather strip behavior:** Fetches Open-Meteo current weather for provider coordinates and supports “Use GPS” CTA.
- **Stale/pending/denied GPS handling:** Present in both weather surfaces; denied state handled with fallback messaging.

**Risk statement:** Dual location tracking model (provider + map-local watch) is intentional but creates coordination complexity; manual UX verification recommended.

## Emergency/SOS Review

Inspected files: `baja411/app/emergency/page.tsx`, `baja411/components/SOSButton.tsx`, `baja411/components/Nav.tsx`.

- SOS access is globally available in Nav via dedicated button linking to `/emergency`.
- Emergency page emphasizes “call 911 first” and lists 911/078/071 references with source labels.
- No automatic calling behavior detected.

**Risk:** Medium content-staleness risk over time because emergency content is hard-coded; technical reliability currently straightforward.

## Directory Review

Inspected files: `baja411/app/businesses/page.tsx`, `baja411/app/directory/page.tsx`, `baja411/components/Nav.tsx`.

- Directory remains user-facing with `/businesses` as canonical route.
- `/directory` redirects to `/businesses` (clean legacy compatibility).
- Nav exposes “Directory” prominently.

Conclusion: Directory positioning appears aligned with user-facing priority.

## Documentation Issues

1. **Validation instructions vs local environment readiness mismatch (confirmed in this environment)**
   - Docs instruct running lint/build, but local run here failed due to missing binaries/dependencies.
   - This may be environment-specific, but onboarding docs could mention dependency bootstrap expectations more explicitly.

2. **Potential role-bound guidance overlap**
   - `baja411/CLAUDE.md` is role-specific and should remain ignored by Codex except for shared context checks.
   - No direct conflict found, but maintainers should keep role-specific vs shared guidance clearly separated.

## Suspected Issues Needing Manual Reproduction

1. **Possible Drive Mode UX confusion after denied geolocation**
   - **What might be wrong:** Recenter/follow states may appear enabled but no fresh GPS updates occur.
   - **Why suspected:** Internal state toggles rely on watch callbacks; no explicit denied-state banner in map UI found in this scan.
   - **How to reproduce:** Open map on mobile browser, deny geolocation, toggle Drive/Plan, hit recenter repeatedly, observe indicators.
   - **Files likely involved:** `baja411/components/MapClientMapLibre.tsx`, `baja411/components/LocationProvider.tsx`
   - **Risk level:** high

2. **Storm status misclassification under uncommon NHC wording**
   - **What might be wrong:** Text classifier may mark monitor/alert incorrectly.
   - **Why suspected:** Keyword-only matching.
   - **How to reproduce:** Capture multiple historical NHC widget payload snapshots; run classifier and compare against official storm status.
   - **Files likely involved:** `baja411/app/api/weather/storm-status/route.ts`
   - **Risk level:** medium

3. **Satellite panel performance degradation on constrained mobile networks**
   - **What might be wrong:** Large animated GIF payloads may stall UX.
   - **Why suspected:** Multiple heavy remote assets with user-select switching.
   - **How to reproduce:** Test on throttled 3G/4G simulation and low-memory Android device; switch products rapidly.
   - **Files likely involved:** `baja411/app/weather/page.tsx`, `baja411/app/api/satellite/route.ts`
   - **Risk level:** medium

## Recommended Next Tasks

1. **Goal:** Restore runnable local validation baseline (lint/build).
   - **Files involved:** `baja411/package.json`, lockfile/tooling config, CI scripts.
   - **Risk level:** low
   - **Implement now or wait:** **Codex should implement now** (outside this scan-only task).

2. **Goal:** Add manual regression test script/checklist runs focused on Drive/Plan/recenter/snap-back.
   - **Files involved:** `baja411/MAP_REGRESSION_CHECKLIST.md` (and possibly test docs).
   - **Risk level:** low
   - **Implement now or wait:** **Codex should implement now** (docs/process only).

3. **Goal:** Add storm parser fixture-based tests and safer classification heuristics.
   - **Files involved:** `baja411/app/api/weather/storm-status/route.ts` + new test fixtures.
   - **Risk level:** medium
   - **Implement now or wait:** **Wait for explicit approval** (weather safety surface).

4. **Goal:** Plan a new scoped satellite proxy hardening design (historical recommendation updated).
   - **Files involved:** `baja411/app/api/satellite/route.ts`.
   - **Risk level:** low
   - **Implement now or wait:** **Wait for explicit approval after scoped design and live validation plan**.

5. **Goal:** Unify weather location status logic to reduce drift.
   - **Files involved:** `baja411/components/HomeWeatherStrip.tsx`, `baja411/app/weather/page.tsx`, shared helper.
   - **Risk level:** low
   - **Implement now or wait:** **Do later**.
