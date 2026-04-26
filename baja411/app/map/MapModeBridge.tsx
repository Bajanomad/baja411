"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const VALID_MODES = new Set(["drive", "plan"]);

function findModeButton(mode: string) {
  return Array.from(document.querySelectorAll("button")).find(
    (button) => button.textContent?.trim().toLowerCase() === mode
  ) as HTMLButtonElement | undefined;
}

export default function MapModeBridge() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode")?.toLowerCase() ?? "";

  useEffect(() => {
    if (!VALID_MODES.has(mode)) return;

    let attempts = 0;
    const maxAttempts = 20;

    const timer = window.setInterval(() => {
      attempts += 1;
      const button = findModeButton(mode);

      if (button) {
        button.click();
        window.clearInterval(timer);
        return;
      }

      if (attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [mode]);

  return null;
}
