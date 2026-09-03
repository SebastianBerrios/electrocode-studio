"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { EventBlock } from "@/lib/clients/types";
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl } from "../lib/calendar";

export function AddToCalendar({
  event,
  label = "Agendar",
  className = "pill w-64 max-w-full",
}: {
  event: EventBlock;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const location = `${event.venue}, ${event.address}`;

  const handleAppleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadIcs(event.calendar, location, `${event.id}.ics`);
    setOpen(false);
  };

  const options = [
    {
      label: "Google Calendar",
      href: googleCalendarUrl(event.calendar, location),
      isExternal: true,
      onClick: () => setOpen(false),
    },
    {
      label: "Apple Calendar",
      href: "#",
      isExternal: false,
      onClick: handleAppleClick,
    },
    {
      label: "Outlook",
      href: outlookCalendarUrl(event.calendar, location),
      isExternal: true,
      onClick: () => setOpen(false),
    },
  ];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (nativeEvent: PointerEvent) => {
      if (!containerRef.current?.contains(nativeEvent.target as Node)) setOpen(false);
    };
    const onKeyDown = (nativeEvent: KeyboardEvent) => {
      if (nativeEvent.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={menuId}
        className={className}
      >
        {label}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full left-1/2 z-20 mt-2 w-64 max-w-[85vw] -translate-x-1/2 overflow-hidden rounded-xl bg-white shadow-xl text-ink"
        >
          {options.map((option) => (
            <a
              key={option.label}
              role="menuitem"
              href={option.href}
              target={option.isExternal ? "_blank" : undefined}
              rel={option.isExternal ? "noopener noreferrer" : undefined}
              onClick={option.onClick}
              className="block px-5 py-3 text-center text-sm text-ink transition hover:bg-band"
            >
              {option.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
