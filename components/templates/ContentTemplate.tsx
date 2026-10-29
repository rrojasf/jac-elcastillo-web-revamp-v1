import type { ReactNode } from "react";
import { Container } from "@/components/atoms/Container";
import { DateText } from "@/components/atoms/DateText";
import { Prose } from "@/components/atoms/Prose";
import { Hero } from "@/components/organisms/Hero";
import type { SafeHtml } from "@/lib/types";

type ContentTemplateProps = {
  title: string;
  eyebrow?: string;
  date?: string;
  html?: SafeHtml;
  children?: ReactNode;
};

export function ContentTemplate({
  title,
  eyebrow,
  date,
  html,
  children,
}: ContentTemplateProps) {
  return (
    <>
      <Hero size="sm" title={title} eyebrow={eyebrow}>
        {date && <DateText iso={date} />}
      </Hero>
      <Container className="py-10 md:py-14">
        {html && <Prose html={html} />}
        {children}
      </Container>
    </>
  );
}
