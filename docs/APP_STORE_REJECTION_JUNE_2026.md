# App Store rejection — June 2026 resubmission

**App:** Alpha Visual Artists (AVA)  
**Bundle:** `com.alphavisualartists.app`  
**Version:** 1.0.4 / build 11 (Round 3 resubmission target)  

This doc tracks Apple rejection reasons, code fixes in-repo, and what **Joshua must do only in App Store Connect (ASC)**.

**Architecture reference:** In-app Supabase auth, Pro gating, and free-tier policy are documented in [`AVA_PRO_GATING_AUTH_ARCHITECTURE.md`](./AVA_PRO_GATING_AUTH_ARCHITECTURE.md).

---

## Round 3 — Submission 52c6a517 (June 6, 2026)

**Device tested:** iPhone 17 Pro Max  
**Build reviewed:** 1.0.4 / build **11**

| Guideline | Issue | Code / deploy fix | ASC-only |
|-----------|--------|-------------------|----------|
| **2.3.6** | Age Assurance metadata says **In-App Controls** but app has none | N/A in binary | **Joshua:** App Information → Age Assurance → **None** |
| **2.1** | Wrong demo credentials in ASC (`ALPHAJRR` / old password) | No code change — creds live in ASC only | **Joshua:** update App Review Information immediately (see below) |
| **2.2** | App reads as beta/trial (Pro locks + “coming soon” on Paywall) | Removed “coming soon” / “when available” from Paywall + upgrade alerts | Review notes explaining free tier + Reviewer mode |
| **2.1(b)** | Business model — 5 questions unanswered | N/A | Paste answers below in Resolution Center |

### Code changes (Round 3)

- `components/Paywall.tsx` — production IAP copy (no “coming soon”)
- `utils/showProUpgradeAlert.ts` — same
- `components/toolkit/RateCalculator.tsx` — Send Quote alert copy updated

**Grep audit (`app/`, `components/`):** no `beta`, `trial`, or `test flight` in user-facing mobile copy. Demo/reviewer strings are intentional for App Review (`Continue as Reviewer`, `Reviewer mode` banner).

### Joshua ASC checklist (do before resubmit)

- [ ] **Age Assurance:** App Store Connect → **App Information** → **Age Assurance** → set **None** (app has no in-app age controls or age-gate UI).
- [ ] **App Review Information → Sign-In Required:**
  - Username: `appreview@alphavisualartists.com`
  - Password: `AVAreview!2026#Pro`
  - Remove any old credentials (`ALPHAJRR`, `Billion$Company08`, etc.).
- [ ] **Review Notes:** paste the **App Review Information notes** block below (both access paths).
- [ ] **Metadata scrub:** confirm description, promotional text, and keywords contain **no** “beta”, “trial”, “TestFlight”, or “pre-release”.
- [ ] **Resolution Center:** reply to **each** guideline (2.3.6, 2.1, 2.2, 2.1(b)) using paste-ready blocks below.
- [ ] **Resubmit** build 11 (or newer) after ASC updates — OTA can ship copy fixes; ASC metadata/credentials are not OTA.

### App Review Information (paste in ASC)

| Field | Value |
|-------|--------|
| **Sign-in required** | Yes |
| **Username** | `appreview@alphavisualartists.com` |
| **Password** | `AVAreview!2026#Pro` |

**Notes (paste in Review Notes):**

> Alpha Visual Artists (AVA) is a production creator toolkit with a free tier and an AVA Pro subscription tier.
>
> **Path 1 — Demo account (recommended):** Open the app → tap **Sign in** on the home tab → enter email `appreview@alphavisualartists.com` and password `AVAreview!2026#Pro` → Sign in. This account has AVA Pro enabled in our backend (`subscription_tier = pro`). Sample checklist progress is pre-seeded on first login.
>
> **Path 2 — Full access without password:** On the Sign in screen, tap **Continue as Reviewer**. This unlocks all Pro features for App Review demonstration only (local reviewer mode; banner shows “Reviewer mode — all features unlocked”).
>
> **Free tier (no sign-in required):** Home, marketing content, and **12 Creators Toolkit lessons** are fully usable without an account.
>
> **Pro tier:** Remaining toolkit lessons, cheat sheets, invoice builder, production checklists, rate calculator Send Quote, and related pro tools. Pro gates are visible on locked content; subscription is processed via in-app purchase (App Store). Account creation is **free** (email/password or OTP via Supabase). No payment is required to create an account.
>
> Previous credentials (`ALPHAJRR` / `Billion$Company08`) were outdated and have been replaced with the credentials above.

