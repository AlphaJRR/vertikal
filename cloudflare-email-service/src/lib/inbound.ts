/**
 * Inbound email routing for alphavisualartists.com via Cloudflare Email Routing.
 * Connect addresses to this worker in Dashboard → Email Service → Email Routing.
 */
export async function handleInboundEmail(
  message: ForwardableEmailMessage,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  const forwardTo = env.FORWARD_TO?.trim();
  if (!forwardTo) {
    console.error("[ava-email] FORWARD_TO is not configured; rejecting inbound email");
    message.setReject("Inbound routing is not configured");
    return;
  }

  const subject = message.headers.get("subject") ?? "(no subject)";
  console.log(
    `[ava-email] inbound from=${message.from} to=${message.to} subject=${subject} size=${message.rawSize}`,
  );

  try {
    await message.forward(
      forwardTo,
      new Headers({
        "X-Original-Recipient": message.to,
        "X-AVA-Inbound": "true",
      }),
    );
  } catch (error) {
    console.error("[ava-email] forward failed:", error);
    message.setReject("Unable to deliver message");
    return;
  }

  if (env.AUTO_REPLY_ENABLED === "true") {
    ctx.waitUntil(sendAutoReply(message, env, subject));
  }
}

async function sendAutoReply(
  message: ForwardableEmailMessage,
  env: Env,
  subject: string,
): Promise<void> {
  const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
  const text = [
    "Thanks for contacting Alpha Visual Artists.",
    "",
    "We received your message and will respond as soon as we can.",
    "",
    "— The AVA Team",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111;">
    <p>Thanks for contacting <strong>Alpha Visual Artists</strong>.</p>
    <p>We received your message and will respond as soon as we can.</p>
    <p style="color: #666;">— The AVA Team</p>
  </body>
</html>`;

  try {
    await env.SEND_EMAIL.send({
      to: message.from,
      from: { email: env.REPLY_TO, name: env.FROM_NAME },
      replyTo: env.REPLY_TO,
      subject: replySubject,
      html,
      text,
    });
  } catch (error) {
    console.error("[ava-email] auto-reply failed:", error);
  }
}
