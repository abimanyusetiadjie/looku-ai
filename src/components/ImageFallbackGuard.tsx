"use client";

import { useEffect } from "react";

const FALLBACK_SRC = "/fallback-garment.svg";

/**
 * Global safety net: any <img> (including next/image output) that fails to load
 * is swapped for an on-brand placeholder instead of the browser's broken-file icon.
 * Image error events don't bubble, so we listen in the capture phase.
 */
export default function ImageFallbackGuard() {
  useEffect(() => {
    const onError = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.dataset.fallbackApplied === "true") return;
      target.dataset.fallbackApplied = "true";
      target.removeAttribute("srcset");
      target.removeAttribute("sizes");
      target.src = FALLBACK_SRC;
      target.style.objectFit = "cover";
    };
    document.addEventListener("error", onError, true);
    return () => document.removeEventListener("error", onError, true);
  }, []);

  return null;
}
