"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { useInvitation } from "../context/InvitationContext";
import { whatsappUrl } from "../lib/rsvp-wizard";

export function SongDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const invitation = useInvitation();
  const [song, setSong] = useState("");
  const [sent, setSent] = useState(false);

  const trimmed = song.trim();
  const shareUrl = whatsappUrl(
    invitation.rsvp.whatsappNumber,
    `¡Hola! Sugiero esta canción para la fiesta: ${trimmed}`,
  );

  const handleClose = () => {
    onClose();
    setSong("");
    setSent(false);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Sugerir canción">
      {sent ? (
        <div className="space-y-6 text-center">
          <p className="text-base text-muted">¡Anotada! Gracias por el aporte.</p>
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
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (trimmed) setSent(true);
          }}
          className="space-y-5"
        >
          <label htmlFor="song" className="block text-center text-lg text-ink">
            ¿Cuál es la canción que no puede faltar?
          </label>
          <input
            id="song"
            value={song}
            onChange={(event) => setSong(event.target.value)}
            placeholder="Artista - Título"
            required
            className="w-full rounded-md bg-band px-4 py-4 text-base text-ink outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-5 py-4 text-on-brand transition hover:opacity-90"
          >
            Sugerir
          </button>
        </form>
      )}
    </Modal>
  );
}
