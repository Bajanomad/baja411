"use client";

import maplibregl from "maplibre-gl";
import { useEffect } from "react";

const TOWN_SUGGESTIONS = [
  "La Paz",
  "Todos Santos",
  "El Pescadero",
  "Cerritos",
  "Cabo San Lucas",
  "San Jose del Cabo",
  "San José del Cabo",
  "Loreto",
  "Los Barriles",
  "La Ventana",
  "El Sargento",
  "Santiago",
  "Miraflores",
];

const CATEGORY_SUGGESTIONS = [
  "Fuel",
  "Gas station",
  "Water fill",
  "Beach",
  "Boondocking",
  "Dump station",
  "Mechanic",
  "Trailhead",
  "Fishing",
  "Market",
];

const SUGGESTIONS = [...TOWN_SUGGESTIONS, ...CATEGORY_SUGGESTIONS];
const ROTATION_BUTTON_ID = "baja411-drive-rotation-button";
const HEADING_CADENCE_MS = 3000;

const SEARCH_ALIASES: Record<string, string> = {
  lapaz: "La Paz",
  "la paz": "La Paz",
  paz: "La Paz",
  pescadero: "El Pescadero",
  "el pescadero": "El Pescadero",
  cerritos: "Cerritos",
  "playa cerritos": "Cerritos",
  todos: "Todos Santos",
  "todos santos": "Todos Santos",
  cabo: "Cabo San Lucas",
  "cabo san lucas": "Cabo San Lucas",
  sanjose: "San José del Cabo",
  "san jose": "San José del Cabo",
  "san jose del cabo": "San José del Cabo",
  sjc: "San José del Cabo",
  gas: "Gas station",
  gasolina: "Gas station",
  gasolinera: "Gas station",
  pemex: "Gas station",
  diesel: "Gas station",
  fuel: "Fuel",
  agua: "Water fill",
  water: "Water fill",
  "water fill": "Water fill",
  beach: "Beach",
  playa: "Beach",
  mecanico: "Mechanic",
  mechanic: "Mechanic",
  taller: "Mechanic",
  mercado: "Market",
  market: "Market",
  tienda: "Market",
};

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type RotationPatch = {
  maps: Set<maplibregl.Map>;
  originalEaseTo: maplibregl.Map["easeTo"];
};

type BajaWindow = Window & {
  __baja411HeadingActive?: boolean;
  __baja411InternalRecenter?: boolean;
  __baja411LatestRawHeading?: number | null;
  __baja411LastRawHeadingAt?: number;
  __baja411RotationPatch?: RotationPatch;
  __baja411SmoothedHeading?: number | null;
  __baja411LastHeadingUpdate?: number;
};

