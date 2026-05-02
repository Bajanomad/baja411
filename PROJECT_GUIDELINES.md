# Baja411 Project Guidelines

Baja411 is a map-first Baja California Sur field tool for travelers, locals, expats, boondockers, and people who need useful Baja information fast.

It is a practical field utility, not a generic tourism site.

## Working order

Think in this order before changing anything:

1. User first
2. Engineer second
3. CEO third

Start with why a real person would care. Do not start with code cleverness.

## Stack and deployment

Repo: `Bajanomad/baja411`.

Actual app directory: repo root.

Do not assume app files are at the repository root.

Stack: Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth, MapLibre GL, GitHub, and Vercel.

GitHub is the code source of truth. Vercel is the live deployment path.

## Workflow model

ChatGPT or Claude is the product brain for strategy, UX review, architecture review, prompt writing, diff review, decision support, and small scoped patches when appropriate.

Codex or Claude Code handles larger repo work, bigger patches, build fixes, validation, implementation, and deeper file editing.

Do not have multiple agents rewrite the same area blindly.

## Required repo context

Everyone should read `REPO_MAP.md` first.

Before repo advice, agent prompts, code review, patches, or implementation guidance, prioritize:

1. `REPO_MAP.md`
2. `docs/MASTERPLAN.md`
3. The correct agent instruction file when relevant
4. The exact files being changed

Codex should read `REPO_MAP.md`, `AGENTS.md` if present, `AGENTS.md` at repo root if present, and exact files being changed.

Claude Code should read `REPO_MAP.md`, `CLAUDE.md` if present, and exact files being changed.

If instructions conflict, stop and report the conflict instead of guessing.

## Current implementation notes

1. Native forecast UI is inside `app/weather/page.tsx`.
2. Native forecast uses Open-Meteo data.
3. Forecast modes are Today, 7 Day, and 16 Day.
4. Windy remains for rain, wind, storm, and satellite visual map tools.
5. Do not replace the native forecast panel with the old Windy forecast iframe.
6. On iPhone, directory Enter/Search dismisses the keyboard by blurring the real input in `components/BusinessDirectoryClient.tsx`.
7. Satellite proxy behavior in `app/api/satellite/route.ts` was rolled back to known working behavior after stricter hardening broke satellite tools.
8. Public business submissions live at `/businesses/submit`, require login, create `PENDING` business records, and public directory output remains `APPROVED` only.
9. Public business submit location choices are `Use my location`, `Input location`, and `Has no location`.
10. `app/map/MapSearchEnhancer.tsx` was removed and should not be treated as current architecture.

## Current priorities

1. Keep SOS emergency access clean and reliable.
2. Protect map behavior.
3. Keep weather and storm tools useful inside Baja411.
4. Improve Plan Mode search suggestions only when scoped.
5. Preserve Drive Mode heading, bearing, recenter, and snap-back behavior.
6. Improve Local Directory usefulness with verified data.
7. Keep navigation and footer clean.
8. Keep the directory user-facing, not sales-first.

## High-risk areas

1. Map behavior
2. Drive Mode heading and bearing rotation
3. Recenter behavior
4. Plan Mode search
5. GPS and fallback location
6. Weather and storm tools
7. SOS emergency access
8. Auth
9. Prisma
10. Vercel config and environment variables

## Map rule

The map is the killer feature. Do not casually change Drive Mode, Plan Mode, heading rotation, recenter, GPS tracking, search, pin rendering, add pin flow, or selected pin behavior.

Do not use MutationObserver hacks, polling loops, injected fake buttons, hidden CSS hacks, or broad rewrites.

Use `MAP_REGRESSION_CHECKLIST.md` before and after map changes.

## Emergency rule

SOS is a global safety layer, not a directory category.

Emergency information must be verified before publishing. Do not publish guessed phone numbers or unverified municipal numbers.

SOS should open emergency information first and should not auto-call emergency services.

## Directory rule

Keep main categories light. Use subcategories and tags for detail.

Do not start with payments, ads, or business owner dashboards.

Build usefulness, trust, verification, corrections, WhatsApp access, phone access, hours, service area, and map linking first.

Public business submissions should create `PENDING` records. Public directory should show `APPROVED` businesses only. Emergency listings should not be accepted through normal public business submissions.

## Weather rule

Keep weather useful inside Baja411. Prioritize forecast, rain, storms, satellite, and hurricane tracking.

External NOAA or NHC links should not be the primary user flow unless there is no better internal option.

Do not replace native forecast UI with old iframe behavior unless explicitly requested and justified.

## Location rule

Use GPS when available.

Fallback location is Todos Santos, BCS:

```txt
lat 23.4464
lon -110.2265
```

The app must handle denied, unavailable, stale, and pending GPS gracefully.

`LocationProvider` should become the shared source of truth where practical.

## Validation rule

Every Codex or Claude Code task that changes app code should attempt:

```bash
npm run lint
npm run build
```

Agents must not claim validation passed unless it actually passed.

If tooling is missing, report exactly:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```

Documentation-only changes do not require lint/build unless app code changed.

## Audit file rule

Any time the user asks for a morning checklist, night audit, repo audit, daily cleanup, end-of-day review, status summary, or “what did we do today” workflow for Baja411, the agent prompt must require a permanent dated markdown report in the repo unless the user explicitly says not to write files.

Default paths:

1. Morning audits: `docs/morning_audits/YYYY_MM_DD_morning_audit.md`
2. Night audits: `docs/night_audits/YYYY_MM_DD_night_audit.md`

The prompt must require creating the folder if missing, writing completed audit findings into the file, committing the file, not rerunning the audit if only the file is missing, and final response with file path, commit SHA, docs-only/app-code status, and summary.

Required audit sections: date, purpose, recent merged PR summary, open PR status, deployment/Vercel status if checked, files inspected, bugs found, dead or duplicate code found, validation results, recommended next task, files changed.

“Output required” is not enough; require a dated markdown file created or updated and committed.

## Daily workflow

Review merged PRs; check live site behavior; scan Vercel/build status; look for bugs; find dead or duplicate code; refactor only what actually needs it; pick the next feature.

Do not refactor just because code looks ugly. Refactor only when it removes real risk, real duplication, or real confusion.

## Document separation rule

Before writing any instruction, prompt, checklist, summary, or document, decide what it is for: ChatGPT project behavior, Codex task prompt, Claude Code task prompt, repo documentation, product decision summary, or diff review.

Do not mix these into one document.

## Safety rails

Read first; understand ownership; patch the smallest safe area; avoid broad rewrites; avoid changing working behavior; validate honestly; update `REPO_MAP.md` when architecture changes.

Do not stack new behavior on mystery behavior. Do not change working map behavior just to make code cleaner. Do not publish guessed emergency data. Do not move the business directory toward monetization before usefulness and trust are strong. Do not touch Vercel, auth, Prisma, or environment variables casually.
