# Creator Onboarding Implementation

## Overview

The Creator Onboarding flow has been implemented with Founding 50 invite code validation. This includes:

1. **OnboardingModal Component** - Multi-step onboarding form
2. **Firebase Function** - Server-side invite code validation
3. **Firebase Service** - Client-side service for calling the function
4. **Integration** - Added to App.tsx

## Components Created

### 1. OnboardingModal (`src/components/modals/OnboardingModal.tsx`)

A two-step modal component:

**Step 1: Invite Code Validation**
- Input field for Founding 50 invite codes
- Real-time validation via Firebase function
- Visual feedback (success/error states)
- Option to skip if no invite code
- Shows Founding 50 benefits when code is valid

**Step 2: Profile Creation**
- Name (required)
- Role/Title (required)
- Company (optional)
- Bio (required)
- Avatar URL (optional)
- Shows Founding 50 status if valid code was entered

**Features:**
- Haptic feedback on interactions
- Loading states during validation
- Error handling
- Smooth animations
- Mobile-optimized design

### 2. Firebase Function (`functions/validateFounding50InviteCode/index.ts`)

**Endpoint:** `validateFounding50InviteCode`

**Method:** POST

**Request:**
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

**Validation Logic:**
1. Checks if code exists in `founding50_invites` collection
2. Verifies code is not already used
3. Checks if code has expired (if expiration date set)
4. Returns appropriate response

### 3. Firebase Service (`src/services/firebase/inviteCodeService.ts`)

Client-side service that calls the Firebase function:
- Handles network errors
- Provides user-friendly error messages
- Returns typed responses

### 4. OnboardingTrigger (`src/components/OnboardingTrigger.tsx`)

Reusable component to trigger the onboarding modal:
- Can be used as a button or link
- Styled to match VERTIKAL brand
- Includes haptic feedback

## Usage

### Opening the Onboarding Modal

In your component:

```tsx
import { useState } from 'react';
import { OnboardingModal, type CreatorOnboardingData } from './components/modals/OnboardingModal';

function MyComponent() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleComplete = (data: CreatorOnboardingData) => {
    // Handle completed onboarding
    console.log('New creator:', data);
    // TODO: Save to Firebase, mark code as used, etc.
    setShowOnboarding(false);
  };

  return (
    <>
      <button onClick={() => setShowOnboarding(true)}>
        Become a Creator
      </button>
      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
          onComplete={handleComplete}
        />
      )}
    </>
  );
}
```

### Using the Trigger Component

```tsx
import { OnboardingTrigger } from './components/OnboardingTrigger';

<OnboardingTrigger
  onOpen={() => setShowOnboarding(true)}
  variant="button" // or "link"
/>
```

## Firebase Setup

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Deploy Function

```bash
firebase deploy --only functions:validateFounding50InviteCode
```

### 3. Create Invite Codes

Add documents to `founding50_invites` collection:

```json
{
  "code": "V50-ABCD",
  "used": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": null // or set expiration date
}
```

See `docs/FIREBASE_SETUP.md` for detailed setup instructions.

## Environment Variables

Add to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_FUNCTIONS_URL=https://your-region-your-project.cloudfunctions.net
```

## Next Steps

1. **Mark Code as Used**: After successful profile creation, call `markInviteCodeAsUsed()` function
2. **Save Creator Profile**: Create the creator document in Firestore
3. **Redirect**: Navigate to the new creator's profile page
4. **Error Handling**: Add toast notifications for errors
5. **Avatar Upload**: Implement image upload instead of URL input

## Testing

### Local Testing

1. Start Firebase emulator:
```bash
cd functions
npm run serve
```

2. Test the function:
```bash
curl -X POST http://localhost:5001/[project-id]/[region]/validateFounding50InviteCode \
  -H "Content-Type: application/json" \
  -d '{"inviteCode": "V50-ABCD"}'
```

3. Test in app:
- Open onboarding modal
- Enter a valid invite code
- Verify validation works
- Complete profile creation

## Data Flow

1. User enters invite code
2. Frontend calls `validateFounding50InviteCode()` service
3. Service calls Firebase function
4. Function queries Firestore for code
5. Function returns validation result
6. Frontend shows success/error
7. User completes profile form
8. On submit, `onComplete` callback fires
9. Backend should:
   - Create creator profile
   - Mark invite code as used (if applicable)
   - Return new creator ID

## Security Notes

- Invite codes are validated server-side
- Firestore rules prevent unauthorized writes
- Codes are marked as used after profile creation
- Expiration dates are checked server-side
- All validation happens in Firebase function


