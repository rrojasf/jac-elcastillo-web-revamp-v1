import { test } from "node:test";
import assert from "node:assert/strict";
import { listingHref, parseListingQuery } from "./listing.ts";

test("empty params default to page 1", () => {
  assert.deepEqual(parseListingQuery({}), { page: 1, categoria: undefined });
});

test("valid page and categoria are accepted", () => {
  assert.deepEqual(parseListingQuery({ page: "12", categoria: "seguridad" }), {
    page: 12,
    categoria: "seguridad",
  });
});

test("invalid page values are rejected", () => {
  for (const page of ["-1", "0", "abc", "01", "", "1000", ["1", "2"]]) {
    assert.equal(parseListingQuery({ page }), null, JSON.stringify(page));
  }
});

test("invalid categoria values are rejected", () => {
  for (const categoria of ["<script>", "", "Seguridad", "a b", ["a", "b"]]) {
    assert.equal(parseListingQuery({ categoria }), null, JSON.stringify(categoria));
  }
});

test("href shapes", () => {
  assert.equal(listingHref("/noticias/", {}), "/noticias/");
  assert.equal(listingHref("/noticias/", { page: 1 }), "/noticias/");
  assert.equal(listingHref("/noticias/", { page: 2 }), "/noticias/?page=2");
  assert.equal(
    listingHref("/noticias/", { categoria: "seguridad" }),
    "/noticias/?categoria=seguridad",
  );
  assert.equal(
    listingHref("/noticias/", { categoria: "seguridad", page: 2 }),
    "/noticias/?categoria=seguridad&page=2",
  );
});
