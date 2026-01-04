/**
 * Firebase Cloud Function: validateFounding50InviteCode
 * 
 * Validates Founding 50 invite codes and checks:
 * - Code exists
 * - Code is not already used
 * - Code has not expired
 * 
 * POST /validateFounding50InviteCode
 * Body: { inviteCode: string }
 * 
 * Returns: { valid: boolean, reason?: string, code?: string, used?: boolean, expiresAt?: timestamp }
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface InviteCodeRequest {
  inviteCode: string;
}

interface InviteCodeDoc {
  code: string;
  used: boolean;
  usedBy?: string;
  usedAt?: admin.firestore.Timestamp;
  expiresAt?: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
}

export const validateFounding50InviteCode = functions.https.onRequest(
  async (request, response) => {
    // Enable CORS
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }

    // Only allow POST
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { inviteCode }: InviteCodeRequest = request.body;

      // Validate input
      if (!inviteCode || typeof inviteCode !== 'string' || !inviteCode.trim()) {
        response.status(400).json({
          valid: false,
          reason: 'Invite code is required',
        });
        return;
      }

      const normalizedCode = inviteCode.trim().toUpperCase();

      // Query for the invite code
      const inviteCodeQuery = await db
        .collection('founding50_invites')
        .where('code', '==', normalizedCode)
        .limit(1)
        .get();

      // Check if code exists
      if (inviteCodeQuery.empty) {
        response.status(200).json({
          valid: false,
          reason: 'Invalid invite code',
        });
        return;
      }

      const inviteDoc = inviteCodeQuery.docs[0];
      const inviteData = inviteDoc.data() as InviteCodeDoc;

      // Check if code is already used
      if (inviteData.used) {
        response.status(200).json({
          valid: false,
          reason: 'This invite code has already been used',
          code: normalizedCode,
          used: true,
        });
        return;
      }

      // Check if code has expired
      const now = admin.firestore.Timestamp.now();
      if (inviteData.expiresAt && inviteData.expiresAt < now) {
        response.status(200).json({
          valid: false,
          reason: 'This invite code has expired',
          code: normalizedCode,
          expiresAt: inviteData.expiresAt.toDate().toISOString(),
        });
        return;
      }

      // Code is valid
      response.status(200).json({
        valid: true,
        code: normalizedCode,
        used: false,
        expiresAt: inviteData.expiresAt
          ? inviteData.expiresAt.toDate().toISOString()
          : undefined,
      });
    } catch (error) {
      console.error('Error validating invite code:', error);
      response.status(500).json({
        valid: false,
        reason: 'Internal server error',
      });
    }
  }
);

/**
 * Helper function to mark an invite code as used
 * This should be called after a user successfully creates their profile
 */
export const markInviteCodeAsUsed = async (
  inviteCode: string,
  userId: string
): Promise<void> => {
  try {
    const normalizedCode = inviteCode.trim().toUpperCase();
    const inviteCodeQuery = await db
      .collection('founding50_invites')
      .where('code', '==', normalizedCode)
      .limit(1)
      .get();

    if (inviteCodeQuery.empty) {
      throw new Error('Invite code not found');
    }

    const inviteDoc = inviteCodeQuery.docs[0];
    await inviteDoc.ref.update({
      used: true,
      usedBy: userId,
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking invite code as used:', error);
    throw error;
  }
};


