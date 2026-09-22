// Verify data-source failures are distinct from a genuinely empty collection.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function source(fetch, env = { NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-only" }) {
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync("src/lib/projects-server.ts", "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      module,
      exports: module.exports,
      require: (key) =>
        key === "react"
          ? { cache: (fn) => fn }
          : { normalizeRsvImageUrl: (s) => s },
      process: { env },
      fetch,
      URL,
      AbortSignal,
    },
  );
  return module.exports;
}
(async () => {
  let r = await source(() => {
    throw new Error("network");
  }).getProjectsResult();
  assert.equal(r.error, true);
  assert.equal(r.projects.length, 0);
  r = await source(() =>
    Response.json({}, { status: 403 }),
  ).getProjectsResult();
  assert.equal(r.error, true);
  r = await source(() => Response.json({})).getProjectsResult();
  assert.equal(r.error, false);
  assert.equal(r.projects.length, 0);
  r = await source(() => {
    throw new Error("must not fetch");
  }, {}).getProjectsResult();
  assert.equal(r.error, true);
  let calls = 0;
  const project = (id, year, link) => ({
    name: `projects/test/databases/(default)/documents/projects/${id}`,
    fields: {
      name: { stringValue: id },
      year: { stringValue: year },
      link: { stringValue: link },
    },
  });
  r = await source((url) => {
    calls++;
    return Response.json(
      calls === 1
        ? {
            documents: [project("older", "2023", "javascript:alert(1)")],
            nextPageToken: "next",
          }
        : { documents: [project("newer", "2026", "https://example.com/")] },
    );
  }).getProjectsResult();
  assert.equal(calls, 2);
  assert.equal(r.projects[0].id, "newer");
  assert.equal(r.projects[1].link, "");
  assert.equal(r.error, false);
  console.log(
    "5 project-source scenarios passed: network error, HTTP error, empty, missing configuration and paginated records with safe links.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
