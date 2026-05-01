# Baja411 App

This folder contains the real Baja411 Next.js app.

Run app commands from this directory:

```bash
cd baja411
```

## Stack

- Next.js
- React
- TypeScript strict mode
- Tailwind CSS
- Prisma
- PostgreSQL
- MapLibre GL
- NextAuth vendored under `vendor/`

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Required reading before edits

1. `REPO_MAP.md`
2. `AGENTS.md` for Codex or OpenAI coding agents
3. `CLAUDE.md` for Claude Code
4. The exact files being changed

## High-risk app areas

Treat these as high risk:

- `components/MapClientMapLibre.tsx`
- `app/map/MapLoader.tsx`
- `components/LocationProvider.tsx`
- `app/weather/page.tsx`
- `components/HomeWeatherStrip.tsx`
- `app/emergency/page.tsx`
- `prisma/schema.prisma`

Do not casually change map behavior, GPS behavior, Drive Mode, Plan Mode, heading rotation, recenter behavior, snap-back behavior, auth, Prisma, Vercel config, or environment variables.

## Map architecture

Primary map ownership lives in:

```txt
components/MapClientMapLibre.tsx
```

Map behavior is high risk. Use `MAP_REGRESSION_CHECKLIST.md` before and after map-related changes.

`app/map/MapSearchEnhancer.tsx` has been removed and should not be treated as current architecture.

## Weather architecture

Current weather architecture:

- Native forecast UI: `app/weather/page.tsx`
- Forecast data source: Open-Meteo
- Forecast modes: Today, 7 Day, 16 Day
- Windy remains focused on visual weather tools: rain, wind, storms, and satellite layers

Do not replace the native forecast panel with the old Windy forecast iframe unless explicitly requested and justified.

## Location behavior

`components/LocationProvider.tsx` is the shared location source where practical.

Fallback location:

```txt
Todos Santos, BCS
lat: 23.4464
lon: -110.2265
```

The app must handle denied, unavailable, stale, and pending GPS gracefully.

## Directory behavior

Public business submissions live at:

```txt
app/businesses/submit
```

Submission API:

```txt
app/api/businesses/route.ts
```

Rules:

- Public submissions require login.
- Public submissions create `PENDING` records.
- Public directory shows `APPROVED` businesses only.
- Emergency listings should not be accepted through normal public business submissions.
- The public submit location choices are `Use my location`, `Input location`, and `Has no location`.

## Validation

For app code changes, run:

```bash
cd baja411
npm run lint
npm run build
```

Documentation-only changes do not require lint or build unless app code changed.

Do not claim validation passed unless it actually passed.

If local tooling is unavailable, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```
