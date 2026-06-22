# App Store Connect — Notes for Reviewer

**App:** Alpha Visual Artists (Alpha Creators)  
**Bundle:** com.alphavisualartists.app  
**Version:** 1.30.1

---

## Demo Account Credentials

| Role | Email | Password |
|---|---|---|
| **Operator** (photographer) | reviewer@alphavisualartists.com | AVAReview2026! |
| **Standard user** (attendee) | reviewer.attendee@alphavisualartists.com | AVAReview2026! |

**Attendee gallery code:** `DEMO01`

These are live accounts on the production Supabase backend with pre-seeded demo data.

**Account-level consent (bypassed for both demo accounts):** Both accounts have `tos_accepted_at` and `age_gate_confirmed_at` already set, so the account-level consent screen (18+/guardian confirmation + ToS acceptance) is skipped on sign-in.

**Per-event photo-release consent (will appear for the attendee):** The attendee account (`reviewer.attendee`) does NOT have `photo_consent_at` set for the DEMO01 code. When the reviewer taps "Enter my code" and submits `DEMO01`, the app will show the **Photo Release** screen before revealing any photos. This is intentional — it demonstrates the full per-event consent flow.

---

## How to Access Demo Accounts in the App

On the **Sign In** screen, scroll to the bottom and tap **"App Review demo accounts"** — this expands a panel with both email addresses. Tap **"Pre-fill"** next to either account to populate the email field, then enter the password above and tap **Sign in**.

The existing **"Continue as Reviewer"** button (also on the Sign In screen) unlocks the Creator Toolkit features (lessons, calculators, etc.) without an account and remains available.

---

## Walk-Through 1 — Operator (Photographer) Flow

**Sign in as:** reviewer@alphavisualartists.com

1. **Events tab** — tap the "Events" icon (camera) in the scrollable tab bar.  
   You will see the **Operator view**: event list, "New" button, "Redeem a code" and "My gallery" shortcuts.

2. **Production tab** — tap the "Production" tab (film icon).  
   This is the merged Shoot + Edit workflow. The Pre-Shoot checklist, Shoot Day log, and Edit checklist are three sections in one scrollable screen. Data is saved locally (AsyncStorage) and backed up to your account when signed in.

3. **More tab** — tap the "More" tab (circle with dots).  
   Shows: Account (avatar + name/email), Plan (Free / AVA Pro coming soon), Projects & Sync (project count + cloud sync status), Creators (How To, Tutorial, Instagram), Support (FAQ, Settings, Privacy Policy, Delete Account).

4. **AVA Demo Shoot** — back on Events tab, tap the pre-seeded event card.  
   You will see the event detail with a QR code, 4 action buttons.

5. **Create attendee + code** — tap this button.  
   Enter a first name, last name (phone/email optional). Tap "Create & get code."  
   A unique 6-character redeem code is generated and displayed — this is the buyer's "receipt" for their offline payment.  
   Tap "Share code with buyer" to see the native share sheet.  
   Tap "Assign photos to this buyer" to go to the assign screen.

6. **Upload photos** — from the event detail, tap "Upload photos."  
   Tap "Select photos" — camera roll picker opens (multi-select).  
   Select 2–3 photos. They are queued and uploaded in the background.

7. **Assign photos** — from the event detail, tap "Assign photos."  
   Select any photo → search for "Demo Reviewer" → toggle the checkmark.  
   The assignment is instant (RLS now resolves the attendee gallery).

8. **Dashboard** — tap "Dashboard" from the event detail.  
   Live metrics: photos, attendees, installs, delivered, codes redeemed, releases signed.  
   Pull-to-refresh or leave the screen open — updates in realtime via Supabase Realtime.

9. **Settings** — tap the gear icon (top-right of Events tab) OR More tab → Support → Settings.  
   Shows: account email, marketing toggle, Privacy Policy link, Terms link, Sign out, **Delete my account** button.  
   Tapping "Delete my account" shows a confirmation alert → proceeds to soft-delete + PII purge.  
   *(Do not delete the operator demo account before also testing the attendee flow.)*

---

## Walk-Through 2 — Standard User (Attendee) Flow

**Sign out** from the operator account first (More tab → Support → Settings → Sign out), then:  
**Sign in as:** reviewer.attendee@alphavisualartists.com

1. **Events tab** — you will see the **Attendee view**: only "Enter my code" and "View all my photos" — no create/upload/assign/dashboard buttons appear anywhere.

2. **Enter my code** — tap the cyan "Enter my code" button.  
   Type `DEMO01` and tap "Unlock gallery."

3. **Per-event photo release consent** — the app shows the **Photo Release** screen before revealing any photos. A single checkbox reads: "I consent to my event photos being displayed in my private gallery and shared only with me." A separate, un-pre-checked optional marketing box is also shown.  
   Check the required box → tap "View my photos."  
   This writes `attendees.photo_consent_at` and a `consent_log` row. On future redeems at the same event this screen is skipped.

