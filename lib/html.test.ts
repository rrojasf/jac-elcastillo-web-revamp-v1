import { test } from "node:test";
import assert from "node:assert/strict";
import { clean, isSlug, text } from "./html.ts";

test("Divi wrapper is stripped and inner text kept", () => {
  const out = clean('[et_pb_section fb_built=»1&#8243;][et_pb_text]<p>Hola mundo</p>[/et_pb_text][/et_pb_section]');
  assert.equal(out, "<p>Hola mundo</p>");
});

test("team member is expanded", () => {
  const out = clean(
    "[et_pb_team_member name=»Ana Pérez Gómez» position=»Presidente» image_url=»https://jacelcastillo.com.co/wp-content/uploads/2022/08/x.png» _builder_version=»4.19.5&#8243; _module_preset=»default» global_colors_info=»{}»]",
  );
  assert.match(out, /<figure><img src="https:\/\/jacelcastillo.com.co\/wp-content\/uploads\/2022\/08\/x.png" alt="Ana Pérez Gómez" \/><figcaption><strong>Ana Pérez Gómez<\/strong> Presidente<\/figcaption><\/figure>/);
});

test("image is expanded with alt from title_text", () => {
  const out = clean(
    "[et_pb_image src=»https://jacelcastillo.com.co/wp-content/uploads/2026/10/comunicado-002-scaled.jpg» title_text=»comunicado 002&#8243; _builder_version=»4.19.5&#8243;][/et_pb_image]",
  );
  assert.match(out, /<img src="https:\/\/jacelcastillo.com.co\/wp-content\/uploads\/2026\/10\/comunicado-002-scaled.jpg" alt="comunicado 002" \/>/);
});

test("video is expanded", () => {
  const out = clean('[et_pb_video src=»https://x.test/a.mp4» src_webm=»https://x.test/a.webm» _builder_version=»4.19.5&#8243;][/et_pb_video]');
  assert.equal(out, '<video src="https://x.test/a.mp4" controls preload="metadata"></video>');
  assert.match(clean("[et_pb_video src_webm=»https://x.test/a.webm»]"), /<video src="https:\/\/x.test\/a.webm"/);
});

test("attribute values may use plain quotes", () => {
  assert.match(clean('[et_pb_image src="https://x.test/a.jpg" title_text="t"]'), /<img src="https:\/\/x.test\/a.jpg" alt="t"/);
});

test("hostile payloads are neutralized", () => {
  const payloads = [
    "<img src=x onerror=alert(1)>",
    '<a href="javascript:alert(1)">x</a>',
    "<svg onload=alert(1)>",
    '<iframe src="https://evil.com"></iframe>',
    "<style>body{}</style>",
    "<script>alert(1)</script>",
  ];
  for (const p of payloads) {
    const out = clean(p);
    for (const bad of ["onerror", "javascript:", "onload", "<iframe", "<style", "<script", "<svg"]) {
      assert.ok(!out.includes(bad), `${bad} survived in ${p}: ${out}`);
    }
  }
});

test("target=_blank gets rel", () => {
  assert.match(clean('<a href="https://a.test" target="_blank">a</a>'), /rel="noopener noreferrer"/);
});

test("h1 becomes h2", () => {
  assert.equal(clean("<h1>T</h1>"), "<h2>T</h2>");
});

test("empty and nbsp paragraphs are removed", () => {
  assert.equal(clean("<p></p><p>&nbsp;</p><p> </p><p>Hola</p>"), "<p>Hola</p>");
});

test("paragraph with only an image is kept", () => {
  assert.match(clean('<p><img src="https://a.test/a.png"></p>'), /<p><img/);
});

test("text decodes entities and strips markup", () => {
  assert.equal(text("a &#8211; b &amp; c &#x41;"), "a – b & c A");
  assert.equal(text("&#99999999;"), "&#99999999;");
  assert.equal(text("<p>Hola <b>mundo</b></p>[et_pb_text a=»1&#8243;]"), "Hola mundo");
});

test("isSlug", () => {
  assert.ok(isSlug("conclusiones-reunion-de-seguridad"));
  assert.ok(isSlug("informe-de-gestion-2023-2024"));
  for (const bad of ["..", "a/b", "a?b", "a%2F", "Abc", "", "a".repeat(201)]) {
    assert.ok(!isSlug(bad), bad);
  }
});
