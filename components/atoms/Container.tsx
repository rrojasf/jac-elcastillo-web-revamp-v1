import type { ComponentPropsWithoutRef } from "react";

type Size = "content" | "wide";

const sizes: Record<Size, string> = {
  content: "max-w-3xl",
  wide: "max-w-6xl",
};

type ContainerProps = ComponentPropsWithoutRef<"div"> & { size?: Size };

export function Container({
  size = "content",
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 ${sizes[size]} ${className}`.trim()}
      {...props}
    />
  );
}
