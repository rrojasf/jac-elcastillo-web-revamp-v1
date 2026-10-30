import type { Metadata } from "next";
import { ContactList } from "@/components/organisms/ContactList";
import { ContentTemplate } from "@/components/templates/ContentTemplate";
import { CONTACT_LINKS } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto" };

export default function Page() {
  return (
    <ContentTemplate title="Contacto" intro="Cuéntenos, le escuchamos.">
      <ContactList links={CONTACT_LINKS} />
    </ContentTemplate>
  );
}
