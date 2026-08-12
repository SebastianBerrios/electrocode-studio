/**
 * The ready-made template catalogue — the designs a Line C buyer picks from.
 *
 * **This is not a fifth service line, and it deliberately cannot become one.**
 * `SERVICE_LINES` (`lib/content/service-lines.ts`) is closed at four by
 * `satisfies Record<ServiceLine, ServiceLineDefinition>`, and line C
 * ("Biolinks y microsites de evento") already covers both families below. What
 * was missing was never a line — it was the CATALOGUE: thirty finished
 * designs that the Servicios accordion has no room to show and the pricing page
 * has no reason to. Every family here therefore carries `serviceLine` and
 * `priceToken` pointing back at data that already exists, and states no price
 * of its own.
 *
 * ---
 *
 * **`demo` is `Commitment<string>`, and all thirty are now `set`.** They were
 * `pending` until the gallery was actually deployed — a tile with a pending
 * demo renders its screenshot and no "ver ejemplo" link, exactly the way
 * `portfolioLink()` (`lib/content/projections.ts`) returns `undefined` rather
 * than pointing at a case study that has not shipped. Switching them over cost
 * one data edit and no component change, which is what that modelling bought.
 * Each URL was verified returning 200 with real content before being written
 * here; see `deployed()` below for why they are not derived.
 *
 * **Every `features` entry is a behaviour verified in the template source, not
 * a benefit written for this page.** The wedding list was read off
 * `electrocode-studio-templates/templates/invitaciones/aurum-wine-ii/src/config/invitation.ts`
 * and its section
 * components (`WelcomeGate`, `CountdownSection`, `EventsSection` with its
 * Google/Outlook/`.ics` links, `RsvpSection`, `GallerySection`, `PartySection`,
 * `GiftsSection`, `SocialSection`), and the collection's own README states the
 * skins share one engine. The biolink list comes from
 * `electrocode-studio-templates/templates/biolinks/README.md`'s
 * "What every template shares". Do not add an entry here that cannot be pointed
 * at in one of those two repositories — this is the exact surface where a
 * pleasant, uncheckable sentence would look most at home, the same warning
 * `WayOfWorkingDictionary` carries for the commitments grid.
 *
 * ---
 *
 * **`wedding-invitation/piero-cielo` is deliberately absent from
 * `WEDDING_TEMPLATES`.** It is a real couple's private invitation, and
 * `lib/content/projects/index.ts` records it as
 * `consent: { status: "withheld" }` with `evidence: { state: "no-visual",
 * media: [] }` and the note "No recorded consent exists to publish anything
 * identifying". Putting its screenshot in a public gallery would contradict
 * that record directly — it is finding C1 (an unconsented capture) all over
 * again. It is not a template; it is client work that happens to live in the
 * same repository. `checkTemplatesExcludeWithheldWork` in
 * `lib/content/invariants.ts` fails the build if it ever reappears here.
 */

import type { Commitment, Localized, MediaAsset } from "./types";
import type { ServiceLine } from "./service-lines";
import type { PriceToken } from "./pricing";

import retroBeige from "@/public/plantillas/biolinks/01-retro-beige.png";
import festiveDark from "@/public/plantillas/biolinks/02-festive-dark.png";
import cleanSoft from "@/public/plantillas/biolinks/03-clean-soft.png";
import glassBlue from "@/public/plantillas/biolinks/04-glass-blue.png";
import neonPink from "@/public/plantillas/biolinks/05-neon-pink.png";
import brutalistMono from "@/public/plantillas/biolinks/06-brutalist-mono.png";
import terminalGreen from "@/public/plantillas/biolinks/07-terminal-green.png";
import sunsetGradient from "@/public/plantillas/biolinks/08-sunset-gradient.png";
import noirLuxe from "@/public/plantillas/biolinks/09-noir-luxe.png";
import y2kSticker from "@/public/plantillas/biolinks/10-y2k-sticker.png";
import blueprintGrid from "@/public/plantillas/biolinks/11-blueprint-grid.png";
import editorialPress from "@/public/plantillas/biolinks/12-editorial-press.png";
import botanicalLinen from "@/public/plantillas/biolinks/13-botanical-linen.png";
import claySoft from "@/public/plantillas/biolinks/14-clay-soft.png";
import vinylGroove from "@/public/plantillas/biolinks/15-vinyl-groove.png";

