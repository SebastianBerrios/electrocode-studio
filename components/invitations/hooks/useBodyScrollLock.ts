"use client";

import { useEffect } from "react";

/**
 * Freezes page scroll while an overlay is open.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previous;
    };
  }, [active]);
}
