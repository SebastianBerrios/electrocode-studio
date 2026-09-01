"use client";

import { useReveal } from "../hooks/useReveal";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, state } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} data-reveal={state} className={className}>
      {children}
    </div>
  );
}
