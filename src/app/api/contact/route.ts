import { randomUUID } from "node:crypto";
import { isContactConfigured } from "@/lib/contact-config";

export const runtime = "nodejs";

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  budget?: unknown;
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
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
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
  if (!isContactConfigured()) {
    return jsonResponse({ error: "contact-not-configured" }, 503);
  }

  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return jsonResponse({ error: "invalid-body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse({ error: "invalid-body" }, 400);
  }
  if (toText(body.website)) {
    return jsonResponse({ error: "invalid-fields" }, 400);
  }

  const name = toText(body.name);
  const email = toText(body.email);
  const budget = toText(body.budget);
  const message = toText(body.message);

  if (
    name.length < 2 ||
    name.length > 100 ||
    !isValidEmail(email) ||
    email.length > 160 ||
    budget.length > 100 ||
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

  const from = process.env.CONTACT_FROM_EMAIL;
  const emailText = [
    "New portfolio contact",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Budget: ${budget || "Not specified"}`,
    "",
    message,
  ].join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      signal: AbortSignal.timeout(12000),
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
        subject: "[Portfolio] New project enquiry",
        text: emailText,
      }),
    });

    if (!resendResponse.ok) {
      console.error(
        "[contact-email] Provider rejected request:",
        resendResponse.status,
      );

      return jsonResponse({ error: "send-failed" }, 502);
    }

    const receipt = (await resendResponse.json()) as { id?: string };
    if (!receipt.id || typeof receipt.id !== "string") {
      return jsonResponse({ error: "submission-unknown" }, 502);
    }
    // Acceptance is not delivery. Only show delivered after an explicit provider event.
    // Sending-only keys may not permit this read; keep the status honest in that case.
    try {
      const deliveryResponse = await fetch(
        `https://api.resend.com/emails/${encodeURIComponent(receipt.id)}`,
        {
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        },
      );
      if (deliveryResponse.ok) {
        const delivery = (await deliveryResponse.json()) as {
          last_event?: string;
        };
        if (delivery.last_event === "delivered")
          return jsonResponse({ status: "delivered" });
        if (
          ["bounced", "failed", "suppressed"].includes(
            delivery.last_event || "",
          )
        ) {
          return jsonResponse({ error: "send-failed" }, 502);
        }
      }
    } catch {
      /* The submission was accepted, but delivery remains unconfirmed. */
    }
    return jsonResponse({ status: "accepted" }, 202);
  } catch (error) {
    console.error(
      "[contact-email] Submission outcome unknown:",
      error instanceof Error ? error.name : "UnknownError",
    );
    return jsonResponse({ error: "submission-unknown" }, 504);
  }
}
