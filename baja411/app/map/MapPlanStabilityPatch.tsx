"use client";

import maplibregl from "maplibre-gl";
import { useEffect } from "react";

type BajaMapWindow = Window & {
  __baja411PlanCameraPatchInstalled?: boolean;
  __baja411PlanCameraOriginalEaseTo?: maplibregl.Map["easeTo"];
  __baja411AllowPlanCameraUntil?: number;
};

function bajaWindow() {
  return window as BajaMapWindow;
}

function isDriveModeActive() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
  const driveButton = buttons.find((button) => button.textContent?.trim() === "Drive");
  return Boolean(driveButton?.className.includes("bg-jade"));
}

function isPlanModeActive() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
  const planButton = buttons.find((button) => button.textContent?.trim() === "Plan");
  return Boolean(planButton?.className.includes("bg-jade")) || !isDriveModeActive();
}

function allowPlanCamera(milliseconds = 2200) {
  bajaWindow().__baja411AllowPlanCameraUntil = performance.now() + milliseconds;
}

function planCameraIsAllowed() {
  const allowedUntil = bajaWindow().__baja411AllowPlanCameraUntil ?? 0;
  return performance.now() < allowedUntil;
}

function installPlanCameraPatch() {
  const win = bajaWindow();
  if (win.__baja411PlanCameraPatchInstalled) return;

  const proto = maplibregl.Map.prototype;
  const originalEaseTo = proto.easeTo;
  win.__baja411PlanCameraOriginalEaseTo = originalEaseTo;

  proto.easeTo = function patchedPlanEaseTo(this: maplibregl.Map, ...args: Parameters<maplibregl.Map["easeTo"]>) {
    const [options] = args;
    const hasProgrammaticCenter = Boolean(options && typeof options === "object" && "center" in options);

    if (hasProgrammaticCenter && isPlanModeActive() && !planCameraIsAllowed()) {
      return this;
    }

    return originalEaseTo.call(this, ...args);
  } as maplibregl.Map["easeTo"];

  win.__baja411PlanCameraPatchInstalled = true;
}

function collapseAttribution() {
  document.querySelectorAll<HTMLElement>(".maplibregl-ctrl-attrib").forEach((control) => {
    control.classList.add("maplibregl-compact");
    control.classList.remove("maplibregl-compact-show");
  });
}

export default function MapPlanStabilityPatch() {
  useEffect(() => {
    installPlanCameraPatch();

    const markAllowedCameraMove = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (
        target.closest("form")?.querySelector('input[placeholder="Search towns, fuel, water, beaches"]') ||
        target.closest(".maplibregl-marker") ||
        target.closest('button[aria-label="Recenter"]')
      ) {
        allowPlanCamera();
      }
    };

    const markSearchSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form?.querySelector('input[placeholder="Search towns, fuel, water, beaches"]')) return;
      allowPlanCamera(3200);
    };

    const observer = new MutationObserver(collapseAttribution);
    const timer = window.setInterval(collapseAttribution, 300);

    document.addEventListener("pointerdown", markAllowedCameraMove, true);
    document.addEventListener("submit", markSearchSubmit, true);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    collapseAttribution();

    return () => {
      document.removeEventListener("pointerdown", markAllowedCameraMove, true);
      document.removeEventListener("submit", markSearchSubmit, true);
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
