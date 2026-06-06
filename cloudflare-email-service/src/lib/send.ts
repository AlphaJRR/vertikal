export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendEmailResult = {
  messageId: string;
};

/**
 * Send transactional email via Cloudflare Email Service binding.
 * `from` must use a domain onboarded with `wrangler email sending enable`.
 */
export async function sendEmail(
  email: SendEmail,
  env: Pick<Env, "FROM_EMAIL" | "FROM_NAME" | "REPLY_TO">,
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const response = await email.send({
    to: input.to,
    from: { email: env.FROM_EMAIL, name: env.FROM_NAME },
    replyTo: input.replyTo ?? env.REPLY_TO,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  return { messageId: response.messageId };
}

export type WelcomeEmailInput = {
  to: string;
  displayName?: string;
};

export function buildWelcomeEmail(
  env: Pick<Env, "FROM_NAME">,
  input: WelcomeEmailInput,
): SendEmailInput {
  const greeting = input.displayName?.trim()
    ? `Hi ${input.displayName.trim()},`
    : "Hi there,";

  const subject = "Welcome to Alpha Visual Artists";
  const text = [
    greeting,
    "",
    "Thanks for joining AVA — your creator toolkit and training hub.",
    "",
    "Open the app to explore lessons, calculators, and pro tools.",
    "",
    "— The AVA Team",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111;">
    <p>${escapeHtml(greeting)}</p>
    <p>Thanks for joining <strong>${escapeHtml(env.FROM_NAME)}</strong> — your creator toolkit and training hub.</p>
    <p>Open the app to explore lessons, calculators, and pro tools.</p>
    <p style="color: #666;">— The AVA Team</p>
  </body>
</html>`;

  return { to: input.to, subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
