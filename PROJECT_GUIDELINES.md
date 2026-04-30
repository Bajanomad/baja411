# Baja411 Project Guidelines

Baja411 is a map first Baja California Sur field tool for travelers, locals, expats, boondockers, and people who need useful Baja information fast.

## Working order

Think in this order:

1. End user need
2. CEO and business strategy
3. Engineering execution

Start with why a real person would care.

## Stack and deployment

Baja411 uses Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth, MapLibre GL, GitHub, and Vercel.

The actual app is inside:

```txt
baja411/
```

GitHub is the code source of truth.

Vercel is the live deployment path.

## Workflow model

ChatGPT or Claude is the brains, depending on which chat is being used.

The chat assistant handles product strategy, UX review, architecture review, prompt writing, diff review, decision support, and small scoped patches when appropriate.

Codex or Claude Code handles larger repo work, bigger patches, build fixes, validation, and complex implementation.

Do not have multiple agents rewrite the same area blindly.

## Required repo context

Everyone should read:

1. `baja411/REPO_MAP.md`
2. The correct agent instruction file when an agent is being used
3. The exact files being changed

Codex should read `baja411/AGENTS.md`.

Claude Code should read `baja411/CLAUDE.md`.

If instructions conflict, stop and report the conflict instead of guessing.

## Current weather and directory implementation notes

1. Native forecast UI is inside `baja411/app/weather/page.tsx`.
2. Native forecast uses Open-Meteo data.
3. Forecast modes: Today, 7 Day, 16 Day.
4. Windy remains for rain, wind, storm, and satellite visual map tools.
5. Do not replace the native forecast panel with the old Windy forecast iframe.
6. On iPhone, directory Enter/Search dismisses the keyboard by blurring the real input in `baja411/components/BusinessDirectoryClient.tsx`.
7. Satellite proxy behavior in `baja411/app/api/satellite/route.ts` was rolled back to known working behavior after stricter hardening broke satellite tools.

## Current priorities

1. Keep SOS emergency access clean and reliable
2. Protect map behavior
3. Keep weather and storm tools useful inside Baja411
4. Improve Plan Mode search suggestions when scoped
5. Preserve Drive Mode heading, bearing, recenter, and snap back behavior
6. Improve Local Directory usefulness with verified data
7. Keep navigation and footer clean
8. Keep the directory user facing, not sales first

## High risk areas

1. Map behavior
2. Drive Mode heading and bearing rotation
3. Recenter behavior
4. Plan Mode search
5. GPS and fallback location
6. Weather and storm tools
7. SOS emergency access
8. Auth
9. Prisma
10. Vercel and environment variables

## Map rule

The map is the killer feature. Do not casually change Drive Mode, Plan Mode, heading rotation, recenter, GPS tracking, search, pin rendering, add pin flow, or selected pin behavior.

Do not use MutationObserver hacks, polling loops, injected fake buttons, hidden CSS hacks, or broad rewrites.

## Emergency rule

SOS is a global safety layer, not a directory category.

Emergency information must be verified before publishing.

Do not publish guessed phone numbers or unverified municipal numbers.

## Directory rule

Keep main categories light.

Use subcategories and tags for detail.

Do not start with payments, ads, or business owner dashboards.

Build usefulness, trust, verification, corrections, WhatsApp and phone access, hours, service area, and map linking first.

## Weather rule

Keep weather useful inside Baja411.

Prioritize forecast, rain, storms, satellite, and hurricane tracking.

External NOAA or NHC links should not be the primary user flow unless there is no better internal option.

## Location rule

Use GPS when available.

Fallback location is Todos Santos, BCS:

```txt
lat 23.4464
lon -110.2265
```

The app must handle denied, unavailable, stale, or pending GPS gracefully.

## Validation

Agents should attempt:

```bash
cd baja411 && npm run lint
cd baja411 && npm run build
```

Agents must not claim validation passed unless it actually passed.

If tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```
