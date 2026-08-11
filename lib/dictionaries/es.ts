/**
 * Spanish dictionary. Extracted verbatim from `hero-parallax.tsx`'s
 * previously-hardcoded `Header()` (task 2.13/1.6) — no copy invented here,
 * only relocated.
 */

import type { Dictionary } from "./types";

export const es: Dictionary = {
  // The number between `prefix` and `suffix` is `LAUNCH_PRICING_SLOTS`
  // (`lib/content/pricing.ts`), rendered by the component — not written here.
  // Same split as `pricing.launchNote*` below, which wraps the same figure.
  announcement: {
    prefix: "Precios de lanzamiento para los primeros",
    suffix: "proyectos del estudio",
    linkLabel: "Ver precios",
  },
  header: {
    brand: "ElectroCode Studio",
    projectsLink: "Proyectos",
    pricingLink: "Precios",
    whatsappLink: "WhatsApp",
    logoAlt: "ElectroCode",
    briefCta: "Cuéntanos tu proyecto",
    skipToContentLabel: "Saltar al contenido principal",
  },
  footer: {
    brand: "ElectroCode Studio",
    tagline: "Desarrollo web a medida, desde Perú.",
    projectsLink: "Proyectos",
    pricingLink: "Precios",
    whatsappLink: "WhatsApp",
    logoAlt: "ElectroCode",
    servicesHeading: "Servicios",
    templatesHeading: "Plantillas",
    studioHeading: "El estudio",
    contactHeading: "Contacto",
    processLink: "Proceso",
    retainerLink: "Mantenimiento",
    briefLink: "Cuéntanos tu proyecto",
    copyright: "© {year} ElectroCode Studio",
  },
  hero: {
    // Same sentence as before the restyle, only re-split so the accent falls
    // on its natural punchline. "también" is what the line actually turns on,
    // so it is the word that carries the colour.
    heading: { lead: "Tu proyecto es único, tu web", accent: "también" },
    subtitle:
      "Tu negocio merece más que una plantilla aburrida. Diseñamos webs únicas, flexibles y listas para atraer clientes. Tú pones la idea, nosotros la magia.",
    primaryCta: "Cuéntanos tu proyecto",
    secondaryCta: "Explora nuestros proyectos",
  },
  services: {
    heading: "Servicios",
    pricingCta: "Ver precios",
  },
  process: {
    heading: "Proceso",
    approvalBadge: "Requiere tu aprobación para avanzar",
    revisionsLabel: "rondas de revisión incluidas.",
    revisionsExtra: "Rondas adicionales se cotizan aparte.",
    approvalDeadlinePrefix: "Tienes",
    approvalDeadlineSuffix:
      "días hábiles para aprobar una fase pendiente de tu revisión; pasado ese plazo, el proyecto se pausa y la fecha de entrega se recalcula.",
  },
  // Every card below restates a commitment already held as data elsewhere in
  // the repo — see `WayOfWorkingDictionary`'s doc comment for the key-by-key
  // provenance. No card may claim speed, quality, or scale.
  wayOfWorking: {
    eyebrow: "Compromisos del estudio",
    // "trabajamos" is what the line turns on — the section is about the manner,
    // not about the fact that work happens — so it is the word that carries
    // the colour. Same split as `hero.heading` above.
    heading: { lead: "Cómo", accent: "trabajamos" },
    intro:
      "Lo que puedes esperar del estudio antes de empezar, escrito antes de empezar.",
    ctaLabel: "Cuéntanos tu proyecto",
    publishedPrice: {
      title: "Precio publicado",
      body: "Cada línea de servicio tiene un precio de referencia visible en la web. No hay que pedir una cotización para saber en qué rango estás.",
    },
    noMiddlemen: {
      title: "Sin intermediarios",
      body: "Cada proyecto lo desarrolla directamente el estudio. Hablas con quien construye tu sitio, no con una capa comercial.",
    },
    approvalGates: {
      title: "Avanzas cuando apruebas",
      body: "Las fases que requieren tu visto bueno no avanzan sin él. El proyecto no se mueve a tus espaldas.",
    },
    revisionRounds: {
      title: "Rondas de revisión incluidas",
      bodyPrefix: "Cada proyecto incluye",
      bodySuffix:
        "rondas de revisión durante el desarrollo, contadas desde el principio. Las adicionales se cotizan aparte, sin sorpresas.",
    },
    itemizedScope: {
      title: "Alcance itemizado",
      body: "Lo que incluye y lo que no incluye cada plan está escrito y publicado. El límite se acuerda antes, no se discute después.",
    },
    noLockIn: {
      title: "Sin permanencia",
      body: "Un proyecto puntual termina al completarse la entrega acordada. El plan de mantenimiento se cancela con 30 días de aviso, sin penalidad.",
    },
  },
  // Framing only. The heading, questions and answers all come from
  // `pricing.faq` below, rendered through the same component the pricing page
  // uses — nothing about the FAQ's content is restated here.
  landingFaq: {
    intro:
      "Las dudas que aparecen antes de contratar, respondidas aquí y en la página de precios.",
  },
  portfolio: {
    heading: "Proyectos",
    gatedNote: "Acceso restringido: este producto requiere inicio de sesión.",
    notDeployedNote:
      "Este proyecto no cuenta con un despliegue público disponible.",
    gatedBadge: "Acceso restringido",
    notDeployedBadge: "Sin despliegue público",
  },
  // Structural labels only. Every family's name, tagline, feature list, steps
  // and price come from `lib/content/templates.ts` and `lib/content/pricing.ts`
  // — see `TemplatesDictionary`'s doc comment for the dividing line.
  templates: {
    eyebrow: "Diseños ya terminados",
    // "elegir" is what the section turns on — these are not commissioned from
    // scratch, the work is choosing one — so it is the word that carries the
    // colour. Same split as `hero.heading` and `wayOfWorking.heading`.
    heading: { lead: "Listo para", accent: "elegir" },
    intro:
      "Dos productos con el diseño ya resuelto: eliges el modelo, nos pasas tu contenido y lo publicamos. Cuestan menos que un proyecto a medida porque el diseño ya está hecho.",
    designsCountSuffix: "diseños",
    viewFamilyCta: "Ver los diseños",
    fromPrefix: "Desde",
    galleryHeading: "Modelos",
    featuresHeading: "Qué incluye",
    stepsHeading: "Cómo la obtienes",
    bestForLabel: "Ideal para",
    demoCta: "Ver ejemplo",
    viewPricingLink: "Ver precio y condiciones",
    ctaHeading: "¿Te gustó alguno?",
    ctaBody:
      "Escríbenos por WhatsApp diciéndonos qué modelo te interesa y te respondemos con los siguientes pasos.",
    ctaButtonLabel: "Escribir por WhatsApp",
  },
  authority: {
    heading: "Un producto propio, bajo la misma marca",
    // Claims here are deliberately narrow. Two earlier versions over-claimed:
    // "en producción" contradicted the very next sentence (the deployment
    // returns 404), and "de forma sostenida" implied longevity a repository
    // created 2026-07-28 cannot support. What IS verifiable is domain depth —
    // the studio builds, maintains and teaches in the same field — and that
    // stands with no deployment and no age. Do not reintroduce claims about
    // uptime, longevity, or scale.
    intro:
      "El mismo estudio que construye tu sitio desarrolla y enseña en el mismo terreno: una plataforma propia de cursos gratuitos de programación y electrónica, con la misma disciplina que aplica en el trabajo para sus clientes.",
    visitCta: "Visitar",
  },
  retainer: {
    heading: "Mantenimiento y evolución",
    responseHeading: "Tiempos de respuesta",
    includedHeading: "Qué incluye",
    excludedHeading: "Qué no incluye",
    cancellationLabel: "Cancelación:",
  },
  pricing: {
    heading: "Precios",
    introHeading: "Cómo funciona el precio",
    introBody:
      "Cada línea de servicio tiene un precio de referencia. Los planes fijos cubren un alcance definido; lo que no encaja en un plan fijo se cotiza a medida.",
    launchNotePrefix: "Precios de lanzamiento para los primeros",
    launchNoteSuffix:
      "proyectos del estudio. Pueden actualizarse más adelante para nuevos proyectos.",
    lineAHeading: "Landing pages y sitios corporativos",
    lineCHeading: "Biolinks y microsites de evento",
    lineBHeading: "Aplicaciones web y dashboards a medida",
    lineDHeading: "Mantenimiento y evolución",
    audienceLabel: "Para quién es",
    deliverablesLabel: "Qué incluye",
    notIncludedHeading: "Qué no incluye",
    turnaroundLabel: "Tiempo de entrega",
    turnaroundPendingNote: "Tiempo de entrega pendiente de definir.",
    revisionsPrefix: "Incluye",
    revisionsSuffix: "rondas de revisión.",
    quoteShapesHeading: "Tipos de proyecto habituales",
    quoteVariablesHeading: "Qué mueve el precio",
    quoteProcessHeading: "Cómo cotizamos",
    quoteFloorPrefix: "Desde",
    termsHeading: "Condiciones generales",
    alwaysIncludedHeading: "Siempre incluido",
    alwaysExtraHeading: "Siempre aparte",
    paymentScheduleLabel: "Forma de pago",
    paymentSchedulePendingNote: "Forma de pago pendiente de definir.",
    ctaHeading: "¿Conversamos sobre tu proyecto?",
    ctaBody:
      "Escríbenos por WhatsApp contándonos qué línea te interesa y te respondemos con los siguientes pasos.",
    ctaButtonLabel: "Escribir por WhatsApp",
    faq: {
      heading: "Preguntas frecuentes",
      priceReasonQuestion: "¿Por qué el precio no es más bajo?",
      priceReasonAnswer:
        "Estos ya son precios de lanzamiento, reducidos frente a lo que cobraremos una vez completados los primeros proyectos. Cada proyecto lo desarrolla directamente el estudio, sin intermediarios.",
      laterChangesQuestion: "¿Qué pasa si necesito cambios más adelante?",
      laterChangesAnswer:
        "Cada proyecto incluye rondas de revisión durante el desarrollo (ver \"Condiciones generales\"). Después de la entrega, los cambios se cubren con un plan de mantenimiento (línea Mantenimiento) o se cotizan aparte.",
      codeOwnershipQuestion: "¿Quién es dueño del código?",
      codeOwnershipPendingAnswer:
        "Pendiente de confirmar — todavía no hemos definido esta política públicamente.",
      howToLeaveQuestion: "¿Cómo puedo dejar de trabajar con el estudio?",
      // Remediation of `verify-report-final.md` finding W3 (2026-08-01): this
      // answer used to state "lo entregado es tuyo al finalizar" — a
      // code-ownership claim with no provenance anywhere in this batch's
      // supplied facts, directly contradicting `codeOwnershipPendingAnswer`
      // two questions above. Removed, not replaced with a different
      // ownership claim — the hard constraint forbids inventing that policy.
      // What remains (no permanencia in a one-off project; the retainer's
      // 30-day cancellation notice) is real and already sourced
      // (`lib/content/retainer.ts`'s `RETAINER_COMMITMENTS.cancellationTerms`).
      howToLeaveAnswer:
        "En un proyecto puntual no hay permanencia: el proyecto concluye al completarse la entrega acordada. Si estás en un plan de mantenimiento, la cancelación requiere 30 días de aviso, sin penalidad.",
    },
  },
  pricingSummary: {
    heading: "Precios",
    intro:
      "Un vistazo rápido a nuestras líneas de servicio. El detalle completo, con alcance y condiciones, está en la página de precios.",
    viewFullPricingLink: "Ver precios completos",
    fromPrefix: "Desde",
  },
  caseStudy: {
    problemHeading: "El problema",
    roleHeading: "Qué hizo el estudio",
    approachHeading: "Cómo lo abordamos",
    stackHeading: "Stack tecnológico",
    stackUnavailableNote:
      "Información de stack no disponible públicamente para este proyecto.",
    outcomeHeading: "Resultado",
    nextStepHeading: "¿Un proyecto parecido?",
    nextStepBody:
      "Conversemos sobre tu proyecto por WhatsApp o revisa el precio de referencia de esta línea de servicio.",
    viewPricingCtaLabel: "Ver precio de esta línea",
    contactCtaLabel: "Escribir por WhatsApp",
    backToProjectsLabel: "Ver más proyectos",
  },
  brief: {
    eyebrow: "Conversemos por WhatsApp",
    // "proyecto" is what the line turns on — the studio is asking about the
    // visitor's work, not about a meeting — so it is the word that carries the
    // colour. Same split as `hero.heading` and `wayOfWorking.heading` above.
    //
    // The question form is deliberate: the header CTA, the hero and the footer
    // all say "Cuéntanos tu proyecto" on the way DOWN to this card, so
    // repeating those exact words here would land as the fourth printing of
    // one sentence instead of as the moment it finally gets asked.
    heading: { lead: "¿Empezamos tu", accent: "proyecto?" },
    whatsappCtaLabel: "Escribir por WhatsApp",
  },
  gracias: {
    heading: "Gracias por tu interés",
    body:
      "Si acabas de enviar un brief, lo revisaremos y te contactaremos. Si prefieres avanzar ahora mismo, escríbenos directo por WhatsApp.",
    whatsappCtaLabel: "Escribir por WhatsApp",
    backToHomeLabel: "Volver al inicio",
  },
};
