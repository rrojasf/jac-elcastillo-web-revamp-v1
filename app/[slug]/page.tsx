import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentTemplate } from "@/components/templates/ContentTemplate";
import { getEntry } from "@/lib/cms/content";
import { isSlug } from "@/lib/html";

type Props = { params: Promise<{ slug: string }> };

// Pages render on first visit (ISR) so a slow WordPress cannot fail the deploy.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const entry = await getEntry(slug);
  return entry ? { title: entry.title, description: entry.excerpt } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const entry = await getEntry(slug);
  if (!entry) notFound();
  return (
    <ContentTemplate
      title={entry.title}
      eyebrow={entry.kind === "post" ? "Noticias" : undefined}
      date={entry.kind === "post" ? entry.date : undefined}
      html={entry.html}
    />
  );
}
