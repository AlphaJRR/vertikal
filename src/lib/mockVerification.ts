import verificationCodesData from '../data/verification_codes.json';

export type VerificationResult = {
  success: boolean;
  message: string;
  tier?: 'master' | 'founding';
};

// SIMULATED DATABASE DELAY
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function verifyCode(code: string): Promise<VerificationResult> {
  await delay(1000); // Fake network latency

  const db = verificationCodesData as Record<string, any>;
  const normalizedCode = code.trim().toUpperCase();
  const entry = db[normalizedCode];

  if (!entry) {
    return { success: false, message: 'Invalid Access Code.' };
  }

  if (entry.used) {
    return { success: false, message: 'This code has already been claimed.' };
  }

  return { success: true, message: 'Access Granted.', tier: entry.tier };
}

export async function claimCode(code: string, email: string) {
  // In production, this would write to Firestore
  const normalizedCode = code.trim().toUpperCase();
  console.log(`[DB] Code ${normalizedCode} claimed by ${email}`);

  // TRIGGER FOUNDING 50 EMAIL
  console.log(`
  📧 [EMAIL SENT] To: ${email}
  SUBJECT: Welcome to the Founding 50 — Access Granted
  
  Hey Creator,
  
  You made it inside. Only fifty were invited. Only fifty will ever hold this title.
  
  Your Founding 50 access has been verified.
  
  YOUR ADVANTAGES:
  - 90% Revenue Split (Locked)
  - Early Director Access
  
  Welcome to the future of filmmaking.
  — VERTIKAL Team
  `);
}

// Legacy function for backward compatibility
interface LegacyVerificationResult {
  valid: boolean;
  reason?: string;
  code?: string;
  tier?: 'master' | 'founding';
}

/**
 * @deprecated Use verifyCode() instead
 * Legacy function for backward compatibility
 */
export const verifyFounding50Code = async (
  code: string
): Promise<LegacyVerificationResult> => {
  const result = await verifyCode(code);
  
  return {
    valid: result.success,
    reason: result.success ? undefined : result.message,
    code: result.success ? code.trim().toUpperCase() : undefined,
    tier: result.tier,
  };
};

/**
 * @deprecated Use claimCode() instead
 * Legacy function for backward compatibility
 */
export const markCodeAsUsed = (code: string, creatorId: string): void => {
  const normalizedCode = code.trim().toUpperCase();
  console.log(`[MOCK] Marking code ${normalizedCode} as used for creator ${creatorId}`);
  // In production, this would update the database
  // For now, we just log it
};
