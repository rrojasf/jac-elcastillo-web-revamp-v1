"use client";

import NextLink, { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";
import type { ComponentProps } from "react";
import { Spinner } from "@/components/atoms/Spinner";

function Pending() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  // Portal: NavLink hides the menu popover on click, which would hide a spinner rendered inside it.
  return createPortal(
    <Spinner className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-paper/90 p-4 shadow-lg ring-1 ring-line animate-appear" />,
    document.body,
  );
}

export function Link({ children, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props}>
      {children}
      <Pending />
    </NextLink>
  );
}
