import type { ComponentPropsWithoutRef } from "react";

export function Tag({ className = "", ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={`rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-leaf-deep ${className}`.trim()}
      {...props}
    />
  );
}
