import type { Metadata } from "next";
import { Cinzel, Jost } from "next/font/google";
import { getClientBySlug } from "@/lib/clients/loader";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-cinzel",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jost",
  fallback: ["system-ui", "sans-serif"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClientBySlug(slug);

  if (!client) {
    return {
      title: "Invitación no encontrada — ElectroCode",
    };
  }

  return {
    title: client.meta.title,
    description: client.meta.description,
    openGraph: {
      title: client.meta.title,
      description: client.meta.description,
      type: "website",
      images: client.gallery?.photos?.[0]?.src ? [client.gallery.photos[0].src] : undefined,
    },
  };
}

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${cinzel.variable} ${jost.variable}`}>
      {children}
    </div>
  );
}
