"use client";

import { useEffect } from "react";

const TOWN_SUGGESTIONS = [
  "La Paz",
  "Todos Santos",
  "El Pescadero",
  "Cerritos",
  "Cabo San Lucas",
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

export default function MapSearchEnhancer() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let timer: number | null = null;

    function attach() {
      const input = document.querySelector<HTMLInputElement>('input[placeholder="Search towns, fuel, water, beaches"]');
      const form = input?.closest("form") as HTMLFormElement | null;
      if (!input || !form || form.dataset.searchEnhanced === "1") return false;

      form.dataset.searchEnhanced = "1";
      form.classList.add("map-plan-search");

      const panel = document.createElement("div");
      panel.className = "map-search-suggestions";
      panel.hidden = true;
      form.appendChild(panel);

      function showSuggestions() {
        const query = normalize(input.value);
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
            setReactInputValue(input, match);
            panel.hidden = true;
            window.setTimeout(() => form.requestSubmit(), 0);
          });
          panel.appendChild(button);
        });

        panel.hidden = false;
      }

      function openSearch() {
        form.classList.add("map-plan-search-open");
        window.setTimeout(() => input.focus(), 60);
      }

      function maybeCloseSearch() {
        window.setTimeout(() => {
          if (form.contains(document.activeElement) || input.value.trim()) return;
          form.classList.remove("map-plan-search-open");
          panel.hidden = true;
        }, 120);
      }

      form.addEventListener("click", openSearch);
      input.addEventListener("focus", openSearch);
      input.addEventListener("input", showSuggestions);
      input.addEventListener("blur", maybeCloseSearch);
      form.addEventListener("focusout", maybeCloseSearch);

      cleanup = () => {
        form.removeEventListener("click", openSearch);
        input.removeEventListener("focus", openSearch);
        input.removeEventListener("input", showSuggestions);
        input.removeEventListener("blur", maybeCloseSearch);
        form.removeEventListener("focusout", maybeCloseSearch);
        panel.remove();
        form.classList.remove("map-plan-search", "map-plan-search-open");
        delete form.dataset.searchEnhanced;
      };

      return true;
    }

    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });

    timer = window.setInterval(() => {
      if (attach() && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }, 250);

    observer.observe(document.body, { childList: true, subtree: true });
    attach();

    return () => {
      if (timer !== null) window.clearInterval(timer);
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  return null;
}
