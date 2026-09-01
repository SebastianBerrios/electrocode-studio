"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { CloseIcon } from "../decor/Icons";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    return () => restoreFocusTo.current?.focus?.();
  }, [open]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-16 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl bg-[#ffffff] px-6 pt-10 pb-8 shadow-2xl outline-none sm:px-10 text-[#0f1015]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-5 right-4 grid h-12 w-12 place-items-center rounded-full bg-[#575531] text-[#ffffff] shadow-lg transition hover:opacity-90"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h2
          id={titleId}
          className="text-center font-display text-2xl font-medium leading-none text-[#0f1015]"
        >
          {title}
        </h2>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
