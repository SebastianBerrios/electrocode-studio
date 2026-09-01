"use client";

import { useMemo, useState } from "react";
import { Modal } from "../ui/Modal";
import { useInvitation } from "../context/InvitationContext";
import {
  buildRsvpMessage,
  createRsvpState,
  goBack,
  goNext,
  setAttendance,
  setNote,
  toggleGuest,
  whatsappUrl,
  type WizardEvent,
} from "../lib/rsvp-wizard";

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-md px-5 py-4 text-left text-base transition ${
        selected ? "bg-brand text-on-brand" : "bg-band text-muted hover:bg-brand/60"
      }`}
    >
      {children}
    </button>
  );
}

export function RsvpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const invitation = useInvitation();
  const events: WizardEvent[] = useMemo(
    () => invitation.events.map(({ id, label }) => ({ id, label })),
    [invitation.events],
  );

  const guestNames = invitation.guests?.names ?? [];

  const [state, setState] = useState(() =>
    createRsvpState(guestNames, events),
  );

  const step = state.steps[state.stepIndex];
  const isFirstStep = state.stepIndex === 0;
  const isLastStep = state.stepIndex === state.steps.length - 1;

  const shareUrl = useMemo(
    () =>
      state.completed
        ? whatsappUrl(invitation.rsvp.whatsappNumber, buildRsvpMessage(state, events))
        : null,
    [state, invitation.rsvp.whatsappNumber, events],
  );

  const handleClose = () => {
    onClose();
    setState(createRsvpState(guestNames, events));
  };

  return (
    <Modal open={open} onClose={handleClose} title={invitation.rsvp.title}>
      {state.completed ? (
        <div className="space-y-6 text-center">
          <p className="text-base text-muted">
            ¡Gracias por confirmar! Ya tenemos tu respuesta.
          </p>
          {shareUrl && (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill w-full block text-center"
            >
              Enviar por WhatsApp
            </a>
          )}
          <button type="button" onClick={handleClose} className="block w-full text-sm text-muted">
            Cerrar
          </button>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setState(goNext);
          }}
          className="space-y-5"
        >
          {step === "guests" && (
            <fieldset className="space-y-3">
              <legend className="mb-3 w-full text-center text-lg text-ink">
                ¿Quién está confirmando? <span className="text-red-500">*</span>
              </legend>
              {guestNames.length > 0 ? (
                guestNames.map((name) => (
                  <Choice
                    key={name}
                    selected={state.selectedGuests.includes(name)}
                    onClick={() => setState((current) => toggleGuest(current, name))}
                  >
                    {name}
                  </Choice>
                ))
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Tu nombre y apellido"
                    value={state.selectedGuests[0] || ""}
                    onChange={(e) =>
                      setState((curr) => ({
                        ...curr,
                        selectedGuests: e.target.value ? [e.target.value] : [],
                      }))
                    }
                    className="w-full rounded-md bg-band px-4 py-3 text-base text-ink outline-none"
                    required
                  />
                </div>
              )}
            </fieldset>
          )}

          {step.startsWith("event:") &&
            (() => {
              const eventId = step.slice("event:".length);
              const event = events.find((candidate) => candidate.id === eventId);
              const answer = state.attendance[eventId];

              return (
                <fieldset className="space-y-3">
                  <legend className="mb-3 w-full text-center text-lg text-ink">
                    ¿Asistes a la {event?.label}? <span className="text-red-500">*</span>
                  </legend>
                  <Choice
                    selected={answer === true}
                    onClick={() => setState((current) => setAttendance(current, eventId, true))}
                  >
                    Sí, asistiré
                  </Choice>
                  <Choice
                    selected={answer === false}
                    onClick={() => setState((current) => setAttendance(current, eventId, false))}
                  >
                    No asistiré
                  </Choice>
                </fieldset>
              );
            })()}

          {step === "note" && (
            <div className="space-y-3">
              <label htmlFor="rsvp-note" className="block text-center text-lg text-ink">
                ¿Quieres dejarnos un mensaje?
              </label>
              <textarea
                id="rsvp-note"
                rows={4}
                value={state.note}
                onChange={(event) =>
                  setState((current) => setNote(current, event.target.value))
                }
                placeholder="Opcional"
                className="w-full resize-none rounded-md bg-band px-4 py-3 text-base text-ink outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {state.error && (
            <p role="alert" className="text-center text-sm text-red-500">
              {state.error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={() => setState(goBack)}
                className="flex-1 rounded-md bg-band px-5 py-4 text-ink transition hover:bg-band/80"
              >
                ← Anterior
              </button>
            )}
            <button
              type="submit"
              className="flex-1 rounded-md bg-brand px-5 py-4 text-on-brand transition hover:opacity-90"
            >
              {isLastStep ? "Enviar" : "Siguiente →"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
