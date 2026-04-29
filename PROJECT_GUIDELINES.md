# Baja411 Project Guidelines

## Mission

Baja411 is a map first Baja California Sur utility app. It is not a generic tourism site. It is a practical field tool.

## Core user value

1. Fast map based local information
2. Drive mode and plan mode map usage
3. Weather, storms, satellite, and hurricane awareness
4. Business and service discovery
5. Community pins and local intel

## Thinking order

1. End user need first
2. CEO and business strategy second
3. Engineering execution third

## Agent roles

**ChatGPT:**
Product strategy, architecture review, Codex prompts, diff review, user experience critique, decision support.

**Codex:**
Focused code execution, small safe patches, commits, build fixes, scoped refactors only.

**Claude and Claude Code:**
Deep investigation, careful implementation, code review, and following `AGENTS.md` and `CLAUDE.md`.

## Repo structure

**Repository:** `Bajanomad/baja411`

**Actual app:** `baja411/`

Start every code session by reading:

- `baja411/REPO_MAP.md`

## Current priority

The map is the killer feature.

Focus areas:

- Plan Mode search suggestions.
- Drive Mode heading and bearing rotation.
- Smooth center me behavior.
- Clean footer and navigation.
- Weather tools inside Baja411 where possible.
- Business directory as user utility first.

## Map rules

Main map file:

- `baja411/components/MapClientMapLibre.tsx`

Important support files:

- `baja411/app/map/MapLoader.tsx`
- `baja411/app/map/MapSearchEnhancer.tsx`
- `baja411/components/LocationProvider.tsx`

`MapSearchEnhancer` currently controls more than search, including search UI, suggestions, recenter behavior, heading rotation, orientation permission, MapLibre `easeTo` patching, and heading cadence.

Do not casually edit bearing or heading logic.

Do not add hacky fixes such as MutationObserver behavior, polling loops, injected fake controls, hidden CSS pretending to be architecture, or full file rewrites without reading the whole file.

## Location rules

- Use GPS when available.
- Fallback to Todos Santos, BCS.
- Use the existing fallback coordinates from `REPO_MAP.md` unless that file is updated.

## Weather rules

- Weather should stay useful inside Baja411.
- External NOAA or NHC links are fallback and attribution, not the primary user flow.
- Avoid ugly iframe based UX when cleaner internal proxy or image based options are possible.

## Business directory rules

- User utility first.
- Do not start with payments.
- Build trust, coverage, verification, corrections, and map linking first.

## Coding rules

Before editing code:

- Read the relevant file.
- Read `REPO_MAP.md`.
- Understand ownership of the behavior.
- Patch the smallest safe part.
- Avoid broad rewrites.
- Run lint and build when practical.
- Update `REPO_MAP.md` when architecture changes.

## Deployment rules

- GitHub is source of truth.
- Vercel is deployment path.
- Be careful with anything affecting builds, environment variables, routes, auth, or database access.


## Mobile architecture note

Do not restructure the repo for mobile until there is an approved mobile architecture plan.
Future mobile structure should likely be `apps/web`, `apps/mobile`, and `packages/shared`.
