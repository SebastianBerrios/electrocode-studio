import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Normalize host (remove port)
  const host = hostname.split(":")[0].toLowerCase();

  // Check for client subdomains
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  const isMainStudioHost =
    host === "electrocode.lat" ||
    host === "www.electrocode.lat" ||
    host === "electrocode-studio.vercel.app" ||
    host === "www.electrocode-studio.vercel.app";

  let subdomain: string | null = null;

  if (isLocalhost) {
    // e.g. cielo-piero.localhost
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www") {
      subdomain = parts[0];
    }
  } else if (!isMainStudioHost) {
    // e.g. cielo-piero.electrocode.lat or cielo-piero.electrocode-studio.vercel.app
    if (host.endsWith(".electrocode.lat")) {
      const sub = host.replace(".electrocode.lat", "");
      if (sub && sub !== "www") subdomain = sub;
    } else if (host.endsWith(".electrocode-studio.vercel.app")) {
      const sub = host.replace(".electrocode-studio.vercel.app", "");
      if (sub && sub !== "www") subdomain = sub;
    }
  }

  // If a client subdomain was matched, rewrite to the invitation route
  if (subdomain) {
    const targetPath = `/invitaciones/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
    url.pathname = targetPath;
    return NextResponse.rewrite(url);
  }

  // If path is /[locale]/invitaciones/[slug], rewrite to /invitaciones/[slug] so it uses the clean layout
  const localeMatch = url.pathname.match(/^\/(?:es|en)\/invitaciones\/(.+)$/);
  if (localeMatch) {
    url.pathname = `/invitaciones/${localeMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, audio, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|clients/|plantillas/|projects/|logo.png|opengraph-image|robots.txt|sitemap.xml).*)",
  ],
};
