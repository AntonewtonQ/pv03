// Run against a local preview. Contact responses are intercepted; no email is sent.
import assert from "node:assert/strict";
import fs from "node:fs";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
const base = process.env.REVIEW_URL || "http://localhost:3000";
assert.ok(
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base),
  "Review must run against a local server",
);
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: chromium.args,
  headless: true,
});
const results = { pages: [], interactions: [], consoleErrors: [] };
const page = await browser.newPage();
page.on("pageerror", (e) => results.consoleErrors.push(e.message));
const routes = [
  "",
  "/projects",
  "/about",
  "/contact",
  "/projects/6PwfsjsFda7ov256pJJf",
  "/projects/sGKd9KxTO96YWXrrd0Pe",
  "/projects/vpbZOSmseBEewKmmmOAG",
];
try {
  for (const locale of ["pt", "en"])
    for (const route of routes) {
      const url = `${base}/${locale}${route}`;
      await page.setViewport({ width: 1440, height: 1000 });
      const response = await page.goto(url, { waitUntil: "networkidle2" });
      assert.equal(response.status(), 200, url);
      const info = await page.evaluate(() => ({
        title: document.title,
        h1: document.querySelectorAll("h1").length,
        description: document.querySelector('meta[name="description"]')
          ?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        lang: document.documentElement.lang,
        og: document.querySelector('meta[property="og:image"]')?.content,
        alternates: document.querySelectorAll("link[hreflang]").length,
      }));
      assert.equal(info.h1, 1);
      assert.equal(info.lang, locale);
      assert.ok(info.description);
      assert.equal(info.canonical, `https://antonewton.xyz/${locale}${route}`);
      assert.ok(info.og);
      assert.ok(info.alternates >= 2);
      const checks = [];
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewport({ width, height: width < 768 ? 844 : 1000 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        assert.equal(overflow, false, `Overflow ${url} @ ${width}`);
        checks.push(width);
      }
      let violations = [];
      if (process.env.AXE_PATH) {
        await page.addScriptTag({ path: process.env.AXE_PATH });
        const axe = await page.evaluate(async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa"],
              },
            })
          ).violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        );
        violations = axe;
      }
      results.pages.push({
        path: `/${locale}${route}`,
        ...info,
        widthsWithoutOverflow: checks,
        violations,
      });
      if (
        [
          "",
          "/contact",
          "/projects",
          "/projects/6PwfsjsFda7ov256pJJf",
        ].includes(route)
      ) {
        const name =
          route === ""
            ? "home"
            : route.startsWith("/projects/")
              ? "project-detail"
              : route.slice(1);
        await page.evaluate(async () => {
          for (const img of document.images) {
            img.loading = "eager";
          }
          await Promise.all(
            [...document.images].map((img) => img.decode().catch(() => {})),
          );
        });
        await page.screenshot({
          path: `artifacts/review/${name}-${locale}-desktop.png`,
          fullPage: true,
        });
        await page.setViewport({ width: 390, height: 844 });
        await page.screenshot({
          path: `artifacts/review/${name}-${locale}-mobile.png`,
          fullPage: true,
        });
        if (!route)
          await page.screenshot({
            path: `artifacts/review/home-${locale}-mobile-first-screen.png`,
          });
      }
      console.log(
        "Reviewed",
        `/${locale}${route}`,
        "axe violations:",
        violations.length,
      );
    }
  // Readable, useful HTML when JavaScript is disabled.
  const nojs = await browser.newPage();
  await nojs.setJavaScriptEnabled(false);
  for (const route of ["/pt", "/en/projects"]) {
    await nojs.goto(base + route, { waitUntil: "networkidle2" });
    const text = await nojs.evaluate(() => document.body.innerText);
    for (const name of ["Resto", "Jogastop", "Natura Lovers"])
      assert.ok(text.includes(name));
    assert.ok(
      !text.includes("Loading projects…") &&
        !text.includes("Loading projects..."),
    );
    assert.equal(
      await nojs.$eval("main", (e) => getComputedStyle(e).opacity),
      "1",
    );
  }
  await nojs.close();
  results.interactions.push("Projects visible with JavaScript disabled");
  await page.goto(base + "/pt", { waitUntil: "networkidle2" });
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement?.getAttribute("href")),
    "#main-content",
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.evaluate(() => document.activeElement?.id),
    "main-content",
  );
  results.interactions.push("Keyboard skip link focuses main content");
  await page.click('a[href$="#work"]');
  await page.waitForFunction(() => location.hash === "#work");
  results.interactions.push("Secondary CTA opens selected projects");
  await page.goto(base + "/pt/projects", { waitUntil: "networkidle2" });
  const yearButton = await page.$$("button[aria-pressed]");
  await yearButton[1].click();
  assert.equal(await page.$$eval("article", (els) => els.length), 1);
  assert.equal(
    await page.$eval('button[aria-pressed="true"]', (e) => e.textContent),
    "2026",
  );
  await yearButton[0].click();
  assert.equal(await page.$$eval("article", (els) => els.length), 3);
  results.interactions.push("Year filters select and reset");
  await page.goto(base + "/pt/projects/6PwfsjsFda7ov256pJJf", {
    waitUntil: "networkidle2",
  });
  await page.click('button[aria-label="Mudar idioma para EN"]');
  await page.waitForFunction(() =>
    location.pathname.startsWith("/en/projects/"),
  );
  assert.ok(
    (await page.$eval("main", (e) => e.textContent)).includes("Personal project"),
  );
  results.interactions.push(
    "Language switch preserves project route and changes content",
  );
  // Intercept only the local contact route. These are UI simulations, not delivery tests.
  let responseBody = { error: "send-failed" },
    status = 502,
    requests = 0;
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    if (req.url() === base + "/api/contact") {
      requests++;
      await req.respond({
        status,
        contentType: "application/json",
        body: JSON.stringify(responseBody),
      });
    } else await req.continue();
  });
  await page.goto(base + "/pt/contact", { waitUntil: "networkidle2" });
  await page.click('button[type="submit"]');
  assert.equal(requests, 0);
  await page.type("#name", "Browser Test");
  await page.type("#email", "browser@example.invalid");
  await page.type("#message", "A simulated enquiry for testing only.");
  await page.click('button[type="submit"]');
  await page.waitForSelector('[role="alert"]');
  assert.equal(
    await page.$eval("#message", (e) => e.value),
    "A simulated enquiry for testing only.",
  );
  responseBody = { status: "accepted" };
  status = 202;
  await page.click('button[type="submit"]');
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-live="polite"]')
      ?.textContent.includes("ainda não foi confirmada"),
  );
  assert.equal(
    await page.$eval('button[type="submit"]', (e) => e.disabled),
    true,
  );
  results.interactions.push(
    "Required fields block requests; failure preserves data; accepted is not presented as delivered",
  );
  await page.goto(base + "/en/contact", { waitUntil: "networkidle2" });
  responseBody = { status: "delivered" };
  status = 200;
  await page.type("#name", "Browser Test");
  await page.type("#email", "browser@example.invalid");
  await page.type("#message", "A simulated enquiry for testing only.");
  await page.click('button[type="submit"]');
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-live="polite"]')
      ?.textContent.includes("confirmed delivery"),
  );
  results.interactions.push(
    "Delivered state requires explicit delivered response (simulated)",
  );
  assert.equal(
    results.consoleErrors.length,
    0,
    JSON.stringify(results.consoleErrors),
  );
  fs.writeFileSync(
    "artifacts/review/browser-results.json",
    JSON.stringify(results, null, 2),
  );
  assert.equal(
    results.pages.flatMap((p) => p.violations).length,
    0,
    "Accessibility findings: see browser-results.json",
  );
  console.log("Browser checks passed. Contact requests were intercepted.");
} finally {
  fs.writeFileSync(
    "artifacts/review/browser-results.json",
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
