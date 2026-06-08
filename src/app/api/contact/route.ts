import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
}

const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const requestsByIp = new Map<string, number[]>();

const toText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const recentRequests = (requestsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestsByIp.set(ip, recentRequests);
    return true;
  }

  requestsByIp.set(ip, [...recentRequests, now]);
  return false;
};

const jsonResponse = (body: unknown, status = 200) => {
  return Response.json(body, { status });
};

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return jsonResponse({ error: "contact-not-configured" }, 500);
  }

  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return jsonResponse({ error: "invalid-body" }, 400);
  }

  if (toText(body.website)) {
    return jsonResponse({ success: true });
  }

  const name = toText(body.name);
  const email = toText(body.email);
  const subject = toText(body.subject);
  const message = toText(body.message);

  if (
    name.length < 2 ||
    name.length > 100 ||
    !isValidEmail(email) ||
    email.length > 160 ||
    subject.length < 3 ||
    subject.length > 160 ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return jsonResponse({ error: "invalid-fields" }, 400);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return jsonResponse({ error: "rate-limited" }, 429);
  }

  const from =
    process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const emailText = [
    "New portfolio contact",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: emailText,
        headers: {
          Importance: "high",
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
        },
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("[contact-email]", resendResponse.status, resendError);

      return jsonResponse({ error: "send-failed" }, 502);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("[contact-email]", error);
    return jsonResponse({ error: "send-failed" }, 502);
  }
}
