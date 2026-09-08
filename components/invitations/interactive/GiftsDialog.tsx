"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { useInvitation } from "../context/InvitationContext";

function CopyButton({
  label = "Copiar",
  value,
  className = "",
}: {
  label?: string;
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => setCopied(true),
          () => setCopied(false),
        );
      }}
      className={`rounded-md px-4 py-3 text-xs sm:text-sm font-bold tracking-wide uppercase transition hover:opacity-90 ${className}`}
      style={{ background: "#575531", color: "#fef9f0" }}
    >
      {copied ? "¡Copiado!" : label}
    </button>
  );
}

export function GiftsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const invitation = useInvitation();

  return (
    <Modal open={open} onClose={onClose} title={invitation.gifts.modalTitle}>
      {invitation.gifts.modalIntro && (
        <p className="mb-6 text-center text-base" style={{ color: "#575531" }}>{invitation.gifts.modalIntro}</p>
      )}

      <div className="space-y-4">
        {invitation.gifts.accounts.map((account) => (
          <div key={account.label} className="rounded-xl px-5 py-5 text-center" style={{ background: "#f7efdd" }}>
            <p className="text-sm font-bold tracking-wide uppercase" style={{ color: "#575531" }}>
              {account.label}
            </p>
            <div className="mt-2 space-y-1 text-base" style={{ color: "#0f1015" }}>
              {account.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {account.copyActions && account.copyActions.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {account.copyActions.map((action) => (
                  <CopyButton
                    key={action.label}
                    label={action.label}
                    value={action.value}
                    className="flex-1"
                  />
                ))}
              </div>
            ) : account.copyValue ? (
              <div className="mt-3">
                <CopyButton value={account.copyValue} className="w-full" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Modal>
  );
}
