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

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function headingDifference(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

function smoothHeading(current: number | null, next: number) {
  if (current === null) return normalizeDegrees(next);
  return normalizeDegrees(current + headingDifference(current, next) * 0.16);
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

    if (!win.__baja411HeadingActive && options && typeof options === "object" && "bearing" in options) {
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

function isGpsFollowing() {
  const recenterButton = document.querySelector<HTMLButtonElement>('button[aria-label="Recenter"]');
  return Boolean(recenterButton?.className.includes("text-jade"));
}

function ensureGpsFollow() {
  const recenterButton = document.querySelector<HTMLButtonElement>('button[aria-label="Recenter"]');
  if (!recenterButton || isGpsFollowing()) return;
  recenterButton.click();
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
  win.__baja411SmoothedHeading = null;
  win.__baja411LastHeadingUpdate = 0;
  resetMapBearing();
  if (button) syncRotationButton(button);
}

function applyLiveHeading(rawHeading: number) {
  const win = bajaWindow();
  if (win.__baja411HeadingActive !== true || !isDriveModeActive() || !isGpsFollowing()) return;

  const now = performance.now();
  const lastUpdate = win.__baja411LastHeadingUpdate ?? 0;
  if (now - lastUpdate < 110) return;

  const previous = win.__baja411SmoothedHeading ?? null;
  const smoothed = smoothHeading(previous, rawHeading);
  if (previous !== null && Math.abs(headingDifference(previous, smoothed)) < 1.1) return;

  win.__baja411SmoothedHeading = smoothed;
  win.__baja411LastHeadingUpdate = now;

  const patch = installRotationPatch();
  patch.maps.forEach((map) => {
    try {
      patch.originalEaseTo.call(map, { bearing: smoothed, duration: 140, essential: true });
    } catch {
      patch.maps.delete(map);
    }
  });
}

function handleLiveHeading(event: DeviceOrientationEvent) {
  const heading = getHeading(event as DeviceOrientationEventWithCompass);
  if (heading === null) return;
  applyLiveHeading(heading);
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
  ensureGpsFollow();
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

function attachGpsToggle() {
  const button = document.querySelector<HTMLButtonElement>('button[aria-label="Recenter"]');
  const canvas = document.querySelector<HTMLCanvasElement>(".maplibregl-canvas");
  if (!button || !canvas || button.dataset.gpsToggleEnhanced === "1") return;

  button.dataset.gpsToggleEnhanced = "1";
  button.title = "GPS follow";

  button.addEventListener(
    "click",
    (event) => {
      const isFollowing = button.className.includes("text-jade");
      if (!isFollowing) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      disableHeadingRotation(document.getElementById(ROTATION_BUTTON_ID) as HTMLButtonElement | null);
      canvas.dispatchEvent(new Event("touchstart", { bubbles: true, cancelable: true }));
    },
    true
  );
}

export default function MapSearchEnhancer() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let timer: number | null = null;

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
            setReactInputValue(searchInput, match);
            panel.hidden = true;
            window.setTimeout(() => searchForm.requestSubmit(), 0);
          });
          panel.appendChild(button);
        });

        panel.hidden = false;
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
      searchInput.addEventListener("focus", openSearch);
      searchInput.addEventListener("input", showSuggestions);
      searchInput.addEventListener("blur", maybeCloseSearch);
      searchForm.addEventListener("focusout", maybeCloseSearch);

      cleanup = () => {
        searchForm.removeEventListener("click", openSearch);
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
      attachGpsToggle();
      ensureRotationToggle();
    });

    timer = window.setInterval(() => {
      attachSearch();
      attachGpsToggle();
      ensureRotationToggle();
    }, 250);

    bajaWindow().__baja411HeadingActive = false;
    refreshHeadingListeners();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    attachSearch();
    attachGpsToggle();
    ensureRotationToggle();

    return () => {
      if (timer !== null) window.clearInterval(timer);
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
