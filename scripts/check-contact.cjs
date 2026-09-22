// Isolated contract checks. No real credentials, network calls or emails.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function route(provider, configured = true) {
  const module = { exports: {} };
  const source = ts.transpileModule(
    fs.readFileSync("src/app/api/contact/route.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    require: (key) =>
      key === "@/lib/contact-config"
        ? { isContactConfigured: () => configured }
        : require(key),
    process: {
      env: {
        RESEND_API_KEY: "test-only",
        CONTACT_TO_EMAIL: "recipient@example.invalid",
        CONTACT_FROM_EMAIL: "sender@example.invalid",
      },
    },
    fetch: provider,
    Response,
    AbortSignal,
    console: { error: () => {} },
  });
  return module.exports.POST;
}
const valid = {
  name: "Test Person",
  email: "test@example.invalid",
  message: "A test project enquiry.",
  budget: "",
  website: "",
};
const request = (body) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
(async () => {
  let cases = 0;
  const noNetwork = () => {
    throw new Error("Unexpected provider request");
  };
  assert.equal((await route(noNetwork, false)(request(valid))).status, 503);
  cases++;
  for (const data of [
    null,
    [],
    {},
    { ...valid, name: " " },
    { ...valid, email: "bad" },
    { ...valid, message: "short" },
    { ...valid, budget: "x".repeat(101) },
    { ...valid, website: "spam" },
  ]) {
    assert.equal((await route(noNetwork)(request(data))).status, 400);
    cases++;
  }
  assert.equal(
    (
      await route(noNetwork)(
        new Request("http://localhost/api/contact", {
          method: "POST",
          body: "{",
        }),
      )
    ).status,
    400,
  );
  cases++;
  for (const last_event of [
    "delivered",
    "sent",
    "delivery_delayed",
    "bounced",
    "failed",
    "suppressed",
  ]) {
    let calls = 0;
    const POST = route(async (url, options) => {
      calls++;
      if (calls === 1) {
        const body = JSON.parse(options.body);
        assert.equal(body.reply_to, valid.email);
        assert.ok(body.text.includes("Budget: Not specified"));
        assert.ok(!body.text.includes("Subject: undefined"));
        return Response.json({ id: "test-id" });
      }
      assert.equal(url, "https://api.resend.com/emails/test-id");
      return Response.json({ last_event });
    });
    const r = await POST(request(valid));
    const data = await r.json();
    if (last_event === "delivered") {
      assert.equal(r.status, 200);
      assert.equal(data.status, "delivered");
    } else if (["bounced", "failed", "suppressed"].includes(last_event)) {
      assert.equal(r.status, 502);
      assert.ok(!data.status);
    } else {
      assert.equal(r.status, 202);
      assert.equal(data.status, "accepted");
    }
    assert.equal(calls, 2);
    cases++;
  }
  for (const mode of [
    "forbidden-read",
    "timeout-read",
    "missing-id",
    "rejected",
    "timeout-submit",
  ]) {
    const POST = route(async (url, options) => {
      if (options.method === "POST") {
        if (mode === "rejected") return Response.json({}, { status: 500 });
        if (mode === "timeout-submit") throw new Error("timeout");
        return Response.json(mode === "missing-id" ? {} : { id: "test-id" });
      }
      if (mode === "timeout-read") throw new Error("timeout");
      return Response.json({}, { status: 403 });
    });
    const r = await POST(request(valid));
    assert.equal(
      r.status,
      mode === "timeout-submit"
        ? 504
        : ["rejected", "missing-id"].includes(mode)
          ? 502
          : 202,
    );
    cases++;
  }
  let calls = 0;
  const POST = route(async () => {
    calls++;
    return Response.json({ id: "test-id", last_event: "sent" });
  });
  for (let i = 0; i < 3; i++)
    assert.equal((await POST(request(valid))).status, 202);
  assert.equal((await POST(request(valid))).status, 429);
  assert.equal(calls, 6);
  cases++;
  console.log(
    `${cases} contact checks passed (mock provider; no real email sent).`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
