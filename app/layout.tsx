import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { DEFAULT_LOCALE } from "@/lib/content/locales";

/**
 * Single-family typography (green restyle).
 *
 * This replaces the previous editorial pairing of a display serif
 * (`Fraunces`, with its `opsz`/`WONK` axes) and a body grotesque (`Karla`).
 * The reference direction this restyle follows sets EVERY element —
 * navigation, display headings, body copy, buttons, form labels — in
 * Montserrat, with hierarchy carried by weight and scale rather than by a
 * change of voice. Keeping a serif for headings would have been a different
 * design, not this one.
 *
 * Loaded as a variable font (no explicit `weight` array) so the full 100–900
 * range is available to the heavy display sizes and the light body copy
 * alike from a single download, with `display: "swap"` (no invisible-text
 * flash while the face downloads).
 *
 * Exposed as one CSS variable and wired to BOTH the Tailwind v4
 * `font-display` and `font-sans` utilities in `app/globals.css`'s
 * `@theme inline` block — the two utilities are kept distinct there even
 * though they currently resolve to the same family, so every existing
 * `font-display` call site in the codebase keeps working untouched. Never
 * referenced as raw `--font-montserrat` anywhere outside this file and that
 * one block.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const SITE_TITLE = "ElectroCode Studio";
const SITE_DESCRIPTION =
  "ElectroCode Studio diseña y desarrolla sitios web y aplicaciones a medida para negocios que quieren destacar en línea.";

// `NEXT_PUBLIC_SITE_URL` is a human task (2.H2, still open) — falls back to
// localhost so `npm run build` never fails on its absence. Without
// `metadataBase`, canonical/OG URLs render relative and are useless to
// crawlers (design.md D2).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  // NO `alternates.canonical` here, deliberately.
  //
  // A canonical set in the root layout is inherited by every route, so while
  // `/es` was the only page it looked correct — and became wrong the moment
  // `/es/precios` shipped, which then declared the homepage as its canonical
  // version. That tells search engines not to index the pricing page as
  // itself, defeating the reason it earns a URL at all (proposal §5:
  // "shareable, sent directly in DMs, SEO target").
  //
  // Canonicals belong to routes, not to the shell. Each page sets its own via
  // `generateMetadata` using `canonicalFor()` in `lib/seo.ts`. A route that
  // forgets simply emits no canonical, which search engines resolve from the
  // URL — a strictly better failure than a confidently wrong one.
  alternates: {
    languages: {
      [DEFAULT_LOCALE]: `/${DEFAULT_LOCALE}`,
      "x-default": `/${DEFAULT_LOCALE}`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The fixed, low-opacity dot texture that used to sit behind every route
    // (`.bg-paper-texture`) is gone along with its utility in
    // `globals.css`. The previous "warm paper" direction needed the grain to
    // read as paper; the green direction's surfaces are flat by design —
    // depth comes from the pale page / white card / dark bar stack, and a
    // texture underneath all three only muddied it.
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
