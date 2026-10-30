import type { ComponentPropsWithoutRef } from "react";

type Size = "sm" | "md";

const sizes: Record<Size, { grid: string; square: string }> = {
  sm: { grid: "gap-1", square: "size-6 border-2" },
  md: { grid: "gap-1.5", square: "size-11 border-[3px]" },
};

const tiles = [
  "bg-leaf",
  "bg-sky",
  "bg-white shadow-[inset_0_0_0_6px_var(--color-sun)]",
  "bg-leaf",
];

type TilesProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  size?: Size;
  animated?: boolean;
};

export function Tiles({
  size = "md",
  animated = false,
  className = "",
  ...props
}: TilesProps) {
  return (
    <div
      aria-hidden="true"
      className={`grid grid-cols-2 ${sizes[size].grid} ${className}`.trim()}
      {...props}
    >
      {tiles.map((tile, index) => (
        <span
          key={index}
          style={animated ? { animationDelay: `${index * 90}ms` } : undefined}
          className={`rounded-sm border-brand ${sizes[size].square} ${animated ? "motion-safe:animate-rise" : ""} ${tile}`.trim()}
        />
      ))}
    </div>
  );
}