function bajaWindow() {
  return window as BajaWindow;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function applySearchAlias(input: HTMLInputElement) {
  const alias = SEARCH_ALIASES[normalize(input.value)];
  if (alias && alias !== input.value) {
    setReactInputValue(input, alias);
  }
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function headingDifference(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

function smoothHeading(current: number | null, next: number) {
  if (current === null) return normalizeDegrees(next);
  return normalizeDegrees(current + headingDifference(current, next) * 0.35);
}

function getHeading(event: DeviceOrientationEventWithCompass) {
  if (typeof event.webkitCompassHeading === "number") return normalizeDegrees(event.webkitCompassHeading);
  if (typeof event.alpha === "number") return normalizeDegrees(360 - event.alpha);
  return null;
}

function setReactInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function removeOldCompassControl() {
  document.getElementById("baja411-drive-compass-button")?.remove();
}

function installRotationPatch() {
  const win = bajaWindow();
  if (win.__baja411RotationPatch) return win.__baja411RotationPatch;

  const proto = maplibregl.Map.prototype;
  const originalEaseTo = proto.easeTo;
  const patch: RotationPatch = {
    maps: new Set<maplibregl.Map>(),
    originalEaseTo,
  };

  proto.easeTo = function patchedEaseTo(this: maplibregl.Map, ...args: Parameters<maplibregl.Map["easeTo"]>) {
    patch.maps.add(this);
    const [options, eventData] = args;

    if (options && typeof options === "object" && "bearing" in options) {
      const nextOptions = { ...options };
      delete nextOptions.bearing;
      return originalEaseTo.call(this, nextOptions, eventData);
    }

    return originalEaseTo.call(this, ...args);
  } as maplibregl.Map["easeTo"];

  win.__baja411RotationPatch = patch;
  return patch;
}

function resetMapBearing() {
  const patch = bajaWindow().__baja411RotationPatch;
  if (!patch) return;

  patch.maps.forEach((map) => {
    try {
      patch.originalEaseTo.call(map, { bearing: 0, duration: 350, essential: true });
    } catch {
      patch.maps.delete(map);
    }
  });
}

async function requestHeadingPermission() {
  const OrientationEvent = window.DeviceOrientationEvent as DeviceOrientationEventWithPermission | undefined;
  if (!OrientationEvent || typeof OrientationEvent.requestPermission !== "function") return true;

  try {
    const result = await OrientationEvent.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

function isDriveModeActive() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
  const driveButton = buttons.find((button) => button.textContent?.trim() === "Drive");
  return Boolean(driveButton?.className.includes("bg-jade"));
}

function forceGpsRecenter() {
  if (!isDriveModeActive()) return;

  const win = bajaWindow();
  const recenterButton = document.querySelector<HTMLButtonElement>('button[aria-label="Recenter"]');
  if (!recenterButton) return;

  win.__baja411InternalRecenter = true;
  recenterButton.click();
  window.setTimeout(() => {
    win.__baja411InternalRecenter = false;
  }, 150);
}

function syncRotationButton(button: HTMLButtonElement) {
  const active = bajaWindow().__baja411HeadingActive === true;
  button.style.background = active ? "rgba(42, 122, 90, 0.96)" : "rgba(255, 255, 255, 0.96)";
  button.style.color = active ? "#fff" : "#111827";
  button.setAttribute("aria-label", active ? "Disable heading rotation" : "Enable heading rotation");
}

function styleRotationButton(button: HTMLButtonElement) {
  button.style.position = "absolute";
  button.style.right = "12px";
  button.style.bottom = "76px";
  button.style.zIndex = "1500";
  button.style.width = "52px";
  button.style.height = "52px";
  button.style.borderRadius = "999px";
  button.style.border = "1px solid rgba(15, 23, 42, 0.14)";
  button.style.boxShadow = "0 14px 34px rgba(15, 23, 42, 0.18)";
  button.style.backdropFilter = "blur(18px)";
  button.style.setProperty("-webkit-backdrop-filter", "blur(18px)");
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.fontSize = "24px";
  button.style.lineHeight = "1";
  button.style.cursor = "pointer";
  button.style.userSelect = "none";
  button.style.touchAction = "manipulation";
  button.textContent = "↻";
  button.title = "Heading rotation";
  syncRotationButton(button);
}

function disableHeadingRotation(button?: HTMLButtonElement | null) {
  const win = bajaWindow();
  win.__baja411HeadingActive = false;
  win.__baja411LatestRawHeading = null;
  win.__baja411LastRawHeadingAt = 0;
  win.__baja411SmoothedHeading = null;
  win.__baja411LastHeadingUpdate = 0;
  resetMapBearing();
  if (button) syncRotationButton(button);
}

function applyLiveHeading(rawHeading: number) {
  const win = bajaWindow();
  if (win.__baja411HeadingActive !== true || !isDriveModeActive()) return;

  const patch = installRotationPatch();
  if (patch.maps.size === 0) {
    forceGpsRecenter();
    return;
  }

  const previous = win.__baja411SmoothedHeading ?? null;
  const smoothed = smoothHeading(previous, rawHeading);

  win.__baja411SmoothedHeading = smoothed;
  win.__baja411LastHeadingUpdate = performance.now();

  patch.maps.forEach((map) => {
    try {
      patch.originalEaseTo.call(map, { bearing: smoothed, duration: 650, essential: true });
    } catch {
      patch.maps.delete(map);
    }
  });
}

function applyStoredHeading() {
  if (!isDriveModeActive()) return;

  const heading = bajaWindow().__baja411LatestRawHeading;
  if (typeof heading !== "number") return;
  applyLiveHeading(heading);
}

function handleLiveHeading(event: DeviceOrientationEvent) {
  const heading = getHeading(event as DeviceOrientationEventWithCompass);
  if (heading === null) return;

  const win = bajaWindow();
  win.__baja411LatestRawHeading = heading;
  win.__baja411LastRawHeadingAt = performance.now();

  if (win.__baja411HeadingActive === true && win.__baja411SmoothedHeading === null) {
    applyLiveHeading(heading);
  }
}

function refreshHeadingListeners() {
  window.removeEventListener("deviceorientationabsolute", handleLiveHeading, true);
  window.removeEventListener("deviceorientation", handleLiveHeading, true);
  window.addEventListener("deviceorientationabsolute", handleLiveHeading, true);
  window.addEventListener("deviceorientation", handleLiveHeading, true);
}

async function enableHeadingRotation(button: HTMLButtonElement) {
  const granted = await requestHeadingPermission();
  if (!granted) {
    disableHeadingRotation(button);
    return;
  }

  const win = bajaWindow();
  win.__baja411HeadingActive = true;
  win.__baja411SmoothedHeading = null;
  win.__baja411LastHeadingUpdate = 0;
  syncRotationButton(button);
  refreshHeadingListeners();
  forceGpsRecenter();
  window.setTimeout(applyStoredHeading, 250);
}

function ensureRotationToggle() {
  installRotationPatch();
  removeOldCompassControl();

  let button = document.getElementById(ROTATION_BUTTON_ID) as HTMLButtonElement | null;
  if (!button) {
    const rotationButton = document.createElement("button");
    rotationButton.id = ROTATION_BUTTON_ID;
    rotationButton.type = "button";
    styleRotationButton(rotationButton);

    rotationButton.addEventListener("click", async (event) => {
      const targetButton = event.currentTarget as HTMLButtonElement;
      event.preventDefault();
      event.stopPropagation();

      if (bajaWindow().__baja411HeadingActive === true) {
        disableHeadingRotation(targetButton);
        return;
      }

      await enableHeadingRotation(targetButton);
    });

    document.querySelector(".relative.h-full.w-full.overflow-hidden")?.appendChild(rotationButton);
    button = rotationButton;
  }

  const driveActive = isDriveModeActive();
  button.hidden = !driveActive;

  if (!driveActive) {
    disableHeadingRotation(button);
    return;
  }

  syncRotationButton(button);
}

function markGpsButton() {
  const button = document.querySelector<HTMLButtonElement>('button[aria-label="Recenter"]');
  if (!button || button.dataset.gpsToggleEnhanced === "1") return;

  button.dataset.gpsToggleEnhanced = "1";
  button.title = "Center on GPS";
}

export default function MapSearchEnhancer() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let timer: number | null = null;
    let headingCadenceTimer: number | null = null;

    function attachSearch() {
      const input = document.querySelector<HTMLInputElement>('input[placeholder="Search towns, fuel, water, beaches"]');
      const form = input?.closest("form") as HTMLFormElement | null;
      if (!input || !form || form.dataset.searchEnhanced === "1") return false;

      const searchInput = input;
      const searchForm = form;

      searchForm.dataset.searchEnhanced = "1";
      searchForm.classList.add("map-plan-search");

      const panel = document.createElement("div");
      panel.className = "map-search-suggestions";
      panel.hidden = true;
      searchForm.appendChild(panel);

      function showSuggestions() {
        const query = normalize(searchInput.value);
        const matches = SUGGESTIONS.filter((item) => normalize(item).startsWith(query) || normalize(item).includes(query)).slice(0, 5);
        panel.innerHTML = "";

        if (!query || matches.length === 0) {
          panel.hidden = true;
          return;
        }

        matches.forEach((match) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "map-search-suggestion";
          button.textContent = match;
          button.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            applySearchAlias(searchInput);
            setReactInputValue(searchInput, match);
            panel.hidden = true;
            window.setTimeout(() => searchForm.requestSubmit(), 0);
          });
          panel.appendChild(button);
        });

        panel.hidden = false;
      }

      function submitSearchFromKeyboard(event: KeyboardEvent) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        applySearchAlias(searchInput);
        panel.hidden = true;
        searchInput.blur();
        window.setTimeout(() => searchForm.requestSubmit(), 0);
      }

      function normalizeSearchBeforeSubmit() {
        applySearchAlias(searchInput);
        panel.hidden = true;
      }

      function openSearch() {
        searchForm.classList.add("map-plan-search-open");
        window.setTimeout(() => searchInput.focus(), 60);
      }

      function maybeCloseSearch() {
        window.setTimeout(() => {
          if (searchForm.contains(document.activeElement) || searchInput.value.trim()) return;
          searchForm.classList.remove("map-plan-search-open");
          panel.hidden = true;
        }, 120);
      }

      searchForm.addEventListener("click", openSearch);
      searchInput.addEventListener("keydown", submitSearchFromKeyboard);
      searchForm.addEventListener("submit", normalizeSearchBeforeSubmit);
      searchInput.addEventListener("focus", openSearch);
      searchInput.addEventListener("input", showSuggestions);
      searchInput.addEventListener("blur", maybeCloseSearch);
      searchForm.addEventListener("focusout", maybeCloseSearch);

      cleanup = () => {
        searchForm.removeEventListener("click", openSearch);
        searchInput.removeEventListener("keydown", submitSearchFromKeyboard);
        searchForm.removeEventListener("submit", normalizeSearchBeforeSubmit);
        searchInput.removeEventListener("focus", openSearch);
        searchInput.removeEventListener("input", showSuggestions);
        searchInput.removeEventListener("blur", maybeCloseSearch);
        searchForm.removeEventListener("focusout", maybeCloseSearch);
        panel.remove();
        searchForm.classList.remove("map-plan-search", "map-plan-search-open");
        delete searchForm.dataset.searchEnhanced;
      };

      return true;
    }

    const observer = new MutationObserver(() => {
      attachSearch();
      markGpsButton();
      ensureRotationToggle();
    });

    timer = window.setInterval(() => {
      attachSearch();
      markGpsButton();
      ensureRotationToggle();
    }, 250);

    headingCadenceTimer = window.setInterval(applyStoredHeading, HEADING_CADENCE_MS);

    bajaWindow().__baja411HeadingActive = false;
    bajaWindow().__baja411InternalRecenter = false;
    bajaWindow().__baja411LatestRawHeading = null;
    refreshHeadingListeners();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    attachSearch();
    markGpsButton();
    ensureRotationToggle();

    return () => {
      if (timer !== null) window.clearInterval(timer);
      if (headingCadenceTimer !== null) window.clearInterval(headingCadenceTimer);
      observer.disconnect();
      window.removeEventListener("deviceorientationabsolute", handleLiveHeading, true);
      window.removeEventListener("deviceorientation", handleLiveHeading, true);
      disableHeadingRotation(document.getElementById(ROTATION_BUTTON_ID) as HTMLButtonElement | null);
      document.getElementById(ROTATION_BUTTON_ID)?.remove();
      removeOldCompassControl();
      cleanup?.();
    };
  }, []);

  return null;
}
