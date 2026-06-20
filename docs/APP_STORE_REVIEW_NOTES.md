# App Store Connect — Notes for Reviewer

**App:** Alpha Visual Artists (Alpha Creators)  
**Bundle:** com.alphavisualartists.app  
**Version:** 1.0.5 (or current)

---

## Demo Account Credentials

| Role | Email | Password |
|---|---|---|
| **Operator** (photographer) | reviewer@alphavisualartists.com | AVAReview2026! |
| **Standard user** (attendee) | reviewer.attendee@alphavisualartists.com | AVAReview2026! |

**Attendee gallery code:** `DEMO01`

These are live accounts on the production Supabase backend with pre-seeded demo data. Both accounts have already accepted the Terms of Service so the consent screen is bypassed on sign-in.

---

## How to Access Demo Accounts in the App

On the **Sign In** screen, scroll to the bottom and tap **"App Review demo accounts"** — this expands a panel with both email addresses. Tap **"Pre-fill"** next to either account to populate the email field, then enter the password above and tap **Sign in**.

The existing **"Continue as Reviewer"** button (also on the Sign In screen) unlocks the Creator Toolkit features (lessons, calculators, etc.) without an account and remains available.

---

## Walk-Through 1 — Operator (Photographer) Flow

**Sign in as:** reviewer@alphavisualartists.com

1. **Events tab** — tap the "Events" icon (camera) in the tab bar.  
   You will see the **Operator view**: event list, "New" button, "Redeem a code" and "My gallery" shortcuts.

2. **AVA Demo Shoot** — tap the pre-seeded event card.  
   You will see the event detail with a QR code, 4 action buttons.

3. **Create attendee + code** — tap this button.  
   Enter a first name, last name (phone/email optional). Tap "Create & get code."  
   A unique 6-character redeem code is generated and displayed — this is the buyer's "receipt" for their offline payment.  
   Tap "Share code with buyer" to see the native share sheet.  
   Tap "Assign photos to this buyer" to go to the assign screen.

4. **Upload photos** — from the event detail, tap "Upload photos."  
   Tap "Select photos" — camera roll picker opens (multi-select).  
   Select 2–3 photos. They are queued and uploaded in the background.

5. **Assign photos** — from the event detail, tap "Assign photos."  
   Select any photo → search for "Demo Reviewer" → toggle the checkmark.  
   The assignment is instant (RLS now resolves the attendee gallery).

6. **Dashboard** — tap "Dashboard" from the event detail.  
   Live metrics: photos, attendees, installs, delivered, codes redeemed, releases signed.  
   Pull-to-refresh or leave the screen open — updates in realtime via Supabase Realtime.

7. **Settings** — tap the gear icon (top-right of Events tab).  
   Shows: account email, marketing toggle, Privacy Policy link, Terms link, Sign out, **Delete my account** button.  
   Tapping "Delete my account" shows a confirmation alert → proceeds to soft-delete + PII purge.  
   *(Do not delete the operator demo account before also testing the attendee flow.)*

---

## Walk-Through 2 — Standard User (Attendee) Flow

**Sign out** from the operator account first (Settings → Sign out), then:  
**Sign in as:** reviewer.attendee@alphavisualartists.com

1. **Events tab** — you will see the **Attendee view**: only "Enter my code" and "View all my photos" — no create/upload/assign/dashboard buttons appear anywhere.

2. **Enter my code** — tap the cyan "Enter my code" button.  
   Type `DEMO01` and tap "Unlock gallery."  
   A success screen confirms the event name ("AVA Demo Shoot"). Tap "View my gallery."

3. **Gallery** — assigned photos appear as thumbnails (signed URLs loaded from the private storage bucket).  
   Tap any photo → full-screen view.

4. **Free download** — tap "Download full-res — FREE."  
   The app requests Photo Library permission (if not already granted) → downloads the original → saves to Photos app.  
   **There is no price, no purchase button, no Stripe UI anywhere.**

5. **Share** — tap "Share" to invoke the native iOS share sheet.

6. **Account deletion** — Settings → "Delete my account."  
   Soft-deletes the attendee row, purges PII (name, email, phone), then deletes the auth user.  
   The app returns to the signed-out state.

---

## Compliance Notes

| Guideline | Resolution |
|---|---|
| **3.1.1 Payments** | Physical prints are an **offline sale** (cash/card reader). Digital downloads are **free**. No in-app purchase, no Stripe, no price UI anywhere. |
| **5.1.1(i) Data minimization** | Account creation requires only name + email. Phone and interests are optional and clearly labeled. Neither gates the gallery. |
| **5.1.1(v) Account deletion** | "Delete my account" is in Settings. Calls the `delete-account` edge function: soft-delete → PII purge → `auth.admin.deleteUser`. |
| **5.1.1 Consent / marketing** | Age-gate (18+/guardian) + photo-release + ToS — three separate checkboxes. Marketing opt-in is a **fourth, separate, un-pre-checked** box. A `consent_log` row is written for each. |
| **Kids / COPPA** | Age gate requires 18+/guardian confirmation. Not categorized as a Kids app. No marketing to minors. |
| **4.8 Sign in with Apple** | Auth is email/phone OTP only — no social login → SIWA not triggered. |
| **2.1 / 2.2 Completeness** | All screens are fully functional. No "coming soon" or placeholder UI exists. |
| **Permission strings** | `NSPhotoLibraryUsageDescription` = "Access photos to upload event images." `NSPhotoLibraryAddUsageDescription` = "Save your event photos to your library." |

---

## Pre-Submission Checklist for JR

- [ ] Run `scripts/seed-review-demo.sql` in Supabase SQL editor with both user UUIDs filled in
- [ ] Sign in as operator, upload 2–3 photos to "AVA Demo Shoot", assign them to "Demo Reviewer" (code DEMO01)
- [ ] Verify attendee can redeem DEMO01 and see the gallery
- [ ] Paste credentials above into App Store Connect → App Review Information → Demo Account
- [ ] Paste the Walk-Through sections above into the "Notes" field
- [ ] Update App Privacy nutrition label: Name + Email collected; Phone optional; no payment data
- [ ] Confirm live privacy policy URL at https://alphavisualartists.com/privacy
