import type { ComponentPropsWithoutRef } from "react";

type Level = 1 | 2 | 3 | 4;
type Size = "2xl" | "xl" | "lg" | "md" | "sm";

const sizes: Record<Size, string> = {
  "2xl": "text-5xl md:text-7xl font-extrabold",
  xl: "text-4xl md:text-5xl font-extrabold",
  lg: "text-3xl font-bold",
  md: "text-2xl font-semibold",
  sm: "text-xl font-semibold",
};

const defaultSize: Record<Level, Size> = { 1: "xl", 2: "lg", 3: "md", 4: "sm" };

type HeadingProps = ComponentPropsWithoutRef<"h1"> & {
  level: Level;
  size?: Size;
};

export function Heading({
  level,
  size = defaultSize[level],
  className = "",
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={`font-display text-balance tracking-tight ${sizes[size]} ${className}`.trim()} {...props} />;
}
