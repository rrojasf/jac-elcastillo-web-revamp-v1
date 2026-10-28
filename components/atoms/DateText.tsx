import type { ComponentPropsWithoutRef } from "react";

const formatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Bogota",
});

type DateTextProps = Omit<ComponentPropsWithoutRef<"time">, "dateTime"> & {
  iso: string;
};

export function DateText({ iso, ...props }: DateTextProps) {
  return (
    <time dateTime={iso} {...props}>
      {formatter.format(new Date(iso))}
    </time>
  );
}
