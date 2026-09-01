"use client";

import { useEffect, useState } from "react";
import { computeCountdown, type CountdownParts } from "../lib/countdown";

/**
 * Ticks `computeCountdown` once a second.
 */
export function useCountdown(targetIso: string): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const target = Date.parse(targetIso);
    if (Number.isNaN(target)) return;

    const tick = () => setParts(computeCountdown(target, Date.now()));

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return parts;
}
