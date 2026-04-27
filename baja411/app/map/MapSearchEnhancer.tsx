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

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function setReactInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function removeOldCompassControl() {
  document.getElementById("baja411-drive-compass-button")?.remove();
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
      removeOldCompassControl();
      attachSearch();
      attachGpsToggle();
    });

    timer = window.setInterval(() => {
      removeOldCompassControl();
      attachSearch();
      attachGpsToggle();
    }, 250);

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    removeOldCompassControl();
    attachSearch();
    attachGpsToggle();

    return () => {
      if (timer !== null) window.clearInterval(timer);
      observer.disconnect();
      removeOldCompassControl();
      cleanup?.();
    };
  }, []);

  return null;
}
