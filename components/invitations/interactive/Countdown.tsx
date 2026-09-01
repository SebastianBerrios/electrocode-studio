"use client";

import { LeafDivider } from "../decor/LineBotanical";
import { useInvitation } from "../context/InvitationContext";
import { useCountdown } from "../hooks/useCountdown";

const UNITS = [
  { key: "days", label: "días" },
  { key: "hours", label: "hs" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
] as const;

export function Countdown() {
  const invitation = useInvitation();
  const parts = useCountdown(invitation.countdownTarget);

  return (
    <div className="text-center">
      <p className="font-display text-display-xl text-ink">
        {parts?.isPast ? "¡Hoy!" : "Falta"}
      </p>
      <LeafDivider className="mx-auto mt-3 w-32 text-accent" />

      <div
        className="mt-6 flex items-start justify-center"
        aria-hidden
      >
        {UNITS.map((unit, index) => (
          <div
            key={unit.key}
            className={`px-4 text-center ${index > 0 ? "border-l border-accent/35" : ""}`}
          >
            <span className="block font-display text-3xl text-ink tabular-nums sm:text-4xl">
              {parts ? String(parts[unit.key]).padStart(2, "0") : "--"}
            </span>
            <span className="mt-1 block text-xs text-accent">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
