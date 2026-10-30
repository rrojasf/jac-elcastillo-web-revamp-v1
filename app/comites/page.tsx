import type { Metadata } from "next";
import { ListingTemplate } from "@/components/templates/ListingTemplate";
import { getPagesBySlugs } from "@/lib/cms/content";
import { COMMITTEES } from "@/lib/site";

// Rendered per request so the build never calls WordPress.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Comités" };

export default async function Page() {
  const items = await getPagesBySlugs(COMMITTEES);
  return (
    <ListingTemplate
      title="Comités"
      intro="Comités y comisiones de trabajo de la Junta."
      empty="No hay comités publicados."
      items={items}
    />
  );
}
