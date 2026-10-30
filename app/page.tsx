import Link from "next/link";
import { ContentTemplate } from "@/components/templates/ContentTemplate";
import { getAllSlugs } from "@/lib/cms/content";

// Rendered per request so the build never calls WordPress.
export const dynamic = "force-dynamic";

export default async function Home() {
  const slugs = await getAllSlugs();
  return (
    <ContentTemplate title="Índice temporal">
      <ul className="mt-6 list-disc pl-6">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link href={`/${slug}/`} className="underline">
              {slug}
            </Link>
          </li>
        ))}
      </ul>
    </ContentTemplate>
  );
}
