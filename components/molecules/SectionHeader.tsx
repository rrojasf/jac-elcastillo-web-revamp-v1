import Link from "next/link";
import { Heading } from "@/components/atoms/Heading";

type SectionHeaderProps = { title: string; href?: string; linkLabel?: string };

export function SectionHeader({ title, href, linkLabel = "Ver todas" }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <Heading level={2} size="lg">
        {title}
      </Heading>
      {href && (
        <Link href={href} className="shrink-0 font-semibold text-brand hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