import aurumWine from "@/public/plantillas/invitaciones/aurum-wine-ii.png";
import deluxeClassic from "@/public/plantillas/invitaciones/deluxe-classic.png";
import hojas from "@/public/plantillas/invitaciones/hojas.png";
import magnoliasOlive from "@/public/plantillas/invitaciones/magnolias-olive-ii.png";
import vintage from "@/public/plantillas/invitaciones/vintage.png";
import white from "@/public/plantillas/invitaciones/white.png";
import artDeco from "@/public/plantillas/invitaciones/art-deco.png";
import azulTalavera from "@/public/plantillas/invitaciones/azul-talavera.png";
import campoLavanda from "@/public/plantillas/invitaciones/campo-lavanda.png";
import minimalTinta from "@/public/plantillas/invitaciones/minimal-tinta.png";
import nocheEstrellada from "@/public/plantillas/invitaciones/noche-estrellada.png";
import papelKraft from "@/public/plantillas/invitaciones/papel-kraft.png";
import rosaPolvo from "@/public/plantillas/invitaciones/rosa-polvo.png";
import selvaTropical from "@/public/plantillas/invitaciones/selva-tropical.png";
import terracotaSol from "@/public/plantillas/invitaciones/terracota-sol.png";

/**
 * The two catalogues. `slug` is the URL segment under `/[locale]/plantillas/`,
 * so it is also what `templatesPath()` (`lib/links.ts`) builds from and what
 * `generateStaticParams` enumerates — one string, never re-typed per consumer.
 */
export type TemplateFamilyId = "biolinks" | "invitaciones";

export type TemplateFamily = {
  readonly id: TemplateFamilyId;
  /** Which line of the fixed catalogue this family is sold under. */
  readonly serviceLine: ServiceLine;
  /** The figure this family is priced at, resolved from `PRICES`. */
  readonly priceToken: PriceToken;
  readonly name: Localized<string>;
  readonly tagline: Localized<string>;
  /**
   * The design shown running inside the phone frame at the top of the family
   * page (`components/templates/template-phone.tsx`).
   *
   * **Named explicitly rather than taken as `templatesByFamily(id)[0]`.** Array
   * order is an editing accident — reordering the catalogue, or inserting a new
   * design at the top, would silently change which template every visitor sees
   * first, and nothing would fail. Naming it makes that a decision. It also
   * makes the requirement checkable: `checkFamilyFeaturedTemplateIsLive`
   * (`lib/content/invariants.ts`) fails the build if this slug is not in the
   * family, or if its `demo` is not `set` — the frame has no URL to load in
   * either case.
   */
  readonly featured: string;
  /** Verified behaviours — see this module's doc comment. */
  readonly features: readonly [Localized<string>, ...Localized<string>[]];
  /** The three steps between picking a design and having it live. */
  readonly steps: readonly [Localized<string>, ...Localized<string>[]];
};

export type Template = {
  readonly slug: string;
  readonly family: TemplateFamilyId;
  /** The design's own name. A proper noun — not translated per locale. */
  readonly name: string;
  readonly direction: Localized<string>;
  readonly bestFor: Localized<string>;
  readonly preview: MediaAsset;
  /**
   * The published demo. `set` for every entry today; a tile whose demo is
   * `pending` renders no link at all. See this module's doc comment.
   */
  readonly demo: Commitment<string>;
};

/**
 * Where the built demos are served from — one static site holding every
 * template under `/<family>/<slug>/`, built by the `electrocode-templates`
 * repository's `build.mjs`.
 *
 * A constant rather than thirty literal origins: pointing the gallery at a
 * custom domain later is one edit here, not thirty chances to leave one
 * behind.
 */
const DEMO_ORIGIN = "https://electrocode-templates.vercel.app";

/**
 * A template whose demo is live.
 *
 * **Deliberately called per template rather than derived from `family`/`slug`
 * inside the projection.** A derived URL would hand every future entry a demo
 * link the moment it is added to this file — including one whose demo has not
 * been deployed yet — which is exactly the dead-link failure `Commitment`
 * exists to prevent. Calling this is the deliberate act that says "I checked,
 * it is live". All thirty below were verified returning 200 with real content
 * before being switched over.
 *
 * The `family`/`slug` arguments repeat what the entry already declares, so
 * `checkTemplateDemoMatchesItsSlug` (`lib/content/invariants.ts`) fails the
 * build if a copy-pasted entry ends up pointing at its neighbour's demo.
 */
