import type { ComponentPropsWithoutRef } from "react";
import { Tiles } from "@/components/atoms/Tiles";

type SpinnerProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export function Spinner(props: SpinnerProps) {
  return (
    <div role="status" {...props}>
      <Tiles
        size="sm"
        className="motion-safe:animate-turn motion-reduce:animate-pulse"
      />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
