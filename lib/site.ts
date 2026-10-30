import type { NavEntry, NavItem } from "@/lib/types";

export const SITE = {
  name: "JAC El Castillo",
  fullName: "Junta de Acción Comunal Ciudad Campestre El Castillo",
  place: "Ciudad Campestre",
  tagline: "Comunidad construyendo Comunidad",
  logo: "https://jacelcastillo.com.co/wp-content/uploads/2024/05/cropped-favicon.png",
  contact: {
    phone: "+57 315 7531859",
    whatsapp: "573157531859",
    email: "jacelcastillo@gmail.com",
  },
} as const;

export const NAV: NavEntry[] = [
  {
    label: "La Junta",
    items: [
      { label: "Quiénes somos", href: "/nosotros/" },
      { label: "Dignatarios", href: "/dignatarios/" },
    ],
  },
  { label: "Noticias", href: "/noticias/" },
  {
    label: "Transparencia",
    items: [
      { label: "Rendición de cuentas", href: "/rendicion-de-cuentas/" },
      {
        label: "Informe de gestión 2023-2024",
        href: "/informe-de-gestion-2023-2024/",
      },
    ],
  },
];

export const NAV_LINKS: NavItem[] = NAV.flatMap((entry) =>
  "items" in entry ? entry.items : [entry],
);
