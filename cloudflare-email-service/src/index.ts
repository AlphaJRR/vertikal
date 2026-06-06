import { handleInboundEmail } from "./lib/inbound";
import { buildWelcomeEmail, sendEmail, type SendEmailInput } from "./lib/send";

type JsonRecord = Record<string, unknown>;

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

async function handleFetch(
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (url.pathname === "/health" && request.method === "GET") {
    return json({ ok: true, service: "ava-email", domain: "alphavisualartists.com" });
  }

  if (url.pathname === "/send" && request.method === "POST") {
    return await handleSend(request, env);
  }

  return json({ error: "Not found" }, 404);
}

export default {
  fetch: handleFetch,
  email: handleInboundEmail,
} satisfies ExportedHandler<Env>;

async function handleSend(request: Request, env: Env): Promise<Response> {
  if (!env.EMAIL_API_KEY) {
    console.error("[ava-email] EMAIL_API_KEY secret is not configured");
    return json({ error: "Email API is not configured" }, 503);
  }

  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${env.EMAIL_API_KEY}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: JsonRecord;
  try {
    body = (await request.json()) as JsonRecord;
  } catch (error) {
    console.error("[ava-email] invalid JSON body:", error);
    return json({ error: "Invalid JSON body" }, 400);
  }

  try {
    const payload = resolvePayload(env, body);
    const result = await sendEmail(env.SEND_EMAIL, env, payload);
    return json({ ok: true, messageId: result.messageId });
  } catch (error) {
    console.error("[ava-email] send failed:", error);
    const message = error instanceof Error ? error.message : "Send failed";
    return json({ error: message }, 502);
  }
}

function resolvePayload(env: Env, body: JsonRecord): SendEmailInput {
  const template = typeof body.template === "string" ? body.template : undefined;
  const to = body.to;

  if (typeof to !== "string" || !to.includes("@")) {
    throw new Error("Field `to` must be a valid email address");
  }

  if (template === "welcome") {
    const displayName =
      typeof body.displayName === "string" ? body.displayName : undefined;
    return buildWelcomeEmail(env, { to, displayName });
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const html = typeof body.html === "string" ? body.html : "";
  const text = typeof body.text === "string" ? body.text : "";

  if (!subject || !html || !text) {
    throw new Error("Custom sends require `subject`, `html`, and `text`");
  }

  return {
    to,
    subject,
    html,
    text,
    replyTo: typeof body.replyTo === "string" ? body.replyTo : undefined,
  };
}

function json(data: JsonRecord, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
