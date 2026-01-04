# VERTIKAL UX Flows

## Section 1: Creator Onboarding Flow - Founding 50 Invite Code

### Overview
The Creator Onboarding flow allows new creators to join VERTIKAL. The "Founding 50" program provides exclusive early access with special benefits.

### Flow Steps

1. **Onboarding Modal Trigger**
   - User clicks "Become a Creator" or similar CTA
   - Modal opens with onboarding form

2. **Invite Code Entry (Founding 50)**
   - User enters invite code
   - System validates code against Firebase
   - Valid codes grant "Founding 50" status
   - Invalid codes show error message
   - Optional: Allow skipping if no invite code (regular creator)

3. **Creator Profile Setup**
   - Name
   - Role/Title
   - Company (optional)
   - Bio
   - Avatar upload
   - Initial project (optional)

4. **Verification & Completion**
   - Review entered information
   - Submit to create creator profile
   - Success: Redirect to new creator profile
   - Founding 50 badge applied if valid code used

### Founding 50 Invite Code Logic

**Firebase Function Requirements:**
- Function name: `validateFounding50InviteCode`
- Input: `{ inviteCode: string }`
- Output: `{ valid: boolean, code?: string, used?: boolean, expiresAt?: timestamp }`

**Validation Rules:**
1. Check if code exists in `founding50_invites` collection
2. Verify code is not already used (`used: false`)
3. Check if code has expired (`expiresAt > now`)
4. If valid:
   - Mark code as used (or reserve for user)
   - Return `{ valid: true, code: string }`
5. If invalid:
   - Return `{ valid: false, reason: string }`

**Database Structure:**
```
founding50_invites/
  {codeId}/
    code: string (unique)
    used: boolean
    usedBy?: string (userId)
    usedAt?: timestamp
    expiresAt?: timestamp
    createdAt: timestamp
```

### UI Components Needed

- `OnboardingModal.tsx` - Main onboarding form
- Invite code input field with validation
- Profile form fields
- Success/error states
- Loading states during Firebase calls


