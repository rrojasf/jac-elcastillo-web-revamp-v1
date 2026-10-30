import Image from "next/image";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Tiles } from "@/components/atoms/Tiles";
import type { Img } from "@/lib/types";

type FeatureSplitProps = {
  eyebrow?: string;
  title: string;
  text: string;
  image?: Img;
  cta: { label: string; href: string };
  reverse?: boolean;
};

export function FeatureSplit({
  eyebrow,
  title,
  text,
  image,
  cta,
  reverse = false,
}: FeatureSplitProps) {
  return (
    <Container size="wide">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div className={reverse ? "md:order-2" : ""}>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf-deep">
              {eyebrow}
            </p>
          )}
          <Heading level={2} size="lg" className="mt-2">
            {title}
          </Heading>
          <p className="mt-4 text-lg text-muted">{text}</p>
          <div className="mt-6">
            <ButtonLink href={cta.href} variant="secondary">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper ${reverse ? "md:order-1" : ""}`.trim()}
        >
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <Tiles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
    </Container>
  );
}
