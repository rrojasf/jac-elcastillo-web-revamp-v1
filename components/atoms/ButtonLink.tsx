import type { ComponentProps } from "react";
import { Link } from "@/components/atoms/Link";
import { buttonClass, type Variant } from "@/components/atoms/Button";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={`${buttonClass(variant)} ${className}`.trim()} {...props} />;
}
