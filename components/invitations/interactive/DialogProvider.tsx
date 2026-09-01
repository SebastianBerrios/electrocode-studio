"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { GiftsDialog } from "./GiftsDialog";
import { RsvpDialog } from "./RsvpDialog";
import { SongDialog } from "./SongDialog";
import { Modal } from "../ui/Modal";
import { useInvitation } from "../context/InvitationContext";

export type DialogId = "rsvp" | "song" | "gifts" | `info:${string}`;

type DialogValue = {
  current: DialogId | null;
  open: (id: DialogId) => void;
  close: () => void;
};

const DialogContext = createContext<DialogValue | null>(null);

export function useDialog(): DialogValue {
  const value = useContext(DialogContext);
  if (!value) throw new Error("useDialog must be used inside <DialogProvider>");
  return value;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const invitation = useInvitation();
  const [current, setCurrent] = useState<DialogId | null>(null);

  const open = useCallback((id: DialogId) => setCurrent(id), []);
  const close = useCallback(() => setCurrent(null), []);

  const value = useMemo(() => ({ current, open, close }), [current, open, close]);

  const infoCards = useMemo(() => {
    return invitation.party.cards.filter(
      (card) => card.action.kind === "info" && card.action.modalTitle,
    );
  }, [invitation.party.cards]);

  return (
    <DialogContext.Provider value={value}>
      {children}

      <RsvpDialog open={current === "rsvp"} onClose={close} />
      <SongDialog open={current === "song"} onClose={close} />
      <GiftsDialog open={current === "gifts"} onClose={close} />

      {infoCards.map((card) => (
        <Modal
          key={card.id}
          open={current === `info:${card.id}`}
          onClose={close}
          title={card.action.modalTitle ?? card.title}
        >
          <div className="space-y-4 text-center text-base text-[#575531]">
            {card.action.modalBody?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Modal>
      ))}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  dialog,
  children,
  className = "pill",
}: {
  dialog: DialogId;
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useDialog();

  return (
    <button type="button" onClick={() => open(dialog)} className={className}>
      {children}
    </button>
  );
}
