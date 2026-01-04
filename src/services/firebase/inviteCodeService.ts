import { functionsBaseUrl } from './config';

export interface InviteCodeValidationResult {
  valid: boolean;
  reason?: string;
  code?: string;
  used?: boolean;
  expiresAt?: string;
}

/**
 * Validates a Founding 50 invite code via Firebase Function
 * @param inviteCode - The invite code to validate
 * @returns Validation result with status and details
 */
export const validateFounding50InviteCode = async (
  inviteCode: string
): Promise<InviteCodeValidationResult> => {
  try {
    const response = await fetch(
      `${functionsBaseUrl}/validateFounding50InviteCode`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        valid: false,
        reason: errorData.error || 'Failed to validate invite code',
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating invite code:', error);
    return {
      valid: false,
      reason: 'Network error. Please check your connection and try again.',
    };
  }
};