function deployed(family: TemplateFamilyId, slug: string): Commitment<string> {
  return { status: "set", value: `${DEMO_ORIGIN}/${family}/${slug}/` };
}

/**
 * For a template that exists in the catalogue but is not deployed yet. Nothing
 * uses it today — all thirty are live — and it stays because the honest state
 * for a new design added before its demo ships is this one, not a guessed URL.
 * A tile with a pending demo renders its screenshot and no link.
 */
export const NO_DEMO: Commitment<string> = { status: "pending" };

export const TEMPLATE_FAMILIES = {
  biolinks: {
    id: "biolinks",
    serviceLine: "C",
    priceToken: "microsite-basic",
    name: { es: "Biolinks" },
    tagline: {
      es: "Una sola página con todos tus enlaces, para poner en la biografía de tus redes. Quince diseños terminados; eliges uno y lo llenamos con lo tuyo.",
    },
    // The most neutral of the ten: the frame has to show what the PRODUCT is
    // (foto, descripción, lista de enlaces, redes) before it shows a point of
    // view, and Terminal Green or Y2K Sticker would lead with the point of view.
    featured: "03-clean-soft",
    features: [
      {
        es: "Página estática que no envía JavaScript al navegador: todo lo que se mueve está hecho con CSS.",
      },
      {
        es: "Lista de enlaces con icono y nota opcional en cada uno, más una fila de redes sociales.",
      },
      {
        es: "Un solo archivo de configuración define nombre, descripción, redes, enlaces, pie y metadatos.",
      },
      {
        es: "La configuración tiene la misma forma en las quince plantillas: lo escrito para una funciona en otra sin reescribirlo.",
      },
      {
        es: "Iconos dibujados dentro del propio proyecto, sin depender de librerías externas.",
      },
      {
        es: "Etiqueta accesible en cada icono social, foco visible al navegar con teclado y capas decorativas ocultas al lector de pantalla.",
      },
      {
        es: "Toda animación se desactiva para quien tiene activado el movimiento reducido en su sistema.",
      },
      {
        es: "Metadatos y tarjeta para compartir en redes configurables desde el mismo archivo.",
      },
    ],
    steps: [
      { es: "Eliges uno de los quince diseños." },
      { es: "Nos pasas tus enlaces, tus redes y tu foto." },
      { es: "Lo publicamos en tu dominio y te entregamos el enlace." },
    ],
  },
  invitaciones: {
    id: "invitaciones",
    serviceLine: "C",
    priceToken: "microsite-event",
    name: { es: "Invitaciones de boda" },
    tagline: {
      es: "Una invitación digital que tus invitados abren desde el celular: cuenta regresiva, ubicación, confirmación de asistencia y galería. Quince diseños terminados.",
    },
    // The one whose `features` list above was read off directly, so scrolling
    // the frame walks the same sections this page enumerates — including the
    // portada de bienvenida, which is the first thing a visitor should meet.
    featured: "aurum-wine-ii",
    features: [
      {
        es: "Portada de bienvenida con los nombres de la pareja, que el invitado abre para entrar.",
      },
      {
        es: "Música de fondo opcional: el invitado elige entrar con sonido o sin él.",
      },
      {
        es: "Cuenta regresiva hasta la fecha, configurada con zona horaria explícita para que sea correcta desde cualquier país.",
      },
      {
        es: "Ceremonia y celebración con lugar, dirección y horario de cada una.",
      },
      {
        es: "Botón para agendar cada evento en Google Calendar, en Outlook o descargando el archivo .ics.",
      },
      { es: "Confirmación de asistencia que llega por WhatsApp." },
      { es: "Galería de fotos de la pareja." },
      { es: "Bloque de fiesta con los acompañantes y la logística del evento." },
      {
        es: "Datos para regalos: cuenta bancaria y Yape/Plin, cada uno con botón de copiar.",
      },
      { es: "Saludo con el nombre de los invitados." },
      { es: "Enlaces a redes y hashtag del evento." },
      {
        es: "Todo el contenido de la invitación vive en un solo archivo de configuración.",
      },
      {
        es: "Toda animación se desactiva para quien tiene activado el movimiento reducido en su sistema.",
      },
    ],
    steps: [
      { es: "Eliges uno de los quince diseños." },
      {
        es: "Nos pasas los datos de la boda, las fotos y a quiénes va dirigida.",
      },
      { es: "La publicamos y te entregamos el enlace para repartir." },
    ],
  },
} as const satisfies Record<TemplateFamilyId, TemplateFamily>;

