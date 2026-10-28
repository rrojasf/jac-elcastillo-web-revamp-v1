import type { ReactNode } from "react";
import { Container } from "@/components/atoms/Container";
import { DateText } from "@/components/atoms/DateText";
import { Heading } from "@/components/atoms/Heading";
import { Prose } from "@/components/atoms/Prose";
import type { SafeHtml } from "@/lib/types";

type ContentTemplateProps = {
  title: string;
  date?: string;
  html?: SafeHtml;
  children?: ReactNode;
};

export function ContentTemplate({
  title,
  date,
  html,
  children,
}: ContentTemplateProps) {
  return (
    <Container className="py-8">
      <Heading level={1}>{title}</Heading>
      {date && <DateText iso={date} className="mt-2 block text-sm text-neutral-600" />}
      {html && <Prose html={html} className="mt-6" />}
      {children}
    </Container>
  );
}
