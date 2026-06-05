import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { createVerify } from "node:crypto";
import { put } from "@vercel/blob";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

interface CoverRequestBody {
  projectId?: string;
  name?: string;
  url?: string;
}

interface FirebaseTokenPayload {
  aud?: string;
  email?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  sub?: string;
}

const FIREBASE_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const SCREENSHOT_WIDTH = 1200;
const SCREENSHOT_HEIGHT = 900;
const CLIENT_ERROR_CODES = new Set([
  "invalid-url",
  "invalid-protocol",
  "private-host",
  "private-ip",
  "url-required",
]);

const jsonResponse = (body: unknown, status = 200) => {
  return Response.json(body, { status });
};

const decodeBase64Url = (value: string) => {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
};

const parseJwtPart = <T,>(value: string) => {
  return JSON.parse(decodeBase64Url(value).toString("utf8")) as T;
};

const verifyFirebaseToken = async (authorizationHeader: string | null) => {
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : "";

  if (!token || !PROJECT_ID) {
    return null;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const header = parseJwtPart<{ alg?: string; kid?: string }>(encodedHeader);

  if (header.alg !== "RS256" || !header.kid) {
    return null;
  }

  const certsResponse = await fetch(FIREBASE_CERTS_URL, {
    next: { revalidate: 3600 },
  });

  if (!certsResponse.ok) {
    return null;
  }

  const certs = (await certsResponse.json()) as Record<string, string>;
  const cert = certs[header.kid];

  if (!cert) {
    return null;
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();

  const isValidSignature = verifier.verify(cert, decodeBase64Url(encodedSignature));

  if (!isValidSignature) {
    return null;
  }

  const payload = parseJwtPart<FirebaseTokenPayload>(encodedPayload);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  if (
    payload.aud !== PROJECT_ID ||
    payload.iss !== `https://securetoken.google.com/${PROJECT_ID}` ||
    !payload.sub ||
    !payload.exp ||
    !payload.iat ||
    payload.exp < nowInSeconds ||
    payload.iat > nowInSeconds
  ) {
    return null;
  }

  if (
    ADMIN_EMAILS.length > 0 &&
    (!payload.email || !ADMIN_EMAILS.includes(payload.email.toLowerCase()))
  ) {
    return null;
  }

  return payload;
};

const isPrivateIp = (address: string) => {
  const normalizedAddress = address.toLowerCase();
  const mappedIpv4 = normalizedAddress.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);

  if (mappedIpv4) {
    return isPrivateIp(mappedIpv4[1]);
  }

  if (address === "0.0.0.0" || address.startsWith("127.")) {
    return true;
  }

  if (address.startsWith("10.") || address.startsWith("192.168.")) {
    return true;
  }

  if (address.startsWith("169.254.")) {
    return true;
  }

  const firstTwoOctets = address.split(".").map(Number);

  if (firstTwoOctets[0] === 172 && firstTwoOctets[1] >= 16 && firstTwoOctets[1] <= 31) {
    return true;
  }

  return (
    normalizedAddress === "::1" ||
    normalizedAddress.startsWith("fc") ||
    normalizedAddress.startsWith("fd") ||
    normalizedAddress.startsWith("fe80:")
  );
};

const assertPublicUrl = async (rawUrl: string) => {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("invalid-url");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("invalid-protocol");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("private-host");
  }

  if (isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error("private-ip");
  }

  const addresses = await lookup(hostname, { all: true });

  if (addresses.some((address) => isPrivateIp(address.address))) {
    throw new Error("private-ip");
  }

  return url;
};

const slugify = (value: string) => {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
};

const getExecutablePath = async () => {
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return process.env.CHROME_EXECUTABLE_PATH;
  }

  return chromium.executablePath();
};

const captureScreenshot = async (url: URL) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: SCREENSHOT_WIDTH,
      height: SCREENSHOT_HEIGHT,
      deviceScaleFactor: 1,
    },
    executablePath: await getExecutablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page
      .waitForNetworkIdle({
        idleTime: 1000,
        timeout: 8000,
      })
      .catch(() => undefined);
    await page
      .evaluate(() => document.fonts.ready.then(() => true))
      .catch(() => undefined);

    const screenshot = await page.screenshot({
      type: "webp",
      quality: 88,
    });

    return Buffer.from(screenshot);
  } finally {
    await browser.close();
  }
};

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return jsonResponse({ error: "blob-token-missing" }, 500);
  }

  const payload = await verifyFirebaseToken(request.headers.get("authorization"));

  if (!payload) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  let body: CoverRequestBody;

  try {
    body = (await request.json()) as CoverRequestBody;
  } catch {
    return jsonResponse({ error: "invalid-body" }, 400);
  }

  if (!body.url) {
    return jsonResponse({ error: "url-required" }, 400);
  }

  try {
    const targetUrl = await assertPublicUrl(body.url);
    const projectSlug = slugify(body.name || body.projectId || targetUrl.hostname);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const pathname = `project-covers/${projectSlug}-${timestamp}.webp`;
    const screenshot = await captureScreenshot(targetUrl);
    const blob = await put(pathname, screenshot, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
    });

    return jsonResponse({ coverUrl: blob.url, pathname: blob.pathname });
  } catch (error) {
    const message = error instanceof Error ? error.message : "capture-failed";
    const status = CLIENT_ERROR_CODES.has(message) ? 400 : 500;

    console.error("[project-cover]", message, error);

    return jsonResponse({ error: message || "capture-failed" }, status);
  }
}
