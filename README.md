# Baja411

Baja411 is a map-first field utility for Baja California Sur travelers, locals, expats, and overland drivers.

## Repository structure

This repository is nested:

- Repository root: shared documentation, process notes, and planning artifacts.
- Real app: `baja411/` (Next.js app, routes, components, APIs, and config).

Do not assume app files are at repository root.

## Current product notes (April 2026)

- Native forecast UI lives in `baja411/app/weather/page.tsx`.
- Forecast data uses Open-Meteo.
- Forecast modes include Today, 7 Day, and 16 Day.
- Windy remains in use for rain, wind, storm, and satellite visual map tools.
- Do not replace the native forecast panel with the old Windy forecast iframe.
- Directory search on iPhone dismisses the keyboard on Enter/Search by blurring the real input in `baja411/components/BusinessDirectoryClient.tsx`.
- Satellite proxy behavior was rolled back to the known working behavior after stricter hardening broke satellite tools.
- Map behavior remains high risk and should not be casually edited.
- SOS emergency behavior remains high priority and must stay reliable.

## Read before changing anything

1. `PROJECT_GUIDELINES.md`
2. `baja411/REPO_MAP.md`
3. `baja411/AGENTS.md` (Codex/OpenAI coding agents)
4. `baja411/CLAUDE.md` (Claude/Claude Code)
