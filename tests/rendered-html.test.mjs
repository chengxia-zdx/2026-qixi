import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete Qixi story", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>春天住进星星里/);
  assert.match(html, /成都 · 重庆/);
  assert.match(html, /2026\.06\.18/);
  assert.match(html, /七夕快乐/);
  assert.match(html, /妹妹/);
  assert.match(html, /birthday-together-2\.jpg/);
  assert.match(html, /well-be-okay\.mp3/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("includes all four personal photographs", async () => {
  await Promise.all([
    "chunchun.jpg",
    "xingxing.jpg",
    "birthday-together-1.jpg",
    "birthday-together-2.jpg",
  ].map((name) => access(new URL(`../public/images/${name}`, import.meta.url))));
});

test("includes the licensed background music", async () => {
  await Promise.all([
    access(new URL("../public/audio/well-be-okay.mp3", import.meta.url)),
    access(new URL("../public/audio/LICENSE.txt", import.meta.url)),
  ]);
});

test("includes every local journey backdrop and its credits", async () => {
  await Promise.all([
    "chengdu-chongqing.jpg",
    "thailand.jpg",
    "tianjin.jpg",
    "guangzhou.jpg",
    "dalian.jpg",
    "japan.jpg",
    "CREDITS.md",
  ].map((name) => access(new URL(`../public/images/journeys/${name}`, import.meta.url))));
});
