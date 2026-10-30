import { test } from "node:test";
import assert from "node:assert/strict";
import { clean, isSlug, text, truncate } from "./html.ts";

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

test("empty links are removed, links with text or an image are kept", () => {
  assert.equal(clean('<p>Hola</p><a href="https://a.test/a.pdf"></a><a href="https://a.test/b.pdf">&nbsp;</a>'), "<p>Hola</p>");
  assert.match(
    clean('<a href="https://a.test/wp-content/uploads/a.jpg"><img src="https://a.test/wp-content/uploads/a-150x150.jpg" alt=""></a>'),
    /<a href="https:\/\/a.test\/wp-content\/uploads\/a.jpg"><img/,
  );
  assert.equal(clean('<a href="https://a.test/a.pdf">Descargar</a>'), '<a href="https://a.test/a.pdf">Descargar</a>');
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

test("Divi link module with # is dropped entirely", () => {
  const out = clean(
    "<p>Antes</p>[et_pb_text _builder_version=»4.19.5&#8243; link_option_url=»#» global_colors_info=»{}»]<p>Paga Administración</p>[/et_pb_text]<p>Después</p>",
  );
  assert.ok(!out.includes("Paga"));
  assert.match(out, /Antes/);
  assert.match(out, /Después/);
});

test("a # link on a layout module keeps its content", () => {
  const out = clean(
    "[et_pb_section link_option_url=»#» _builder_version=»4.19.5&#8243;][et_pb_row][et_pb_column type=»4_4&#8243;][et_pb_text]<p>Contenido de la sección</p>[/et_pb_text][/et_pb_column][/et_pb_row][/et_pb_section]",
  );
  assert.equal(out, "<p>Contenido de la sección</p>");
});

test("Divi link module with empty url is dropped", () => {
  assert.ok(!clean("[et_pb_text link_option_url=»» x=»1&#8243;]<p>Hola</p>[/et_pb_text]").includes("Hola"));
});

test("Divi link module with a real url becomes a link", () => {
  const out = clean(
    "[et_pb_text link_option_url=»https://pagos.test/x?a=1&#038;b=2» _builder_version=»4.19.5&#8243;]<p>Paga Administración</p>[/et_pb_text]",
  );
  assert.equal(out, '<p><a href="https://pagos.test/x?a=1&amp;b=2">Paga Administración</a></p>');
});

test("video only when the path is a video file", () => {
  assert.equal(
    clean("[et_pb_video src_webm=»https://drive.google.com/file/d/1vT/view?usp=sharing» _builder_version=»4.19.5&#8243;][/et_pb_video]"),
    "",
  );
  assert.match(clean("[et_pb_video src=»https://x.test/a.MP4?v=1» _b=»1&#8243;]"), /<video src="https:\/\/x.test\/a.MP4\?v=1"/);
});

test("gallery links to attachment pages are unwrapped, file links kept", () => {
  const out = clean(
    "<dt><a href='https://a.test/post/foto-1/'><img src=\"https://a.test/wp-content/uploads/a-150x150.jpg\" alt=\"\"></a></dt>" +
      "<a href='https://a.test/wp-content/uploads/a.jpg'><img src=\"https://a.test/wp-content/uploads/a-150x150.jpg\" alt=\"\"></a>",
  );
  assert.ok(!out.includes("foto-1"));
  assert.match(out, /<a href="https:\/\/a.test\/wp-content\/uploads\/a.jpg"><img/);
});

test("first heading equal to the title is dropped, including nested text", () => {
  assert.equal(clean("<h1><strong>Dignatarios</strong></h1><p>Hola</p>", "Dignatarios"), "<p>Hola</p>");
  assert.equal(clean("<h2>  ÁRBOLES  y   Salud</h2><p>x</p>", "arboles y salud"), "<p>x</p>");
});

test("only the first heading is considered for the title", () => {
  const out = clean("<h2>Otro</h2><h2>Dignatarios</h2>", "Dignatarios");
  assert.match(out, /Dignatarios/);
});

test("Google Maps iframe is kept with lazy loading, others dropped", () => {
  const out = clean(
    '<iframe loading="eager" src="https://maps.google.com/maps?q=3.275687%2C%20-76.516424&#038;t=m&#038;z=14&#038;output=embed&#038;iwloc=near" title="3.275687, -76.516424" aria-label="x" onload="x()"></iframe>',
  );
  assert.match(out, /<iframe /);
  assert.match(out, /src="https:\/\/maps.google.com\/maps\?q=/);
  assert.match(out, /loading="lazy"/);
  assert.ok(!out.includes("aria-label") && !out.includes("onload"));
  assert.ok(!clean('<iframe src="https://www.google.com/other"></iframe>').includes("<iframe"));
  assert.ok(!clean('<iframe src="https://maps.google.com.evil.com/maps"></iframe>').includes("<iframe"));
});

test("truncate keeps short text unchanged", () => {
  assert.equal(truncate("Hola mundo", 20), "Hola mundo");
  assert.equal(truncate("a".repeat(180)), "a".repeat(180));
});

test("truncate cuts at the last space and drops trailing punctuation", () => {
  assert.equal(truncate("uno dos tres cuatro", 14), "uno dos tres…");
  assert.equal(truncate("uno dos, tres cuatro", 9), "uno dos…");
  assert.equal(truncate("uno dos tres cuatro", 13), "uno dos tres…");
});

test("truncate cuts a single long word at max", () => {
  assert.equal(truncate("abcdefghij", 5), "abcde…");
});
