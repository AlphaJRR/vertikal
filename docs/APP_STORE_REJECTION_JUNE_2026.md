# App Store rejection — June 2026 resubmission

**App:** Alpha Visual Artists (AVA)  
**Bundle:** `com.alphavisualartists.app`  
**Version:** 1.0.4 / build 10  

This doc tracks Apple rejection reasons, code fixes in-repo, and what **Joshua must do only in App Store Connect (ASC)**.

**Architecture reference:** In-app Supabase auth, Pro gating, and free-tier policy are documented in [`AVA_PRO_GATING_AUTH_ARCHITECTURE.md`](./AVA_PRO_GATING_AUTH_ARCHITECTURE.md).

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