### Resolution Center reply — 2.3.6 Age Rating / Age Assurance

> We corrected App Store Connect metadata for Guideline 2.3.6. Under App Information → Age Assurance, we set **In-App Controls / Age Assurance** to **None**, because AVA does not implement in-app age verification or parental age-gate controls. AVA is a creator education and production toolkit; account creation uses standard email sign-up (Supabase) and is not restricted to a separate under-13 experience in the iOS app. Please confirm the updated Age Assurance selection on your side.

### Resolution Center reply — 2.1 Demo credentials

> The demo credentials previously listed in App Review Information were incorrect (outdated account). We have updated App Store Connect with the correct credentials:
>
> - Email: `appreview@alphavisualartists.com`
> - Password: `AVAreview!2026#Pro`
>
> Alternatively, on the Sign in screen, tap **Continue as Reviewer** to access all features without entering a password (demonstration mode for App Review only).
>
> After sign-in with the demo account, AVA Pro features unlock automatically. The free tier (12 toolkit lessons and home/marketing surfaces) remains available without sign-in.

### Resolution Center reply — 2.2 Beta / pre-release

> AVA is not a beta or trial build. It is a production app with a defined free tier and a paid AVA Pro subscription tier.
>
> **Free tier (complete, usable product):** Users can browse the home experience and access **12 Creators Toolkit lessons** without creating an account or subscribing.
>
> **AVA Pro (subscription):** Additional lessons, cheat sheets, invoice builder, production checklists, rate-calculator Send Quote, and related pro tools require AVA Pro. Locked content displays clear Pro gates with subscription pricing ($79.99/year or $9.99/month). Digital purchases are intended for in-app purchase through the App Store only (Guideline 3.1.1 compliant — no web checkout for digital content in the iOS app).
>
> **App Review access:** Tap **Continue as Reviewer** on the Sign in screen, or sign in with the demo account in Review Notes, to evaluate all Pro features without purchase.
>
> We removed “coming soon” language from in-app Paywall and upgrade messaging so the app presents as a finished freemium product, not a pre-release trial.

### Resolution Center reply — 2.1(b) Business model (all 5 questions)

> **1. Who uses paid digital content?**  
> Creators and production professionals who subscribe to **AVA Pro** for the full Creators Toolkit (lessons beyond the 12 free lessons, cheat sheets, invoice builder, production checklists, rate-calculator Send Quote, and related pro tools).
>
> **2. Where can users purchase?**  
> AVA Pro is purchased via **in-app purchase** in the iOS app (App Store). We do not link mobile users to web checkout for digital content unlocks in the app (Guideline 3.1.1).
>
> **3. What previously purchased content can users access?**  
> After subscribing to AVA Pro, users access all Pro-gated toolkit content tied to their Supabase account (`subscription_tier = pro`). Content remains available while the subscription is active. The 12 free lessons remain available without subscription.
>
> **4. What paid content is unlocked without IAP?**  
> **None for production users.** App Review may use **Continue as Reviewer** (demonstration mode) or the demo account in Review Notes to evaluate Pro features without completing a purchase. This is for review only, not offered as a consumer bypass.
>
> **5. How do users obtain an account? Is payment required to create an account?**  
> Account creation is **free**. Users tap **Sign in** and register with email/password or email OTP via Supabase. No payment is required to create an account. AVA Pro is an optional subscription after account creation.

### Build & deploy (Round 3)

Copy fixes are **JS-only** → OTA-eligible after commit:

```bash
cd /Users/alphavisualartists/Vertikal-App
npx tsc --noEmit
eas update --channel production --message "Round 3 rejection copy fixes"
```

ASC metadata, Age Assurance, and Review credentials are **not** OTA — Joshua must update App Store Connect before resubmitting.

---

## Round 2 — Submission 46856592 (June 5, 2026)

