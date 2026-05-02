# Baja411 Repo Map

Read this first before making changes.

## Root rule

The repository root is the Next.js app root.

- Routes: `app/`
- Components: `components/`
- Data: `data/`
- Prisma: `prisma/`
- Vendor: `vendor/`

## Product rule

1. User first
2. CEO/business strategy second
3. Engineering execution third

## Priorities

Keep SOS emergency access clean and reliable; protect map behavior; keep weather/storm tools useful; preserve Drive Mode heading, bearing, recenter, and snap-back behavior; keep directory user-facing.

## High-risk files

- `components/MapClientMapLibre.tsx`
- `app/map/MapLoader.tsx`
- `components/LocationProvider.tsx`
- `app/weather/page.tsx`
- `components/HomeWeatherStrip.tsx`
- `app/emergency/page.tsx`
- `prisma/schema.prisma`

`app/map/MapSearchEnhancer.tsx` was removed and is not current architecture.

## Safety rules

- SOS is a global emergency layer.
- Weather should remain useful in-app.
- Directory remains verified-data focused.
- Fallback location: Todos Santos, BCS (`23.4464`, `-110.2265`).

## Map ownership

Primary map ownership lives in `components/MapClientMapLibre.tsx`.
Use `MAP_REGRESSION_CHECKLIST.md` before/after map-related changes.

## Validation

Run from repo root:

```bash
npm run lint
npm run build
```
