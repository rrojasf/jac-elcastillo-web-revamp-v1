import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentTemplate } from "@/components/templates/ContentTemplate";
import { getAllSlugs, getEntry } from "@/lib/cms/content";
import { isSlug } from "@/lib/html";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
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
      date={entry.kind === "post" ? entry.date : undefined}
      html={entry.html}
    />
  );
}