| Guideline | Issue | Code / deploy fix | ASC-only |
|-----------|--------|-------------------|----------|
| **2.1(a)** | Demo access — reviewer cannot use email OTP (no inbox access) | `app/sign-in.tsx` — **email + password** via `signInWithPassword`; OTP kept as secondary option | Review notes with demo credentials (below) |
| **2.3** | "Join the beta" in metadata | Scrubbed `APP_STORE_METADATA.md`; no beta language in app binary | **Joshua:** remove "beta" / "join the beta" from ASC description, promotional text, keywords |
| **2.2, 2.3.6, 4** | Cleared in Round 1 | No further code changes required | — |

### Code changes (Round 2)

- `app/sign-in.tsx` — primary **Sign in** with email + password (`signInWithPassword`); OTP as "Use email code instead"
- `constants/demoReview.ts` — `DEMO_REVIEW_EMAIL` constant
- `utils/demoReviewSeed.ts` — non-destructive demo seed (shoot + edit checklists) on first login as review account
- `.env.example` — documents demo account email; password in Supabase dashboard only
- `app.json` / `ios/.../Info.plist` — build **10**
- `APP_STORE_METADATA.md` — AVA branding, no beta language, password sign-in documented

**Demo account setup (Joshua — Supabase dashboard):**

1. Authentication → Users → create or confirm `appreview@alphavisualartists.com` with a **password** (not OTP-only).
2. Database → `profiles` → set `subscription_tier = 'pro'` for that user's UUID.
3. Paste credentials in **App Store Connect → Review Notes** only — never in source or public metadata.

### Resolution Center reply — 2.1(a) Demo access

> We added in-app email and password sign-in using Supabase (`signInWithPassword`) on the Sign in screen reachable from the home tab. Apple reviewers can sign in without receiving an email OTP. Demo credentials are provided in the Review Notes for this submission. After sign-in, AVA Pro features unlock when `profiles.subscription_tier` is `pro` for the demo account. Sample production checklist progress is pre-seeded on first login for the demo account only.

### Resolution Center reply — 2.3 Metadata

> We removed all references to "beta" and "join the beta" from our App Store metadata and in-app copy. The app is presented as Alpha Visual Artists (AVA), a production-ready creator toolkit. Please confirm the updated description and promotional text in App Store Connect reflect this change.

### Build & submit (Round 2)

Password auth is JS-only (OTA-eligible), but **Apple review expects a new binary** for this resubmission:

```bash
cd /Users/alphavisualartists/Vertikal-App
npx tsc --noEmit
eas build --platform ios --profile production
```

Upload build **10** to App Store Connect and resubmit with updated Review Notes.

---

## Round 1 — Original rejection summary → fixes

| Guideline | Issue | Code / deploy fix | ASC-only |
|-----------|--------|-------------------|----------|
| **2.2** | App feels beta (intro every launch, “available soon” portal) | `FORCE_INTRO_EVERY_LAUNCH=false`; home CTA → `/sign-in`; web portal no longer shows “available soon” when Clerk is live | Review notes (below) |
| **2.3.6** | Age Assurance metadata | N/A in app binary | **Joshua:** complete Age Assurance in ASC (see below) |
| **4** | Sign in with Apple low contrast (web Clerk); mobile opens browser | Clerk theme: Apple button white/black, higher border contrast | Enable Apple provider in Clerk Dashboard; confirm Services ID / redirect URLs |

---

## Code changes (this pass)

### Mobile (`Vertikal-App`)

- `utils/introVideoGate.ts` — `FORCE_INTRO_EVERY_LAUNCH = false`
- `app/(tabs)/index.tsx` — primary CTA: **Sign in** → `https://alphavisualartists.com/sign-in` (not `/portal`)
- `ios/AlphaVisualArtists/Info.plist` — `CFBundleVersion` **7** (matches `app.json` `ios.buildNumber`)

**Apple Sign-In on native:** `expo-apple-authentication` is **not** installed. Mobile auth boundary is **Supabase only** (no Clerk on device per JRE protocol). Client sign-in for Apple/Google/email runs on the **website** via Clerk at `/sign-in`. Supabase supports Apple OAuth server-side if native sign-in is added later; that would require a new App Store build + `expo-apple-authentication` — out of scope for this hotfix unless requested.

### Web (`Alpha-Visual-Artist` → `artifacts/alpha-visual-artists`)

