import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "JAC El Castillo", template: "%s | JAC El Castillo" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
