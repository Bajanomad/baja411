# Baja411 Mobile Roadmap

Current status:
Baja411 is currently a mobile-first web app deployed through Vercel.
The app code lives in baja411/.
There is no native iOS/Android app yet.
There is no Capacitor or Expo app yet.
There is no repo restructure yet.

Recommended path:

Phase 1: Strengthen mobile web experience.
Map must feel reliable on iPhone Safari and Android Chrome.
Drive Mode must track location cleanly.
Plan Mode search suggestions must work.
Center me must be smooth.
Weather must stay useful in-app.
Business directory must be useful and searchable.

Phase 2: Add PWA basics.
manifest
icons
theme color
safe-area handling
installable web app polish
offline fallback for basic pages
document mobile browser quirks

Phase 3: Capacitor evaluation.
Use Capacitor only when the web app is strong enough to wrap.
Native value should include GPS permissions, better location handling, push alerts, saved/offline pins, native share/deep links, and app icon/splash.

Phase 4: Possible future monorepo structure.
If/when mobile starts, consider moving toward:

apps/web
apps/mobile
packages/shared

Do not move baja411/ to repo root as a temporary cleanup.
If restructuring happens, move intentionally into the multi-app structure, not into a single-app root layout.

Phase 5: Expo/React Native only if needed.
Consider Expo/React Native later if the product needs deeper native behavior than Capacitor can provide.
