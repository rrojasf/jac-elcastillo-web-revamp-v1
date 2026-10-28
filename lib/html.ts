import sanitizeHtml from "sanitize-html";
import type { SafeHtml } from "./types.ts";

const OPENERS = ["»", "&#8221;", '"'];
const CLOSERS = ["»", "&#8243;", "&#8221;", '"'];
const MODULE_START = /\[et_pb_(image|team_member|video)(?=[\s\]])/g;
const SHORTCODE = /\[\/?et_pb_[^\]]*\]/g;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  laquo: "«",
  raquo: "»",
};

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Returns the attributes and the index just after the closing "]".
function parseAttrs(src: string, from: number) {
  const attrs: Record<string, string> = {};
  let i = from;
  while (i < src.length) {
    while (/\s/.test(src[i] ?? "")) i++;
    if (src[i] === "]") return { attrs, end: i + 1 };
    const key = /^[\w-]+/.exec(src.slice(i))?.[0];
    if (!key || src[i + key.length] !== "=") return { attrs, end: i + 1 };
    i += key.length + 1;
    const opener = OPENERS.find((o) => src.startsWith(o, i));
    if (!opener) return { attrs, end: i };
    i += opener.length;
    let close = -1;
    let closerLen = 0;
    for (let j = i; j < src.length && close < 0; j++) {
      for (const c of CLOSERS) {
        const next = src[j + c.length] ?? "";
        if (src.startsWith(c, j) && (next === "]" || /\s/.test(next))) {
          close = j;
          closerLen = c.length;
          break;
        }
      }
    }
    if (close < 0) return { attrs, end: src.length };
    attrs[key] = src.slice(i, close);
    i = close + closerLen;
  }
  return { attrs, end: src.length };
}

function renderModule(name: string, a: Record<string, string>): string {
  if (name === "image") {
    return a.src
      ? `<img src="${escapeAttr(a.src)}" alt="${escapeAttr(a.title_text ?? "")}">`
      : "";
  }
  if (name === "team_member") {
    const label = escapeAttr(a.name ?? "");
    const img = a.image_url
      ? `<img src="${escapeAttr(a.image_url)}" alt="${label}">`
      : "";
    return `<figure>${img}<figcaption><strong>${label}</strong> ${escapeAttr(a.position ?? "")}</figcaption></figure>`;
  }
  const src = a.src || a.src_webm;
  return src
    ? `<video src="${escapeAttr(src)}" controls preload="metadata"></video>`
    : "";
}

function expandDiviModules(html: string): string {
  let out = "";
  let last = 0;
  MODULE_START.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MODULE_START.exec(html))) {
    const { attrs, end } = parseAttrs(html, m.index + m[0].length);
    out += html.slice(last, m.index) + renderModule(m[1], attrs);
    last = end;
    MODULE_START.lastIndex = end;
  }
  return out + html.slice(last);
}

export function clean(html: string): SafeHtml {
  const expanded = expandDiviModules(html).replace(SHORTCODE, "");
  return sanitizeHtml(expanded, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u",
      "s", "blockquote", "ul", "ol", "li", "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "hr", "video",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      video: ["src", "controls", "preload"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) =>
        attribs.target === "_blank"
          ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
          : { tagName, attribs },
    },
    exclusiveFilter: (frame) =>
      frame.tag === "p" &&
      !frame.mediaChildren.length &&
      !frame.text.replace(/&nbsp;| /g, "").trim(),
  }) as SafeHtml;
}

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body: string) => {
    if (body[0] === "#") {
      const code =
        body[1].toLowerCase() === "x"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return code <= 0x10ffff ? String.fromCodePoint(code) : whole;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
  });
}

export function text(html: string): string {
  return decodeEntities(html.replace(SHORTCODE, "").replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

export const isSlug = (s: string): boolean => /^[a-z0-9-]{1,200}$/.test(s);
