import type { ReactNode } from "react";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";

type Size = "sm";

const sizes: Record<Size, string> = {
  sm: "py-10 md:py-14",
};

const tiles = [
  "bg-leaf",
  "bg-sky",
  "bg-white shadow-[inset_0_0_0_6px_var(--color-sun)]",
  "bg-leaf",
];

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
        <div
          aria-hidden="true"
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-6 grid-cols-2 gap-1.5 md:grid"
        >
          {tiles.map((tile, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 90}ms` }}
              className={`size-11 rounded-sm border-[3px] border-brand motion-safe:animate-rise ${tile}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
