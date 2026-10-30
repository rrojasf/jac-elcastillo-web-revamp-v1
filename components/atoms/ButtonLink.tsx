import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClass, type Variant } from "@/components/atoms/Button";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={`${buttonClass(variant)} ${className}`.trim()} {...props} />;
}
