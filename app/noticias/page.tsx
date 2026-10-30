import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingTemplate } from "@/components/templates/ListingTemplate";
import { getCategories, getPosts } from "@/lib/cms/content";
import { listingHref, parseListingQuery } from "@/lib/listing";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Comunicados, proyectos y actividades de la Junta de Acción Comunal Ciudad Campestre El Castillo.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  const query = parseListingQuery(await searchParams);
  if (!query) notFound();
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts(query),
  ]);
  if (!posts) notFound();
  return (
    <ListingTemplate
      title="Noticias"
      intro="Comunicados, proyectos y actividades de la Junta."
      empty="No hay noticias en esta categoría."
      items={posts.items}
      categories={categories}
      activeCategory={query.categoria}
      page={query.page}
      totalPages={posts.totalPages}
      hrefFor={(q) => listingHref("/noticias/", q)}
    />
  );
}