4. **Gallery** — assigned photos appear as thumbnails (signed URLs loaded from the private storage bucket).  
   Tap any photo → full-screen view.

5. **Free download** — tap "Download full-res — FREE."  
   The app requests Photo Library permission (if not already granted) → downloads the original → saves to Photos app.  
   **There is no price, no purchase button, no Stripe UI anywhere.**

6. **Share** — tap "Share" to invoke the native iOS share sheet.

7. **More tab** — shows the same groups as the operator view. "Projects & Sync" shows the attendee's project count and sync status.

8. **Account deletion** — More tab → Support → Settings → "Delete my account."  
   Soft-deletes the attendee row, purges PII (name, email, phone), then deletes the auth user.  
   The app returns to the signed-out state.

---

## Compliance Notes

| Guideline | Resolution |
|---|---|
| **3.1.1 Payments** | Physical prints are an **offline sale** (cash/card reader). Digital downloads are **free**. No in-app purchase, no Stripe, no price UI anywhere. |
| **5.1.1(i) Data minimization** | Account creation requires only name + email. Phone and interests are optional and clearly labeled. Neither gates the gallery. |
| **5.1.1(v) Account deletion** | "Delete my account" is in Settings. Calls the `delete-account` edge function: soft-delete → PII purge → `auth.admin.deleteUser`. |
| **5.1.1 Consent / marketing** | **Two separate, sequential consent steps:** (1) *Account-level* (once at signup) — 18+/guardian confirmation + ToS acceptance; marketing opt-in is a separate, un-pre-checked checkbox. Written to `profiles.tos_accepted_at`, `age_gate_confirmed_at`. Screen: `app/consent.tsx`. (2) *Per-event photo-release* (once per event, at redeem time) — user consents to “my event photos being shown in my private gallery.” Written to `attendees.photo_consent_at` + a `consent_log` row (`consent_type='photo_release'`). Screen: `app/photo-release.tsx`; skipped on subsequent redeems of the same event. |
| **Kids / COPPA** | Account-level consent (step 1 above) requires 18+/guardian confirmation before account creation completes. Not categorized as a Kids app. No marketing to minors. |
| **4.8 Sign in with Apple** | Auth is email/phone OTP only — no social login → SIWA not triggered. |
| **2.1 / 2.2 Completeness** | All screens are fully functional. No "coming soon" or placeholder UI exists. |
| **Permission strings** | `NSPhotoLibraryUsageDescription` = "Access photos to upload event images." `NSPhotoLibraryAddUsageDescription` = "Save your event photos to your library." |

---

## Pre-Submission Checklist for JR

### Seed & demo data
- [ ] Run `scripts/seed-review-demo.sql` in Supabase SQL editor with both user UUIDs filled in
- [ ] Sign in as operator, upload 2–3 photos to "AVA Demo Shoot", assign them to "Demo Reviewer" (code DEMO01)
- [ ] Verify attendee can redeem DEMO01, sees the Photo Release screen, accepts, and then sees the gallery
- [ ] Reset `attendees.photo_consent_at = NULL` for the demo attendee row so reviewer sees the full consent flow

### App Store Connect fields
- [ ] Build version set to **1.30.1** in App Store Connect
- [ ] Paste credentials above into App Store Connect → App Review Information → Demo Account
- [ ] Paste the Walk-Through sections above (both flows) into the "Notes" field
- [ ] Paste the "What's New" text into the Version Information → What's New field
- [ ] Update App Privacy nutrition label: Name + Email collected; Phone optional; no payment data; no location; no tracking
- [ ] Confirm live privacy policy URL at https://alphavisualartists.com/privacy
- [ ] Confirm live terms URL at https://alphavisualartists.com/terms
- [ ] Age rating: 17+ (infrequent/mild content — event photography)
- [ ] Age Rating → **“In-App Controls / Age Assurance” = NONE**  
  *(This specific toggle — not the overall rating — caused 3 prior rejections.  
  Confirm it is set to None before submitting.)*

### Final device verification (JR confirms on physical device)
- [ ] Operator flow: create event → upload → assign → dashboard realtime update
- [ ] Attendee flow: redeem DEMO01 → Photo Release screen → gallery → download
- [ ] More tab: projects count correct, sync status shows last sync time
- [ ] Production tab: Shoot + Edit data persists across app kills (AsyncStorage keys ava_shoot_pre_v1, ava_shoot_day_v1, ava_edit_v1)
- [ ] OTP sign-in: magic link tapped from email routes to auth/callback and lands on correct screen
- [ ] Delete account: both operator and attendee accounts can be deleted and re-created cleanly
- [ ] ScrollableTabBar scrolls horizontally on small screens; active tab auto-scrolls into view
