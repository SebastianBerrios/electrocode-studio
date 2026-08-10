/**
 * One drawing per illustrated card in the "Cómo trabajamos" bento
 * (`components/sections/way-of-working.tsx`).
 *
 * **These are diagrams, not screenshots, and the distinction is the whole
 * point.** The reference direction fills its equivalent grid with captures of
 * its own product — a request queue, a plan picker, a dashboard. This studio
 * sells project work, not a product with an interface, so a mockup of a
 * "pricing screen" or an "approvals inbox" would depict something that does
 * not exist. That is the same failure `lib/content/service-illustrations.ts`
 * was written to undo when it removed real client captures from the Servicios
 * cards: an image inside a card is read as a claim, so it may only show what
 * is true. An abstract diagram claims nothing beyond the sentence next to it.
 *
 * Only three of the six cards carry one, and it is the three that occupy the
 * bento's large cells. The illustration is what earns a cell its extra width —
 * a two-column card holding nothing but a short paragraph reads as a layout
 * accident. The three text-only cards sit in single-column cells where they do
 * not need one.
 *
 * Palette is copied from `public/services/*.svg` rather than re-derived, so
 * the two illustrated sections look like one set. Same consequence as there:
 * the drawings are opaque and light-toned, so they do not re-tint under
 * `.dark`. That is a known, shared trait of every illustration in this repo,
 * not something specific to this file.
 *
 * Static `import`s, same rule as `service-illustrations.ts`: a missing file is
 * a build error, never a runtime 404. `alt` describes the drawing — these
 * carry meaning, so none of them is `alt=""` decoration.
 */

import type { MediaAsset } from "@/lib/content/types";
import publishedPrice from "@/public/way-of-working/published-price.svg";
import revisionRounds from "@/public/way-of-working/revision-rounds.svg";
import noLockIn from "@/public/way-of-working/no-lock-in.svg";

export const WAY_OF_WORKING_ILLUSTRATIONS = {
  publishedPrice: {
    asset: publishedPrice,
    alt: {
      es: "Diagrama de una hoja publicada: una etiqueta de precio junto a tres filas, cada una con su importe a la vista",
    },
  },
  revisionRounds: {
    asset: revisionRounds,
    alt: {
      es: "Diagrama de un ciclo de revisión: dos paradas marcadas sobre el círculo y una tercera punteada, fuera de lo incluido",
    },
  },
  noLockIn: {
    asset: noLockIn,
    alt: {
      es: "Diagrama de un candado abierto junto a una línea de entrega completa que termina en una marca de verificación",
    },
  },
} as const satisfies Record<string, MediaAsset>;