/**
 * The fifteen biolink designs
 * (`electrocode-studio-templates/templates/biolinks`).
 *
 * `direction` and `bestFor` are that collection's own README table, translated —
 * not new copy. Eight are light and seven dark, two (`06` and `11`) are
 * left-aligned, and no two share a typeface; the descriptions below are what
 * makes that visible in a grid where every tile is the same size.
 *
 * **Five of the fifteen exist to be told apart from an older sibling**, and the
 * `direction` copy for those five carries that distinction rather than a
 * general mood: `11` says "plano" where `07` is a terminal, `12` says "sin una
 * sola caja" where `06` is built from them, `13` says "tela, no papel" against
 * `03`, `14` says "sin un solo borde", and `15` says "marrón tostado" against
 * `09`'s near-black. A visitor scanning a grid of fifteen tiles is choosing,
 * not reading — if two descriptions could be swapped without anyone noticing,
 * one of the two designs is not earning its place in the catalogue.
 */
export const BIOLINK_TEMPLATES: readonly Template[] = [
  {
    slug: "01-retro-beige",
    family: "biolinks",
    name: "Retro Beige",
    direction: {
      es: "Papelería de papel prensado. Tipografía de máquina de escribir, contornos de tinta, sombras duras y marcas de corte.",
    },
    bestFor: { es: "Coaches, autores y creadores independientes" },
    preview: {
      asset: retroBeige,
      alt: {
        es: "Biolink Retro Beige: fondo beige de papel, nombre en tipografía de máquina de escribir y botones de enlace con sombra dura",
      },
    },
    demo: deployed("biolinks", "01-retro-beige"),
  },
  {
    slug: "02-festive-dark",
    family: "biolinks",
    name: "Festive Dark",
    direction: {
      es: "Tarjeta de invierno. Fondo verde bosque, nieve en CSS, acebo y esferas, e iconos con el color de cada marca.",
    },
    bestFor: { es: "Músicos y campañas de temporada" },
    preview: {
      asset: festiveDark,
      alt: {
        es: "Biolink Festive Dark: fondo verde oscuro con nieve y adornos navideños sobre una lista de enlaces",
      },
    },
    demo: deployed("biolinks", "02-festive-dark"),
  },
  {
    slug: "03-clean-soft",
    family: "biolinks",
    name: "Clean Soft",
    direction: {
      es: "Editorial y tranquilo. Blanco roto cálido, descripción en serif itálica y botones blancos flotando.",
    },
    bestFor: { es: "Creadores, consultores y públicos amplios" },
    preview: {
      asset: cleanSoft,
      alt: {
        es: "Biolink Clean Soft: fondo blanco cálido, descripción en serif itálica y botones blancos con sombra suave",
      },
    },
    demo: deployed("biolinks", "03-clean-soft"),
  },
  {
    slug: "04-glass-blue",
    family: "biolinks",
    name: "Glass Blue",
    direction: {
      es: "Cristal esmerilado sobre una malla de degradados azules, con desenfoque real detrás de cada panel.",
    },
    bestFor: { es: "Artistas, fotógrafos y trabajo visual" },
    preview: {
      asset: glassBlue,
      alt: {
        es: "Biolink Glass Blue: paneles de cristal esmerilado sobre un fondo azul degradado",
      },
    },
    demo: deployed("biolinks", "04-glass-blue"),
  },
  {
    slug: "05-neon-pink",
    family: "biolinks",
    name: "Neon Pink",
    direction: {
      es: "Alto y brillante. Magenta tramado, botones gruesos y una franja de texto en movimiento.",
    },
    bestFor: { es: "Belleza, moda y marcas de personalidad" },
    preview: {
      asset: neonPink,
      alt: {
        es: "Biolink Neon Pink: fondo magenta tramado con botones gruesos y una franja de texto desplazándose",
      },
    },
    demo: deployed("biolinks", "05-neon-pink"),
  },
  {
    slug: "06-brutalist-mono",
    family: "biolinks",
    name: "Brutalist Mono",
    direction: {
      es: "Blanco y negro sin adornos. Retícula visible, filas numeradas que se invierten al pasar el cursor, nada redondeado y todo alineado a la izquierda.",
    },
    bestFor: { es: "Diseñadores, estudios y arquitectos" },
    preview: {
      asset: brutalistMono,
      alt: {
        es: "Biolink Brutalist Mono: composición en blanco y negro con retícula visible y filas de enlaces numeradas",
      },
    },
    demo: deployed("biolinks", "06-brutalist-mono"),
  },
  {
    slug: "07-terminal-green",
    family: "biolinks",
    name: "Terminal Green",
    direction: {
      es: "Monitor de fósforo. Líneas de barrido, brillo verde, ventana de terminal y enlaces escritos como comandos.",
    },
    bestFor: { es: "Desarrollo, seguridad y hardware" },
    preview: {
      asset: terminalGreen,
      alt: {
        es: "Biolink Terminal Green: ventana de terminal negra con texto verde y enlaces escritos como comandos de consola",
      },
    },
    demo: deployed("biolinks", "07-terminal-green"),
  },
  {
    slug: "08-sunset-gradient",
    family: "biolinks",
    name: "Sunset Gradient",
    direction: {
      es: "Hora dorada en movimiento lento. Degradado cálido animado bajo paneles de cristal blanco.",
    },
    bestFor: { es: "Viajes, estilo de vida y públicos generales" },
    preview: {
      asset: sunsetGradient,
      alt: {
        es: "Biolink Sunset Gradient: degradado cálido de atardecer con paneles de cristal blanco encima",
      },
    },
    demo: deployed("biolinks", "08-sunset-gradient"),
  },
  {
    slug: "09-noir-luxe",
    family: "biolinks",
    name: "Noir Luxe",
    direction: {
      es: "Caro y silencioso. Casi negro, filetes color champán y serif de alto contraste. Sin un solo relleno.",
    },
    bestFor: { es: "Joyería, hotelería, clínicas y lujo" },
    preview: {
      asset: noirLuxe,
      alt: {
        es: "Biolink Noir Luxe: fondo casi negro con filetes dorados finos y tipografía serif de alto contraste",
      },
    },
    demo: deployed("biolinks", "09-noir-luxe"),
  },
  {
    slug: "10-y2k-sticker",
    family: "biolinks",
    name: "Y2K Sticker",
    direction: {
      es: "Álbum de recortes. Damero pastel, stickers torcidos con sombra dura y destellos parpadeando.",
    },
    bestFor: { es: "Músicos, streamers e ilustradores" },
    preview: {
      asset: y2kSticker,
      alt: {
        es: "Biolink Y2K Sticker: damero pastel con stickers torcidos y destellos alrededor de los enlaces",
      },
    },
    demo: deployed("biolinks", "10-y2k-sticker"),
  },
  {
    slug: "11-blueprint-grid",
    family: "biolinks",
    name: "Blueprint Grid",
    direction: {
      es: "Plano de taller. Fondo tinta con retícula fina, marcas de registro en las esquinas de la foto y cada enlace anotado como una cota.",
    },
    bestFor: { es: "Ingeniería, perfiles técnicos y hardware" },
    preview: {
      asset: blueprintGrid,
      alt: {
        es: "Biolink Blueprint Grid: fondo azul tinta con retícula de plano técnico y filas de enlaces numeradas con una anotación a la derecha",
      },
    },
    demo: deployed("biolinks", "11-blueprint-grid"),
  },
  {
    slug: "12-editorial-press",
    family: "biolinks",
    name: "Editorial Press",
    direction: {
      es: "Cabecera de periódico. Papel prensa, el nombre en mayúsculas condensadas al mayor tamaño de la familia y un solo rojo de acento. Sin una sola caja.",
    },
    bestFor: { es: "Periodismo, newsletters y medios" },
    preview: {
      asset: editorialPress,
      alt: {
        es: "Biolink Editorial Press: papel color crema con el nombre en mayúsculas condensadas entre dos líneas gruesas y una lista de enlaces tipo sumario",
      },
    },
    demo: deployed("biolinks", "12-editorial-press"),
  },
  {
    slug: "13-botanical-linen",
    family: "biolinks",
    name: "Botanical Linen",
    direction: {
      es: "Tela, no papel. Lino con trama visible, ramas de salvia creciendo desde las esquinas y tarjetas rematadas en arco.",
    },
    bestFor: { es: "Talleres artesanales, floristería y bienestar" },
    preview: {
      asset: botanicalLinen,
      alt: {
        es: "Biolink Botanical Linen: fondo de lino claro con ramas verdes dibujadas a línea y botones color crema rematados en arco",
      },
    },
    demo: deployed("biolinks", "13-botanical-linen"),
  },
  {
    slug: "14-clay-soft",
    family: "biolinks",
    name: "Clay Soft",
    direction: {
      es: "Arcilla moldeada. Una sola losa lila y cada control es ese mismo color sacado en relieve o hundido en él. Sin un solo borde.",
    },
    bestFor: { es: "Diseño de producto y marcas de trato suave" },
    preview: {
      asset: claySoft,
      alt: {
        es: "Biolink Clay Soft: fondo lila uniforme con botones del mismo color en relieve, definidos solo por luz y sombra",
      },
    },
    demo: deployed("biolinks", "14-clay-soft"),
  },
  {
    slug: "15-vinyl-groove",
    family: "biolinks",
    name: "Vinyl Groove",
    direction: {
      es: "Funda de disco de los setenta. Marrón tostado, surcos girando detrás de la foto y los enlaces como lista de temas, con cara y duración.",
    },
    bestFor: { es: "Música, DJs, radio y sellos" },
    preview: {
      asset: vinylGroove,
      alt: {
        es: "Biolink Vinyl Groove: fondo marrón oscuro con un disco de vinilo detrás de la foto y enlaces en forma de lista de temas numerados",
      },
    },
    demo: deployed("biolinks", "15-vinyl-groove"),
  },
];

