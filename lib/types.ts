export type SafeHtml = string & { readonly __brand: "SafeHtml" };
export type Img = { src: string; alt: string; width: number; height: number };
export type Category = { slug: string; name: string };
export type Summary = {
  href: string;
  title: string;
  excerpt: string;
  date?: string;
  image?: Img;
  category?: Category;
};
export type Entry = Summary & { kind: "post" | "page"; html: SafeHtml };
