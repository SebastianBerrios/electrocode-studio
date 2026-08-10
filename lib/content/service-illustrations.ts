/**
 * One generic illustration per service line, for the Servicios cards.
 *
 * These are **not evidence**. Until now `toServiceCards()`
 * (`lib/content/projections.ts`) paired each card with a real client
 * screenshot derived from `PROJECTS`, which had two problems the illustration
 * solves at the root:
 *
 * - It said the wrong thing. The Servicios section answers "what do you
 *   sell", not "who have you sold it to" — `#proyectos` is the section that
 *   answers the second question, with consent, evidence state, and a link per
 *   project. A client capture inside a service card reads as a portfolio
 *   entry stripped of all of that context.
 * - Line D (Mantenimiento) has no projects at all — the "every non-retainer
 *   line has proof" invariant exempts it on purpose — so that card rendered
 *   with no image and broke the row.
 *
 * A drawn illustration cannot be mistaken for a claim about a real client, so
 * every line gets one and the section stops depending on the portfolio's
 * shape. The consent-gated derivation is unchanged everywhere it belongs:
 * `toPortfolioCards()`, `toHeroProducts()`, and the case studies still read
 * from `publishableProjects()`.
 *
 * Static `import`s, same rule as `lib/content/projects/media.ts`: a missing
 * file is a build error, never a runtime 404. `alt` describes what each
 * drawing shows — these carry meaning (they say which service the card is
 * about), so they are not `alt=""` decoration.
 */

import type { MediaAsset } from "@/lib/content/types";
import type { ServiceLine } from "@/lib/content/service-lines";
import landing from "@/public/services/landing.svg";
import webApp from "@/public/services/web-app.svg";
import biolink from "@/public/services/biolink.svg";
import maintenance from "@/public/services/maintenance.svg";

export const SERVICE_ILLUSTRATIONS = {
  A: {
    asset: landing,
    alt: {
      es: "Ilustración de una landing page: navegador con titular, botón de contacto e imagen destacada",
    },
  },
  B: {
    asset: webApp,
    alt: {
      es: "Ilustración de un panel de control: menú lateral, indicadores y gráficos",
    },
  },
  C: {
    asset: biolink,
    alt: {
      es: "Ilustración de un biolink: pantalla de móvil con foto de perfil y una lista de enlaces",
    },
  },
  D: {
    asset: maintenance,
    alt: {
      es: "Ilustración de mantenimiento: escudo con una marca de verificación junto a un registro de actualizaciones",
    },
  },
} as const satisfies Record<ServiceLine, MediaAsset>;
