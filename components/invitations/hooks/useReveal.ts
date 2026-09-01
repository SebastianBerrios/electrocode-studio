"use client";

import { useEffect, useRef, useState } from "react";
import { isWithinRevealBand } from "../lib/reveal";

export type RevealState = "idle" | "shown";

/**
 * One-shot reveal-on-scroll.
 */
export function useReveal<T extends HTMLElement>(bottomMargin = 0.08) {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let done = false;

    const stop = () => {
      done = true;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    const check = () => {
      frame = 0;
      if (done) return;

      const { top } = node.getBoundingClientRect();
      if (!isWithinRevealBand(top, window.innerHeight, bottomMargin)) return;

      setState("shown");
      stop();
    };

    function schedule() {
      if (!frame && !done) frame = requestAnimationFrame(check);
    }

    check();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return stop;
  }, [bottomMargin]);

  return { ref, state };
}
