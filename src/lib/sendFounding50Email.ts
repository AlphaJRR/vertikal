/**
 * Sends the Founding 50 welcome email
 * Currently logs to console - can be integrated with SendGrid or Firebase Functions later
 */

interface EmailOptions {
  to: string;
  creatorName?: string;
}

export const sendFounding50Email = (options: EmailOptions): void => {
  const { to, creatorName } = options;

  const subject = 'Welcome to the Founding 50 — Access Granted';

  const emailBody = `Hey Creator,

You made it inside.
Only fifty were invited. Only fifty will ever hold this title.

This isn't a membership.
It's a distinction.

Your Founding 50 access has been verified, and your creator status is now unlocked on VERTIKAL — the first platform built specifically for directors, filmmakers, storytellers, and every creator transforming culture one vertical frame at a time.

Your Advantages Start Now
You receive the Founding 50 Revenue Split:
90% to You. 10% to VERTIKAL.
Forever tied to your account.
Never offered again.

You also gain early access to upcoming features, including:
• Creator Portfolio
• Pilot Episode Drops
• Crew Network
• Analytics + Tipping Tools
• Early Director Access

Your Only Obligation
Represent the platform with intention.

Founding 50 slots are non-transferable.
Your access is tied to your verification code and identity.
If you lose it, it's gone.

Next Step: Complete Your Profile
Your creator profile is your storefront, your portfolio, and your digital studio all in one.
Finish setting it up so your content and branding hit at 100%.

→ Complete Your Profile (link)

Welcome to the future of filmmaking.
Welcome to the Founding 50.

— VERTIKAL Team
"Where Creators Become Directors."`;

  // Log to console for now
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 FOUNDING 50 WELCOME EMAIL');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(emailBody);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // In production, integrate with SendGrid, Firebase Functions, or email service
  // Example:
  // await sendGrid.send({
  //   to,
  //   subject,
  //   html: formatEmailHTML(emailBody),
  // });
};