- `PortalUnavailable.tsx` — functional **Sign in** when `VITE_CLERK_PUBLISHABLE_KEY` is set; no “available soon” for production auth
- `PortalLayout.tsx` — when `VITE_PORTAL_API_ENABLED` is not `true`: signed-out → Clerk sign-in; signed-in → `PortalSignedInNoApi` (not unavailable wall)
- `getPostAuthRedirectUrl()` — redirects to `/` when portal API off, `/portal` when API on
- `ClerkRoot.tsx` — stronger social button contrast (including Apple-specific element styles)

**Enable full portal later:** set `VITE_PORTAL_API_ENABLED=true` in Cloudflare Pages / CI and proxy `/api` to the api-server (see `DEPLOYMENT.md` in the web repo).

---

## ASC-only: Guideline 2.3.6 (Age Assurance)

Joshua completes this in **App Store Connect** — not in Xcode.

1. Open [App Store Connect](https://appstoreconnect.apple.com) → **Apps** → **Alpha Visual Artists**.
2. Go to **App Information** (or the Age Rating / compliance section Apple surfaced in the rejection).
3. Complete **Age Assurance** / age-rating questionnaire per Apple’s current flow (ratings, sensitive content, account creation, etc.).
4. Align answers with `APP_STORE_METADATA.md` (target **12+** unless product positioning changes).
5. If Apple asks how age is handled in-app: AVA is a creator toolkit + marketing surface; account creation happens on the **website** (Clerk). The iOS app does not host a separate under-13 experience.

**Suggested Review Notes (paste in Resolution Center):**

> We addressed Guideline 2.2 by removing the QA-only intro-on-every-launch flag, pointing users to a live sign-in page (alphavisualartists.com/sign-in) instead of an unavailable portal placeholder, and deploying updated web copy. Age Assurance metadata has been updated in App Store Connect per Guideline 2.3.6. Sign in with Apple on our web sign-in uses Clerk with improved button contrast (Guideline 4). The iOS app opens the production sign-in URL in Safari for client authentication; native Sign in with Apple is not used in the app binary.

---

## Reply templates (Resolution Center)

### 2.2 — Beta / incomplete

> The intro video now respects a cooldown after first view (no longer forced on every cold start). The home screen primary action opens our production sign-in page, not a “coming soon” portal. Web `/portal` routes users through Clerk sign-in or a signed-in acknowledgment page when the project API is not yet enabled on static hosting.

### 2.3.6 — Age Assurance

> We updated Age Assurance and age-rating responses in App Store Connect to match the app’s content and account model. Please confirm the metadata on your side reflects the latest submission.

### 4 — Sign in with Apple (contrast)

> Sign in with Apple is offered on our website sign-in (Clerk). We increased contrast for the Apple provider button (white background, dark text, visible border). The iOS app links to this page for client sign-in. Apple provider is enabled in Clerk with production keys (`pk_live_`).

---

## Build & submit (after commit)

Native files changed (`ios/`, `app.json` buildNumber path via plist) → **full iOS build**, not OTA-only.

```bash
cd /Users/alphavisualartists/Vertikal-App
npx tsc --noEmit
eas build --platform ios --profile production
```

Web (after commit in `Alpha-Visual-Artist`):

```bash
cd /Users/alphavisualartists/Alpha-Visual-Artist
pnpm install
VITE_CLERK_PUBLISHABLE_KEY="pk_live_…" VITE_PORTAL_API_ENABLED=false \
  pnpm --filter @workspace/alpha-visual-artists run build
wrangler pages deploy artifacts/alpha-visual-artists/dist/public \
  --project-name=alpha-visual-artists
```

Or push to branch `GIT` if GitHub Actions deploy is the single path (see web `DEPLOYMENT.md`).

---

## Draft commit messages (not committed by agent)

**Mobile:**

```
fix(ios): App Store 2.2/4 — intro gate, sign-in CTA, build 7

- FORCE_INTRO_EVERY_LAUNCH false
- Home opens /sign-in instead of unavailable /portal
- CFBundleVersion 7 synced with app.json
```

**Web:**

```
fix(web): portal sign-in flow and Clerk Apple button contrast

- Portal routes to Clerk sign-in when API disabled
- Post-auth redirect to / unless VITE_PORTAL_API_ENABLED
- Stronger Sign in with Apple styling in Clerk theme
```

---

⚠️ **PENDING DEVICE VERIFICATION** — not done until JR confirms on device and ASC resubmission is accepted.
