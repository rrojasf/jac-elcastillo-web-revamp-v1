import { clean, text } from "../html.ts";
import type { Category, Entry, Img, Summary } from "../types.ts";
import { cache } from "react";
import { wp } from "./client.ts";

type Rendered = { rendered: string };
type Media = {
  source_url?: string;
  alt_text?: string;
  media_details?: { width?: number; height?: number };
};
type Term = { id: number; taxonomy: string; slug: string; name: string };
type WpEntry = {
  slug: string;
  date: string;
  title: Rendered;
  excerpt: Rendered;
  content: Rendered;
  _embedded?: {
    "wp:featuredmedia"?: Media[];
    "wp:term"?: Term[][];
  };
};

const UNCATEGORIZED = 1;
const PER_PAGE = 9;
const FIELDS = "slug,date,title,excerpt,content,_links,_embedded";
const EMBED = "wp:featuredmedia,wp:term";

function toImage(media?: Media): Img | undefined {
  if (!media?.source_url) return undefined;
  return {
    src: media.source_url,
    alt: media.alt_text ?? "",
    width: media.media_details?.width ?? 1200,
    height: media.media_details?.height ?? 630,
  };
}

function toCategory(terms?: Term[][]): Category | undefined {
  const term = terms
    ?.flat()
    .find((t) => t.taxonomy === "category" && t.id !== UNCATEGORIZED);
  return term && { slug: term.slug, name: term.name };
}

function toSummary(raw: Omit<WpEntry, "content">): Summary {
  return {
    href: `/${raw.slug}/`,
    title: text(raw.title.rendered),
    excerpt: text(raw.excerpt.rendered).replace(/\s*\[…\]$/, "…"),
    date: raw.date,
    image: toImage(raw._embedded?.["wp:featuredmedia"]?.[0]),
    category: toCategory(raw._embedded?.["wp:term"]),
  };
}

function toEntry(raw: WpEntry, kind: Entry["kind"]): Entry {
  const summary = toSummary(raw);
  return { ...summary, kind, html: clean(raw.content.rendered, summary.title) };
}

export async function getEntry(slug: string): Promise<Entry | null> {
  const query = { slug, _fields: FIELDS, _embed: EMBED };
  const [posts, pages] = await Promise.all([
    wp<WpEntry[]>("posts", query),
    wp<WpEntry[]>("pages", query),
  ]);
  const post = posts?.data[0];
  if (post) return toEntry(post, "post");
  const page = pages?.data[0];
  return page ? toEntry(page, "page") : null;
}

async function allSlugs(path: "posts" | "pages"): Promise<string[]> {
  const slugs: string[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page++) {
    const res = await wp<{ slug: string }[]>(path, {
      per_page: 100,
      page,
      _fields: "slug",
    });
    if (!res) break;
    totalPages = res.totalPages;
    slugs.push(...res.data.map((e) => e.slug));
  }
  return slugs;
}

export async function getAllSlugs(): Promise<string[]> {
  const [posts, pages] = await Promise.all([allSlugs("posts"), allSlugs("pages")]);
  return [...posts, ...pages];
}

type WpCategory = { id: number; slug: string; name: string; count: number };

const categories = cache(async (): Promise<WpCategory[]> => {
  const res = await wp<WpCategory[]>("categories", {
    per_page: 100,
    _fields: "id,slug,name,count",
  });
  return (res?.data ?? []).filter((c) => c.count > 0 && c.id !== UNCATEGORIZED);
});

export async function getCategories(): Promise<Category[]> {
  return (await categories())
    .map(({ slug, name }) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function getPosts({
  page,
  categoria,
}: {
  page: number;
  categoria?: string;
}): Promise<{ items: Summary[]; totalPages: number } | null> {
  const params: Record<string, string | number> = {
    per_page: PER_PAGE,
    page,
    _fields: "slug,date,title,excerpt,_links,_embedded",
    _embed: "wp:featuredmedia,wp:term",
  };
  if (categoria) {
    const match = (await categories()).find((c) => c.slug === categoria);
    if (!match) return null;
    params.categories = match.id;
  }
  const res = await wp<Omit<WpEntry, "content">[]>("posts", params);
  return res && { items: res.data.map(toSummary), totalPages: res.totalPages };
}
