# Baja411 App (Nested Next.js Project)

This folder contains the real Baja411 app.

## App root

Run all app commands from:

```bash
cd baja411
```

## Stack

- Next.js
- React
- TypeScript (strict)
- Tailwind CSS
- Prisma
- MapLibre GL
- NextAuth (vendored under `vendor/`)

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Current weather architecture

- Native weather page: `app/weather/page.tsx`
- Forecast source: Open-Meteo
- Forecast modes: Today, 7 Day, 16 Day
- Windy usage remains focused on map-style weather visual tools (rain, wind, storms, satellite)
- Do not reintroduce the old Windy forecast iframe as the primary forecast panel

## Current directory UX note

- `components/BusinessDirectoryClient.tsx` includes the iPhone Enter/Search keyboard dismissal fix by blurring the real input.

## Risk reminders

- Map behavior is high risk (`components/MapClientMapLibre.tsx`, related map flow).
- SOS emergency behavior is high priority and must remain reliable.

## Import alias

```json
"@/*": ["./*"]
```

## Required reading before edits

1. `REPO_MAP.md`
2. `AGENTS.md` (Codex/OpenAI coding agents)
3. `CLAUDE.md` (Claude/Claude Code)
4. The exact files you plan to modify
