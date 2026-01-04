# Firebase Setup Guide

## Overview

This guide covers setting up Firebase for the VERTIKAL app, including the Founding 50 invite code validation function.

## Prerequisites

1. Firebase account
2. Firebase CLI installed: `npm install -g firebase-tools`
3. Node.js 18+

## Setup Steps

### 1. Initialize Firebase Project

```bash
firebase login
firebase init
```

Select:
- Functions
- Firestore
- Use existing project or create new one

### 2. Configure Environment Variables

Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_FUNCTIONS_URL=https://your-region-your-project.cloudfunctions.net
```

### 3. Install Function Dependencies

```bash
cd functions
npm install
```

### 4. Deploy Functions

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 5. Create Firestore Collection

Create the `founding50_invites` collection in Firestore with this structure:

**Collection: `founding50_invites`**

Document example:
```json
{
  "code": "V50-ABCD",
  "used": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2025-12-31T23:59:59Z" // Optional
}
```

### 6. Create Invite Codes Script

You can create invite codes manually in Firestore or use this script:

```typescript
// scripts/createInviteCodes.ts
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function createInviteCodes(count: number) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = `V50-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    codes.push(code);
    
    await db.collection('founding50_invites').add({
      code,
      used: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: null, // No expiration, or set a date
    });
  }
  console.log('Created codes:', codes);
}

createInviteCodes(50);
```

## Function Endpoints

### validateFounding50InviteCode

**URL:** `https://[region]-[project].cloudfunctions.net/validateFounding50InviteCode`

**Method:** POST

**Request Body:**
```json
{
  "inviteCode": "V50-ABCD"
}
```

**Response (Valid):**
```json
{
  "valid": true,
  "code": "V50-ABCD",
  "used": false,
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "reason": "Invalid invite code"
}
```

## Testing

### Local Testing

```bash
cd functions
npm run serve
```

The function will be available at:
`http://localhost:5001/[project-id]/[region]/validateFounding50InviteCode`

### Test with curl

```bash
curl -X POST \
  http://localhost:5001/[project-id]/[region]/validateFounding50InviteCode \
  -H "Content-Type: application/json" \
  -d '{"inviteCode": "V50-ABCD"}'
```

## Security Notes

1. Firestore rules prevent unauthorized writes to invite codes
2. Only admins can create/update invite codes via Admin SDK
3. Function validates codes server-side
4. Codes should be marked as used after successful profile creation

## Marking Codes as Used

After a user successfully creates their profile with a valid invite code, call:

```typescript
import { markInviteCodeAsUsed } from './functions/validateFounding50InviteCode/index';

await markInviteCodeAsUsed(inviteCode, userId);
```

This should be done in your backend after profile creation.