/**
 * The fifteen publishable wedding-invitation designs
 * (`electrocode-studio-templates/templates/invitaciones`).
 *
 * `piero-cielo` is a further folder in that collection and is NOT here — see
 * this module's doc comment for why, and `checkTemplatesExcludeWithheldWork`
 * (`lib/content/invariants.ts`) for the gate that keeps it out.
 *
 * **The first six are visual rebuilds of Fixdate references; the nine after
 * them are original designs on the same engine.** That distinction is worth
 * keeping in view when writing `direction` copy for a new entry: the rebuilds
 * describe a reference, the originals have to justify themselves against the
 * sibling they were built from. Each of the nine names that sibling in its own
 * README — `terracota-sol` against `hojas`, `art-deco` against `aurum-wine-ii`,
 * `minimal-tinta` against `white`, and so on — and the `direction` line here is
 * the one-sentence version of that argument. If two of these could be swapped
 * without a visitor noticing, one of the two designs is not earning its tile.
 */
export const WEDDING_TEMPLATES: readonly Template[] = [
  {
    slug: "aurum-wine-ii",
    family: "invitaciones",
    name: "Aurum Wine II",
    direction: {
      es: "Vino sobre dorado. Portada fotográfica y bordes florales entre cada bloque, todos distintos entre sí.",
    },
    bestFor: { es: "Bodas de noche, con paleta cálida y ornamento" },
    preview: {
      asset: aurumWine,
      alt: {
        es: "Invitación Aurum Wine II: fondo vino con guirnaldas doradas y los nombres de la pareja en serif",
      },
    },
    demo: deployed("invitaciones", "aurum-wine-ii"),
  },
  {
    slug: "deluxe-classic",
    family: "invitaciones",
    name: "Deluxe Classic",
    direction: {
      es: "Portada partida entre fotografía y tarjeta grabada, monograma en lugar de nombres y doble filete alrededor de cada bloque.",
    },
    bestFor: { es: "Bodas formales y de etiqueta" },
    preview: {
      asset: deluxeClassic,
      alt: {
        es: "Invitación Deluxe Classic: portada dividida entre fotografía y tarjeta grabada con monograma",
      },
    },
    demo: deployed("invitaciones", "deluxe-classic"),
  },
  {
    slug: "hojas",
    family: "invitaciones",
    name: "Hojas",
    direction: {
      es: "Follaje y marco dorado, con ondas separando las secciones. El más botánico de la familia.",
    },
    bestFor: { es: "Bodas de día, jardín y aire libre" },
    preview: {
      asset: hojas,
      alt: {
        es: "Invitación Hojas: follaje verde y marco dorado alrededor de los nombres de la pareja",
      },
    },
    demo: deployed("invitaciones", "hojas"),
  },
  {
    slug: "magnolias-olive-ii",
    family: "invitaciones",
    name: "Magnolias Olive II",
    direction: {
      es: "Tema oscuro en oliva con texto crema, sin portada fotográfica. Cada adorno es línea, nunca relleno.",
    },
    bestFor: { es: "Bodas de campo y paletas naturales oscuras" },
    preview: {
      asset: magnoliasOlive,
      alt: {
        es: "Invitación Magnolias Olive II: fondo oliva oscuro con magnolias y olivo dibujados a línea y texto crema",
      },
    },
    demo: deployed("invitaciones", "magnolias-olive-ii"),
  },
  {
    slug: "vintage",
    family: "invitaciones",
    name: "Vintage",
    direction: {
      es: "Bandas crema, menta y gris unidas por costuras onduladas. Etiquetas tipo medallón y botones de filete dorado.",
    },
    bestFor: { es: "Bodas con aire retro y paleta suave" },
    preview: {
      asset: vintage,
      alt: {
        es: "Invitación Vintage: bandas crema y menta separadas por ondas, con medallones dorados",
      },
    },
    demo: deployed("invitaciones", "vintage"),
  },
  {
    slug: "white",
    family: "invitaciones",
    name: "White",
    direction: {
      es: "El más contenido de la familia: filetes dorados sobre blanco, nada enmarcado y ningún ornamento.",
    },
    bestFor: { es: "Bodas minimalistas" },
    preview: {
      asset: white,
      alt: {
        es: "Invitación White: fondo blanco con filetes dorados finos y tipografía script",
      },
    },
    demo: deployed("invitaciones", "white"),
  },
  {
    slug: "terracota-sol",
    family: "invitaciones",
    name: "Terracota Sol",
    direction: {
      es: "Tarde mediterránea. La foto va recortada dentro de un arco de herradura sobre barro cocido, con ramas de olivo y arquerías entre secciones.",
    },
    bestFor: { es: "Bodas de campo cálidas y celebraciones al aire libre" },
    preview: {
      asset: terracotaSol,
      alt: {
        es: "Invitación Terracota Sol: fondo color piedra con la fotografía recortada dentro de un arco de herradura, ramas de olivo en las esquinas y una arquería en el borde inferior",
      },
    },
    demo: deployed("invitaciones", "terracota-sol"),
  },
  {
    slug: "azul-talavera",
    family: "invitaciones",
    name: "Azul Talavera",
    direction: {
      es: "Cerámica esmaltada. Portada sin foto: un muro de azulejos cobalto con los nombres en una placa reservada. Solo dos colores.",
    },
    bestFor: { es: "Bodas con raíz artesanal y paletas frías" },
    preview: {
      asset: azulTalavera,
      alt: {
        es: "Invitación Azul Talavera: muro de azulejos cobalto y blanco, con los nombres dentro de una placa blanca enmarcada. Sin fotografía",
      },
    },
    demo: deployed("invitaciones", "azul-talavera"),
  },
  {
    slug: "noche-estrellada",
    family: "invitaciones",
    name: "Noche Estrellada",
    direction: {
      es: "Cielo despejado. Tres profundidades de azul medianoche y oro de estrella; el adorno son constelaciones trazadas, no plantas.",
    },
    bestFor: { es: "Bodas de noche y ceremonias al aire libre" },
    preview: {
      asset: nocheEstrellada,
      alt: {
        es: "Invitación Noche Estrellada: fondo azul medianoche con constelaciones doradas y los nombres en mayúsculas romanas",
      },
    },
    demo: deployed("invitaciones", "noche-estrellada"),
  },
  {
    slug: "rosa-polvo",
    family: "invitaciones",
    name: "Rosa Polvo",
    direction: {
      es: "Rosa empolvado sobre papel rubor. La foto va en un camafeo ovalado y todo remate es flor prensada. Sin un solo metal.",
    },
    bestFor: { es: "Bodas románticas de día y paletas suaves" },
    preview: {
      asset: rosaPolvo,
      alt: {
        es: "Invitación Rosa Polvo: tarjeta sobre papel rubor con la fotografía en un camafeo ovalado, monograma debajo y ramos de rosas prensadas en las esquinas",
      },
    },
    demo: deployed("invitaciones", "rosa-polvo"),
  },
  {
    slug: "selva-tropical",
    family: "invitaciones",
    name: "Selva Tropical",
    direction: {
      es: "Selva al anochecer. La foto se ve entre hojas de monstera que entran por las cuatro esquinas. Verdes profundos, ninguna flor.",
    },
    bestFor: { es: "Bodas de destino y celebraciones en clima cálido" },
    preview: {
      asset: selvaTropical,
      alt: {
        es: "Invitación Selva Tropical: fotografía de la pareja vista entre hojas de monstera que entran desde las cuatro esquinas",
      },
    },
    demo: deployed("invitaciones", "selva-tropical"),
  },
  {
    slug: "papel-kraft",
    family: "invitaciones",
    name: "Papel Kraft",
    direction: {
      es: "Cartón de encomienda, cordel y sello de goma. La foto va pegada con cinta como una polaroid torcida, no a sangre.",
    },
    bestFor: { es: "Bodas rústicas y de estilo sin adornos" },
    preview: {
      asset: papelKraft,
      alt: {
        es: "Invitación Papel Kraft: tablero de cartón con la fotografía pegada con cinta como una polaroid torcida y los nombres en máquina de escribir",
      },
    },
    demo: deployed("invitaciones", "papel-kraft"),
  },
  {
    slug: "art-deco",
    family: "invitaciones",
    name: "Art Déco",
    direction: {
      es: "Laca negra y pan de oro, 1925. Portada sin foto: un sol de rayos y una cartela escalonada. Cada adorno es geometría exacta, nada al azar.",
    },
    bestFor: { es: "Bodas de gala y celebraciones de noche" },
    preview: {
      asset: artDeco,
      alt: {
        es: "Invitación Art Déco: fondo negro laca con un gran sol dorado de rayos y los nombres dentro de una cartela escalonada. Sin fotografía",
      },
    },
    demo: deployed("invitaciones", "art-deco"),
  },
  {
    slug: "campo-lavanda",
    family: "invitaciones",
    name: "Campo Lavanda",
    direction: {
      es: "Campo de Provenza en julio. La foto va en una ventana en arco sobre blanco, con espigas de lavanda a los lados. El color nunca toca el fondo.",
    },
    bestFor: { es: "Bodas de día con paleta fría y suave" },
    preview: {
      asset: campoLavanda,
      alt: {
        es: "Invitación Campo Lavanda: fondo blanco con la fotografía dentro de una ventana en arco y espigas de lavanda a los lados",
      },
    },
    demo: deployed("invitaciones", "campo-lavanda"),
  },
  {
    slug: "minimal-tinta",
    family: "invitaciones",
    name: "Minimal Tinta",
    direction: {
      es: "Una sola tinta sobre un solo papel. Portada sin foto y sin adorno: solo los nombres en didona, al mayor tamaño de la familia.",
    },
    bestFor: { es: "Bodas minimalistas y de tono contemporáneo" },
    preview: {
      asset: minimalTinta,
      alt: {
        es: "Invitación Minimal Tinta: papel hueso con los nombres apilados en serif didona a gran tamaño y una sola línea fina. Sin fotografía ni ornamento",
      },
    },
    demo: deployed("invitaciones", "minimal-tinta"),
  },
];

