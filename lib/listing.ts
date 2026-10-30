import { isSlug } from "./html.ts";

type Params = Record<string, string | string[] | undefined>;

export function parseListingQuery(
  params: Params,
): { page: number; categoria?: string } | null {
  const { page, categoria } = params;
  if (page !== undefined && (typeof page !== "string" || !/^[1-9]\d{0,2}$/.test(page))) {
    return null;
  }
  if (categoria !== undefined && (typeof categoria !== "string" || !isSlug(categoria))) {
    return null;
  }
  return { page: page === undefined ? 1 : Number(page), categoria };
}

export function listingHref(
  base: string,
  { page, categoria }: { page?: number; categoria?: string },
): string {
  const query = new URLSearchParams();
  if (categoria) query.set("categoria", categoria);
  if (page && page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}
