"use client";

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
const DRIVE_STATUS_WORDS = ["Tracking", "Finding GPS", "Paused", "Location off"];
const COMPASS_BUTTON_ID = "baja411-drive-compass-button";
const COMPASS_PERMISSION_KEY = "baja411-compass-enabled";
const COMPASS_ACTIVE_KEY = "baja411-compass-active";

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

let lastAppliedHeading: number | null = null;
let driveCompassActive = false;

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

function headingDelta(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

function smoothHeading(current: number | null, next: number) {
  if (current === null) return normalizeDegrees(next);
  return normalizeDegrees(current + headingDelta(current, next) * 0.24);
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

function driveStatusElements() {
  return Array.from(document.querySelectorAll<HTMLElement>("div.absolute.bottom-5.left-3.z-\\[1000\\]"));
}

function isDriveModeVisible() {
  return driveStatusElements().some((element) => DRIVE_STATUS_WORDS.some((word) => (element.textContent ?? "").includes(word)));
}

function moveDriveStatus() {
  driveStatusElements().forEach((element) => {
    const text = element.textContent ?? "";
    if (!DRIVE_STATUS_WORDS.some((word) => text.includes(word))) return;

    element.classList.add("map-drive-status-chip");
    element.style.top = "72px";
    element.style.bottom = "auto";
    element.style.left = "12px";
    element.style.right = "auto";
    element.style.padding = "9px 13px";
    element.style.maxWidth = "160px";
  });
}

function mapVisualLayers() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      ".maplibregl-canvas-container, .maplibregl-marker"
    )
  );
}

function resetMapRotation() {
  lastAppliedHeading = null;
  mapVisualLayers().forEach((element) => {
    element.style.transform = "";
    element.style.transformOrigin = "";
    element.style.transition = "";
    element.style.willChange = "";
  });
}

function applyMapRotation(heading: number) {
  if (!driveCompassActive || !isDriveModeVisible()) {
    resetMapRotation();
    return;
  }

  const smoothed = smoothHeading(lastAppliedHeading, heading);
  lastAppliedHeading = smoothed;
  const rotation = `rotate(${-smoothed}deg)`;

  const canvasContainer = document.querySelector<HTMLElement>(".maplibregl-canvas-container");
  if (canvasContainer) {
    canvasContainer.style.transformOrigin = "center center";
    canvasContainer.style.transform = `scale(1.55) ${rotation}`;
    canvasContainer.style.transition = "transform 90ms linear";
    canvasContainer.style.willChange = "transform";
  }

  document.querySelectorAll<HTMLElement>(".maplibregl-marker").forEach((marker) => {
    marker.style.transformOrigin = "center center";
    marker.style.transform = `${marker.style.transform} rotate(${smoothed}deg)`;
  });
}

function styleCompassButton(button: HTMLButtonElement) {
  button.style.position = "absolute";
  button.style.top = "72px";
  button.style.right = "12px";
  button.style.zIndex = "1500";
  button.style.width = "52px";
  button.style.height = "52px";
  button.style.borderRadius = "999px";
  button.style.border = "1px solid rgba(15, 23, 42, 0.14)";
  button.style.background = "rgba(255, 255, 255, 0.96)";
  button.style.boxShadow = "0 14px 34px rgba(15, 23, 42, 0.18)";
  button.style.backdropFilter = "blur(18px)";
  button.style.setProperty("-webkit-backdrop-filter", "blur(18px)");
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.fontSize = "25px";
  button.style.lineHeight = "1";
  button.style.cursor = "pointer";
  button.style.userSelect = "none";
  button.style.touchAction = "manipulation";
}

function ensureCompassControl() {
  let button = document.getElementById(COMPASS_BUTTON_ID) as HTMLButtonElement | null;

  if (!button) {
    const compassButton = document.createElement("button");
    compassButton.id = COMPASS_BUTTON_ID;
    compassButton.type = "button";
    compassButton.title = "Compass";
    compassButton.setAttribute("aria-label", "Enable drive compass");
    compassButton.innerHTML = "<span style='display:block;transform-origin:center;'>🧭</span>";
    styleCompassButton(compassButton);

    compassButton.addEventListener("click", async () => {
      const OrientationEvent = window.DeviceOrientationEvent as DeviceOrientationEventWithPermission | undefined;
      driveCompassActive = true;
      localStorage.setItem(COMPASS_ACTIVE_KEY, "1");
      compassButton.classList.add("map-compass-active");
      compassButton.style.background = "rgba(42, 122, 90, 0.96)";

      const needle = compassButton.firstElementChild as HTMLElement | null;
      if (needle) needle.style.filter = "brightness(0) invert(1)";

      if (OrientationEvent && typeof OrientationEvent.requestPermission === "function") {
        try {
          const result = await OrientationEvent.requestPermission();
          if (result === "granted") localStorage.setItem(COMPASS_PERMISSION_KEY, "1");
        } catch {
          // Browser said nope. Keep the button, do not nag.
        }
      } else {
        localStorage.setItem(COMPASS_PERMISSION_KEY, "1");
      }

      document.querySelector<HTMLButtonElement>('button[aria-label="Recenter"]')?.click();
    });

    window.addEventListener("deviceorientationabsolute", updateCompassAndMap, true);
    window.addEventListener("deviceorientation", updateCompassAndMap, true);
    document.querySelector(".relative.h-full.w-full.overflow-hidden")?.appendChild(compassButton);
    button = compassButton;
  }

  const driveVisible = isDriveModeVisible();
  button.hidden = !driveVisible;

  if (!driveVisible) {
    driveCompassActive = false;
    resetMapRotation();
  }
}

function updateCompassAndMap(event: DeviceOrientationEvent) {
  const button = document.getElementById(COMPASS_BUTTON_ID);
  const needle = button?.firstElementChild as HTMLElement | null;
  const heading = getHeading(event as DeviceOrientationEventWithCompass);
  if (heading === null) return;

  if (needle) needle.style.transform = `rotate(${-heading}deg)`;
  applyMapRotation(heading);
}

export default function MapSearchEnhancer() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let timer: number | null = null;

    function attach() {
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
      attach();
      moveDriveStatus();
      ensureCompassControl();
    });

    timer = window.setInterval(() => {
      attach();
      moveDriveStatus();
      ensureCompassControl();
    }, 250);

    driveCompassActive = localStorage.getItem(COMPASS_ACTIVE_KEY) === "1";

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    attach();
    moveDriveStatus();
    ensureCompassControl();

    return () => {
      if (timer !== null) window.clearInterval(timer);
      observer.disconnect();
      window.removeEventListener("deviceorientationabsolute", updateCompassAndMap, true);
      window.removeEventListener("deviceorientation", updateCompassAndMap, true);
      resetMapRotation();
      document.getElementById(COMPASS_BUTTON_ID)?.remove();
      cleanup?.();
    };
  }, []);

  return null;
}
