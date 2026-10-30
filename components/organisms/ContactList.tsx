import { ContactItem } from "@/components/molecules/ContactItem";
import type { ContactLink } from "@/lib/types";

type Tone = "dark" | "light";

const layouts: Record<Tone, string> = {
  dark: "grid gap-6 sm:grid-cols-2",
  light: "mt-4 space-y-4",
};

type ContactListProps = { links: ContactLink[]; tone?: Tone };

export function ContactList({ links, tone = "dark" }: ContactListProps) {
  return (
    <ul className={layouts[tone]}>
      {links.map((link) => (
        <li key={link.label}>
          <ContactItem link={link} tone={tone} />
        </li>
      ))}
    </ul>
  );
}
