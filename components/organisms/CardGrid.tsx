import { ContentCard } from "@/components/molecules/ContentCard";
import type { Summary } from "@/lib/types";

type CardGridProps = { items: Summary[]; empty: string };

export function CardGrid({ items, empty }: CardGridProps) {
  if (items.length === 0) return <p className="text-muted">{empty}</p>;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.href} className="flex">
          <ContentCard item={item} />
        </li>
      ))}
    </ul>
  );
}
