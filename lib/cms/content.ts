import { clean, text } from "../html.ts";
import type { Category, Entry, Img } from "../types.ts";
import { wp } from "./client.ts";

type Rendered = { rendered: string };
type Media = {
  source_url?: string;
  alt_text?: string;
  media_details?: { width?: number; height?: number };
};
type Term = { taxonomy: string; slug: string; name: string };
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
  const term = terms?.flat().find((t) => t.taxonomy === "category");
  return term && { slug: term.slug, name: term.name };
}

function toEntry(raw: WpEntry, kind: Entry["kind"]): Entry {
  return {
    kind,
    href: `/${raw.slug}/`,
    title: text(raw.title.rendered),
    excerpt: text(raw.excerpt.rendered),
    date: raw.date,
    html: clean(raw.content.rendered),
    image: toImage(raw._embedded?.["wp:featuredmedia"]?.[0]),
    category: toCategory(raw._embedded?.["wp:term"]),
  };
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
