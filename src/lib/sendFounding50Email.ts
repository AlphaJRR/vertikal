export function sendFounding50Email(creatorEmail: string, creatorHandle: string) {
  const subject = "Welcome to the Founding 50 — Access Granted";
  const body = `Hey Creator,

You made it inside.
Only fifty were invited. Only fifty will ever hold this title.

This isn’t a membership.
It’s a distinction.

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
If you lose it, it’s gone.

Next Step: Complete Your Profile
Your creator profile is your storefront, your portfolio, and your digital studio all in one.
Finish setting it up so your content and branding hit at 100%.

→ Complete Your Profile (link)

Welcome to the future of filmmaking.
Welcome to the Founding 50.

— VERTIKAL Team
"Where Creators Become Directors."`;

  // For mock mode: log to console and return a resolved promise
  console.log("=== Founding 50 Email ===");
  console.log("To:", creatorEmail);
  console.log("Subject:", subject);
  console.log(body);
  console.log("=========================");
  return Promise.resolve({ ok: true });
}
