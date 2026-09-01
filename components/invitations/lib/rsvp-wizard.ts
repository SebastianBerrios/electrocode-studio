/**
 * State machine behind the "Confirmar Asistencia" wizard.
 */

export type WizardEvent = { id: string; label: string };

export type StepId = "guests" | `event:${string}` | "note";

export type RsvpState = {
  readonly guests: readonly string[];
  readonly steps: readonly StepId[];
  selectedGuests: string[];
  attendance: Record<string, boolean>;
  note: string;
  stepIndex: number;
  error: string | null;
  completed: boolean;
};

export function stepIdsFor(events: readonly WizardEvent[]): StepId[] {
  return ["guests", ...events.map((event): StepId => `event:${event.id}`), "note"];
}

export function createRsvpState(
  guests: readonly string[],
  events: readonly WizardEvent[],
): RsvpState {
  return {
    guests,
    steps: stepIdsFor(events),
    selectedGuests: [],
    attendance: {},
    note: "",
    stepIndex: 0,
    error: null,
    completed: false,
  };
}

export function toggleGuest(state: RsvpState, name: string): RsvpState {
  if (!state.guests.includes(name)) return state;

  const selected = new Set(state.selectedGuests);
  if (!selected.delete(name)) selected.add(name);

  return {
    ...state,
    selectedGuests: state.guests.filter((guest) => selected.has(guest)),
    error: null,
  };
}

export function setAttendance(
  state: RsvpState,
  eventId: string,
  attending: boolean,
): RsvpState {
  return {
    ...state,
    attendance: { ...state.attendance, [eventId]: attending },
    error: null,
  };
}

export function setNote(state: RsvpState, note: string): RsvpState {
  return { ...state, note };
}

export function validateStep(state: RsvpState, step: StepId): string | null {
  if (step === "guests") {
    return state.selectedGuests.length > 0
      ? null
      : "Debes seleccionar quién está confirmando";
  }

  if (step.startsWith("event:")) {
    const eventId = step.slice("event:".length);
    return eventId in state.attendance ? null : "Debes elegir una opción";
  }

  return null;
}

export function goNext(state: RsvpState): RsvpState {
  const current = state.steps[state.stepIndex];
  const error = validateStep(state, current);

  if (error) return { ...state, error };

  const isLast = state.stepIndex === state.steps.length - 1;

  return isLast
    ? { ...state, error: null, completed: true }
    : { ...state, stepIndex: state.stepIndex + 1, error: null };
}

export function goBack(state: RsvpState): RsvpState {
  return {
    ...state,
    stepIndex: Math.max(0, state.stepIndex - 1),
    error: null,
  };
}

export function buildRsvpMessage(
  state: RsvpState,
  events: readonly WizardEvent[],
): string {
  const lines = [
    "¡Hola! Confirmamos asistencia.",
    `Invitados: ${state.selectedGuests.join(", ")}`,
    ...events.map((event) => {
      const attending = state.attendance[event.id];
      const answer =
        attending === undefined ? "Sin responder" : attending ? "Sí asistiré" : "No asistiré";
      return `${event.label}: ${answer}`;
    }),
  ];

  const note = state.note.trim();
  if (note) lines.push(`Nota: ${note}`);

  return lines.join("\n");
}

export function whatsappUrl(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