export const TEMPLATES: readonly Template[] = [
  ...BIOLINK_TEMPLATES,
  ...WEDDING_TEMPLATES,
];

/**
 * The design a family leads with, resolved from its own `featured` slug.
 *
 * Returns `undefined` rather than falling back to the first design if the slug
 * does not match: a silent fallback would render a phone showing a template
 * nobody chose and hide the typo forever. The build-time gate is
 * `checkFamilyFeaturedTemplateIsLive` (`lib/content/invariants.ts`); this
 * signature is what lets the page render without one instead of throwing.
 */
export function featuredTemplate(family: TemplateFamilyId): Template | undefined {
  const { featured } = TEMPLATE_FAMILIES[family];
  return templatesByFamily(family).find((template) => template.slug === featured);
}

/** Every template in one family, in catalogue order. */
export function templatesByFamily(family: TemplateFamilyId): readonly Template[] {
  return TEMPLATES.filter((template) => template.family === family);
}

/**
 * How many designs a family offers.
 *
 * Rendered as a count on the landing teaser and the family pages, the same
 * "figure comes from the data, the copy only wraps it" split
 * `LAUNCH_PRICING_SLOTS` and `PROCESS.revisionRoundsIncluded` already use — so
 * publishing a wrong number would take deleting a template, not editing a
 * sentence.
 */
export function templateCount(family: TemplateFamilyId): number {
  return templatesByFamily(family).length;
}
