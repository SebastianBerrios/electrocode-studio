import { notFound } from "next/navigation";
import { getClientBySlug, getAllClientSlugs } from "@/lib/clients/loader";
import { InvitationView } from "@/components/invitations/InvitationView";

export async function generateStaticParams() {
  const slugs = await getAllClientSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);

  if (!client) {
    notFound();
  }

  return <InvitationView invitation={client} />;
}
