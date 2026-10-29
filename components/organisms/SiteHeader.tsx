import Link from "next/link";
import type { CSSProperties } from "react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";
import { NAV, SITE } from "@/lib/site";

const linkClass =
  "block rounded-lg px-3 py-2 hover:bg-paper aria-[current=page]:font-semibold aria-[current=page]:text-brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="flag-rule" />
      <Container size="wide" className="flex items-center justify-between py-3">
        <Link href="/" aria-label={`${SITE.name} inicio`}>
          <Logo tone="dark" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-2 md:flex">
          {NAV.map((group, index) => {
            const id = `nav-${index}`;
            const style = { "--anchor": `--${id}` } as CSSProperties;
            return (
              <div key={group.label}>
                <button
                  type="button"
                  popoverTarget={id}
                  style={style}
                  className="anchor-source inline-flex items-center gap-1 rounded-full px-4 py-2 text-lg font-semibold hover:bg-white"
                >
                  {group.label}
                  <Icon name="chevron" />
                </button>
                <div
                  id={id}
                  popover=""
                  style={style}
                  className="anchor-panel min-w-56 rounded-xl border border-line bg-white p-2 text-lg shadow-lg"
                >
                  {group.items.map((item) => (
                    <NavLink key={item.href} href={item.href} className={linkClass}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="md:hidden">
          <Button variant="secondary" popoverTarget="site-menu">
            <Icon name="menu" />
            Menú
          </Button>
          <div
            id="site-menu"
            popover=""
            className="fixed inset-auto right-0 top-0 m-0 h-dvh w-[min(22rem,88vw)] overflow-y-auto bg-paper p-6 text-ink shadow-2xl backdrop:bg-ink/40 motion-safe:transition-transform motion-safe:duration-300 motion-safe:transition-discrete motion-safe:starting:open:translate-x-full"
          >
            <div className="flex justify-end">
              <Button
                variant="secondary"
                popoverTarget="site-menu"
                popoverTargetAction="hide"
                aria-label="Cerrar menú"
              >
                <Icon name="close" />
              </Button>
            </div>
            {NAV.map((group) => (
              <div key={group.label} className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    className="block border-b border-line py-3 text-lg aria-[current=page]:font-semibold aria-[current=page]:text-brand"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </header>
  );
}
