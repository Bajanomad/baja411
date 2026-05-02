# Sur Compass

Sur Compass is a map-first Baja California Sur field utility focused on practical, real-world needs under mobile and low-signal constraints.

## Stack
- React + Vite
- React Router
- Foundation for map/search, directory, weather, emergency, rules, submit, moderation

## Run
```bash
cd baja-field-tool
npm install
npm run dev
```

## Routes
- /map
- /weather
- /directory
- /emergency
- /rules
- /submit
- /admin

## Product Notes
- User-first for people driving or coordinating in Baja Sur.
- Directory starts trust-first with verification labels.
- Submission flow defaults to moderated publish.
- GPS-denied fallback coordinate is provided in map experience.

## Roadmap
1. Replace mock map list with live map provider + clustered pins.
2. Add persistent store (Postgres + PostGIS).
3. Implement real weather/storm provider adapters.
4. Build contributor trust and moderation queues.
