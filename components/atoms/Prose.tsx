import type { ComponentPropsWithoutRef } from "react";
import type { SafeHtml } from "@/lib/types";

type ProseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> & { html: SafeHtml };

export function Prose({ html, className = "", ...props }: ProseProps) {
  return (
    <div
      className={`prose prose-lg max-w-none prose-img:h-auto prose-img:max-w-full prose-video:h-auto prose-video:max-w-full ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}
