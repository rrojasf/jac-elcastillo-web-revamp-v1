"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

const stripSlash = (path: string) => path.replace(/\/+$/, "");

type NavLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function NavLink({ href, onClick, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const current = stripSlash(pathname) === stripSlash(href);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.currentTarget.closest<HTMLElement>("[popover]")?.hidePopover();
    onClick?.(event);
  }

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      onClick={handleClick}
      {...props}
    />
  );
}
