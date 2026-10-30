import type { ComponentPropsWithoutRef } from "react";
import type { SafeHtml } from "@/lib/types";

type ProseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> & { html: SafeHtml };

export function Prose({ html, className = "", ...props }: ProseProps) {
  return (
    <div
      className={`prose prose-lg max-w-none text-ink wrap-anywhere prose-headings:font-display prose-headings:text-ink prose-a:text-brand prose-a:underline-offset-4 prose-strong:text-ink prose-img:h-auto prose-img:max-w-full prose-video:h-auto prose-video:max-w-full [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}
