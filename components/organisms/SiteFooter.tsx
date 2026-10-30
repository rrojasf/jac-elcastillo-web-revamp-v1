import Link from "next/link";
import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { ContactList } from "@/components/organisms/ContactList";
import { CONTACT_LINKS, NAV_LINKS, SITE } from "@/lib/site";

const headingClass =
  "text-sm font-semibold uppercase tracking-[0.14em] text-white/70";

export function SiteFooter() {
  return (
    <footer className="bg-brand-deep text-white">
      <div className="flag-rule" />
      <Container size="wide">
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-6 font-display text-2xl font-semibold text-sun">
              “{SITE.tagline}”
            </p>
          </div>
          <div>
            <h2 className={headingClass}>Navegación</h2>
            <ul className="mt-4 space-y-2 text-lg">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={headingClass}>Contacto</h2>
            <ContactList links={CONTACT_LINKS} tone="light" />
          </div>
        </div>
        <div className="border-t border-white/15 py-6 text-sm text-white/70">
          © {new Date().getFullYear()} {SITE.fullName}
        </div>
      </Container>
    </footer>
  );
}
