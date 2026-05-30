# Pre-launch system check — VERTIKAL & AVA (App Store)

**Date:** February 6, 2025  
**Goal:** Full system check for both apps before tonight’s App Store launch.  
**Developer account:** Set ([App Store Connect](https://appstoreconnect.apple.com/apps)).

---

## 1. Two apps in this repo

| App | Type | Bundle ID | How it ships to App Store |
|-----|------|-----------|----------------------------|
| **VERTIKAL** | Expo (React Native) | `com.vertikal.app` | EAS Build → `eas submit --platform ios` |
| **AVA (Alpha Visual Artists)** | Capacitor (WebView) | `com.alphavisualartists.app` | Xcode Archive from `ios/` → Upload to App Store Connect |

---

## 2. VERTIKAL — What’s active vs what needs work

### Active / configured

- **App entry:** `App.tsx` — VERTIKAL brand UI, tabs (Feed, Profile, Jobs, How You Earn), ProfileGate, Daunt/danmaku.
- **app.json:** name `VERTIKAL`, slug `vertikal-mobile`, version `1.0.0`, iOS bundle `com.vertikal.app`, EAS project ID set.
- **EAS:** `eas.json` production profile with:
  - `EXPO_PUBLIC_API_URL=https://api.vertikal.com`
  - `EXPO_PUBLIC_SENTRY_DSN` from build-time env
  - Submit section uses `${APPLE_ID}`, `${ASC_APP_ID}`, `${APPLE_TEAM_ID}`.
- **Auth/data:** Supabase in `.env` (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`). `services/api.ts` and `backendClient` use `EXPO_PUBLIC_API_URL` for backend API.
- **Sentry:** `utils/sentry.ts` — initializes when `EXPO_PUBLIC_SENTRY_DSN` is set (EAS production injects it).
- **Backend:** `backend/` (Node, Prisma) — shows, users, auth, comments, etc. Production must be deployed at **https://api.vertikal.com** for the production app to work.
- **Privacy/Terms (web):** `public/privacy/index.html`, `public/terms/index.html` (vertikalapp.com). App Store Connect should use live URLs, e.g. `https://vertikalapp.com/privacy`, `https://vertikalapp.com/terms`.

### Needs work / verify before launch

1. **Production API**
   - Confirm **https://api.vertikal.com** is deployed and healthy (same code as `backend/`).
   - If API is elsewhere, update `eas.json` → `build.production.env.EXPO_PUBLIC_API_URL`.

2. **EAS env for build/submit**
   - For `eas build --platform ios --profile production`: ensure `EXPO_PUBLIC_SENTRY_DSN` is set (e.g. in EAS secrets or local env when you run the command).
   - For `eas submit`: set `APPLE_ID`, `ASC_APP_ID`, `APPLE_TEAM_ID` (or use EAS credentials so submit can resolve them).

3. **EAS credentials (if not done)**
   - Run once per platform if needed:
     - `eas credentials:configure-build --platform ios`
     - `eas credentials:configure-build --platform android`

4. **App Store Connect — VERTIKAL**
   - Create app with bundle ID **com.vertikal.app** (must match app.json).
   - Set Privacy Policy URL: `https://vertikalapp.com/privacy` (or your live URL).
   - Set Terms / Support URL as required.
   - Add screenshots, description, keywords, age rating, pricing.
   - Support email (e.g. support@vertikalapp.com) — ensure it’s valid.

5. **Submission readiness (from SUBMISSION_READINESS_GATE_PROTOCOL.md)**
   - Feed and content: seeded shows/episodes, no empty feed for first launch.
   - Playback: at least a few videos play correctly.
   - No app crash on launch; auth and API calls work against production API.

---

## 3. AVA (Alpha Visual Artists) — What’s active vs what needs work

### Active / configured

- **Capacitor:** `capacitor.config.ts` — appId `com.alphavisualartists.app`, loads **https://alphavisualartists.com** (live URL). No local `dist` needed for content.
- **iOS project:** `ios/App/` — Bundle ID `com.alphavisualartists.app`, Display Name “Alpha Visual Artists”, Version 1.0, Build 1. Info.plist: camera/photo usage strings, URL scheme `alphavisualartists`, `ITSAppUsesNonExemptEncryption` false.
- **Docs:** `docs/AVA_MEDIA_IOS_APP_STORE_SETUP.md`, `AVA_MEDIA_IOS_DEPLOYMENT_GUIDE.md` — Xcode steps, icons, splash, submission.

### Needs work / verify before launch

1. **Live site**
   - Confirm **https://alphavisualartists.com** loads correctly and works in a browser (all key flows: home, services, contact, etc.).

2. **Privacy & terms on live site**
   - Apple requires working Privacy Policy and optionally Terms.
   - Confirm:
     - **https://alphavisualartists.com/privacy**
     - **https://alphavisualartists.com/terms**
   - (Repo has `public/privacy.html`, `public/terms.html` — ensure they’re deployed to that domain/paths.)

3. **External links (payments/booking)**
   - App must not process payments inside the WebView. Links to Calendly, Stripe, Shopify, etc. should open in Safari.
   - If not already on the live site, add the script from `docs/AVA_MEDIA_IOS_APP_STORE_SETUP.md` (or use `public/assets/js/ava-capacitor-external-links.js`) so that in-app, those links open via `@capacitor/browser`.

4. **Xcode**
   - Open: `npm run open:ios` (or open `ios/App/App.xcworkspace`).
   - Signing: “Automatically manage signing”, select your Team, Bundle ID `com.alphavisualartists.app`.
   - Version/Build: e.g. Version 1.0, Build 1 (increment Build for each upload).
   - Icons: 1024×1024 App Store icon in `ios/App/App/Assets.xcassets/AppIcon.appiconset/` (replace placeholder if needed).
   - Archive: Product → Destination “Any iOS Device (arm64)” → Product → Archive → Distribute App → App Store Connect.

5. **App Store Connect — AVA**
   - Create app with bundle ID **com.alphavisualartists.app**.
   - Privacy Policy URL: `https://alphavisualartists.com/privacy`.
   - Terms / Support URL as required; support email (e.g. support@alphavisualartists.com).
   - Screenshots, description, keywords, age rating, pricing.

---

## 4. Tonight launch checklist (both apps)

### VERTIKAL

- [ ] Production API at **https://api.vertikal.com** is up and returns data (e.g. `/api/shows`).
- [ ] `.env` or EAS: Supabase vars present; for production build, `EXPO_PUBLIC_SENTRY_DSN` set.
- [ ] App Store Connect app created for **com.vertikal.app**; privacy/terms/support URLs and metadata filled.
- [ ] `eas build --platform ios --profile production` succeeds.
- [ ] Install build on device/simulator; confirm feed loads, playback works, no crash on launch.
- [ ] `eas submit --platform ios --profile production` (with credentials/ASC app ID) or upload IPA from EAS to App Store Connect.
- [ ] Submit for review in App Store Connect.

### AVA

- [ ] **https://alphavisualartists.com** and **/privacy**, **/terms** load correctly.
- [ ] External payment/booking links open in Safari from the app (script on live site if needed).
- [ ] App Store Connect app created for **com.alphavisualartists.app**; privacy/terms/support URLs and metadata filled.
- [ ] Xcode: signing, version, 1024×1024 icon; Archive and upload to App Store Connect.
- [ ] Submit for review in App Store Connect.

### Shared

- [ ] Apple Developer account and App Store Connect access confirmed.
- [ ] No placeholder or test-only content in store listing or in-app for first public build.
- [ ] Support emails (e.g. support@vertikalapp.com, support@alphavisualartists.com) work.

---

## 5. Quick reference

| Item | VERTIKAL | AVA |
|------|----------|-----|
| Bundle ID | com.vertikal.app | com.alphavisualartists.app |
| Build command | `eas build --platform ios --profile production` | Open Xcode → Archive |
| Submit | `eas submit` or upload from EAS | Xcode Organizer → Distribute |
| Content source | Backend API (api.vertikal.com) + Supabase | Live site (alphavisualartists.com) |
| Privacy URL | vertikalapp.com/privacy | alphavisualartists.com/privacy |

---

## 6. Critical blockers (do not launch with these)

- VERTIKAL: Production API down or wrong URL in EAS → app will show no content or errors.
- VERTIKAL: Missing `EXPO_PUBLIC_SENTRY_DSN` in production build → optional but recommended for launch.
- AVA: Privacy or terms URL returns 404 → Apple may reject.
- AVA: Payments or booking inside in-app WebView → App Store compliance risk; must open in Safari.
- Either app: Wrong bundle ID in App Store Connect vs app → upload or submission will fail.
- Either app: App crashes on launch or feed/site doesn’t load → fix before submit.

---

**Status:** Use this doc as the single pre-launch system check for both VERTIKAL and AVA. Complete the “Tonight launch checklist” and resolve any “Needs work” items before submitting for review.
