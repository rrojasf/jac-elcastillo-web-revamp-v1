import type { ReactNode } from "react";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Tiles } from "@/components/atoms/Tiles";

type Size = "sm";

const sizes: Record<Size, string> = {
  sm: "py-10 md:py-14",
};

type HeroProps = {
  title: string;
  eyebrow?: string;
  size?: Size;
  children?: ReactNode;
};

export function Hero({ title, eyebrow, size = "sm", children }: HeroProps) {
  return (
    <section className="border-b border-line bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[18px_18px]">
      <Container size="wide" className={`relative ${sizes[size]}`}>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf-deep motion-safe:animate-rise">
            {eyebrow}
          </p>
        )}
        <Heading level={1} className="mt-2 max-w-3xl motion-safe:animate-rise">
          {title}
        </Heading>
        {children && <div className="mt-3 text-lg text-muted">{children}</div>}
        <Tiles
          animated
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-6 md:grid"
        />
      </Container>
    </section>
  );
}
