import { test } from "node:test";
import assert from "node:assert/strict";
import { optimizeImages } from "./images.ts";
import type { SafeHtml } from "./types.ts";

const safe = (s: string) => s as SafeHtml;
const SRC = "https://jacelcastillo.com.co/wp-content/uploads/2024/06/a.png";
const enc = encodeURIComponent(SRC);

test("a WordPress upload image is rewritten and keeps its attributes", () => {
  const out = optimizeImages(safe(`<p><img src="${SRC}" alt="Foto" width="800" height="600" /></p>`));
  assert.ok(out.includes(`src="/_next/image/?url=${enc}&amp;w=1080&amp;q=75"`));
  const srcset = /srcset="([^"]*)"/.exec(out)?.[1].split(", ");
  assert.deepEqual(
    srcset,
    [640, 828, 1080, 1920].map((w) => `/_next/image/?url=${enc}&amp;w=${w}&amp;q=75 ${w}w`),
  );
  assert.ok(out.includes('sizes="(min-width: 768px) 768px, 100vw"'));
  assert.ok(out.includes('alt="Foto" width="800" height="600"'));
  assert.ok(out.startsWith("<p><img ") && out.endsWith(" /></p>"));
});

test("only images after the first load lazily", () => {
  const out = optimizeImages(safe(`<img src="${SRC}" alt="" /><img src="${SRC}" alt="" /><img src="${SRC}" alt="" />`));
  const tags = out.match(/<img\b[^>]*>/g) ?? [];
  assert.deepEqual(
    tags.map((t) => t.includes('loading="lazy" decoding="async"')),
    [false, true, true],
  );
});

test("an image on another host is untouched", () => {
  const html = safe('<img src="https://other.test/wp-content/uploads/a.png" alt="x" />');
  assert.equal(optimizeImages(html), html);
  const lookalike = safe('<img src="https://jacelcastillo.com.co.evil.test/wp-content/uploads/a.png" />');
  assert.equal(optimizeImages(lookalike), lookalike);
});

test("&amp; in the src is decoded before encoding", () => {
  const out = optimizeImages(safe(`<img src="${SRC}?a=1&amp;b=2" alt="" />`));
  assert.ok(out.includes(`url=${encodeURIComponent(`${SRC}?a=1&b=2`)}&amp;w=1080&amp;q=75`));
  assert.ok(!out.includes("%26amp"));
});

test("HTML without images is returned unchanged", () => {
  const html = safe("<p>Hola</p><a href=\"https://a.test\">a</a>");
  assert.equal(optimizeImages(html), html);
});
