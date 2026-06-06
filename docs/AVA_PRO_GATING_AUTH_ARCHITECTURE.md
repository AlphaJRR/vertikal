# AVA Pro Gating & In-App Auth Architecture

**App:** Alpha Visual Artists (AVA) — canonical Expo mobile app  
**Repo path:** `/Users/alphavisualartists/Vertikal-App`  
**Owner:** Joshua Roberts (JRE)  
**Status:** Approved direction — P0 implemented (June 4, 2026); P1 IAP pending  
**Last updated:** June 4, 2026  
**Companion doc:** [`docs/APP_STORE_REJECTION_JUNE_2026.md`](./APP_STORE_REJECTION_JUNE_2026.md)

> **Prime directive:** Non-destructive. Extend and harden Cursor's in-progress Tools-tab locks; do **not** redesign from scratch, do **not** add Clerk to mobile, do **not** touch `data/toolkitCurriculum.ts` or duplicate lesson architecture. Nothing is "done" without verification on a physical iPhone.

---

## 0. Verified architecture (do not contradict without re-auditing)

| Layer | Reality today (June 4, 2026) |
|---|---|
| Mobile auth | `lib/supabase.ts` (`persistSession: true`); **`app/sign-in.tsx`** — `signInWithOtp` → `verifyOtp`; **`contexts/AuthContext.tsx`** wraps `supabase.auth.onAuthStateChange`. No Clerk in mobile. |
| Home Sign in | **`router.push('/sign-in')`** in `app/(tabs)/index.tsx` — in-app OTP, not `WebBrowser` to web Clerk. Signed-in shell shows email + Sign out. |
| Pro check | `hooks/useAvaPro.ts` → tri-state `loading \| free \| pro` from `profiles.subscription_tier === "pro"`. Never `pro` on error; null profile → `free`. |
| Pro gating | **`constants/proAccess.ts`** — single source of truth. **12 free lessons (2 per tab)** (conversion policy). Tools-tab lock UI (`app/(tabs)/tools.tsx`, `CreatorTraining.tsx`); route guards in `app/lesson/[id].tsx`, `app/cheatsheet/[id].tsx`, `app/slide/[id].tsx`; shared **`components/Paywall.tsx`**. Rate Calculator: use free, Send Quote Pro-only. |
| Shoot/Edit | AsyncStorage single global checklist per tab (`ava_shoot_*`, `ava_edit_v1`). Not multi-project. |
| Media | `expo-image-picker` (invoice logo), `expo-media-library` (wallpaper save only). |
| Deploy | P0 auth + gating shipped via **companion OTA updates** on production channel (JS-only; no native module changes in this pass). |

---

## A. Recommended P0 architecture (one paragraph)

Keep the Supabase-only boundary and make sign-in **honest and in-app using Supabase email OTP** (6-digit code): `signInWithOtp` → `verifyOtp`. No Clerk, no native module, no deep link — so it ships by **OTA** and produces a real persisted Supabase session that drives a real signed-in shell (email + Sign out). Email OTP alone does **not** trigger Guideline 4.8 (Sign in with Apple is only required once you add a *social* login). Pro entitlement stays a **read-only client check** via the existing `useAvaPro → profiles.subscription_tier`, hardened to a tri-state (`loading | free | pro`) that **defaults to locked on error**. All gating centralizes in `constants/proAccess.ts` (free-lesson allow-list + tool flags), consumed by **both** Cursor's Tools-tab lock UI **and** the `lesson/[id]` route guard so locks can't be bypassed by deep link. Purchasing is deferred to P1 as **Apple IAP via RevenueCat → Supabase webhook** (not a web Stripe link, per Guideline 3.1.1).

### Options ranked (free sign-in + Pro unlock without a Clerk↔Supabase hack)

1. **(P0) Supabase email OTP in-app + IAP entitlement in P1.** Real session, OTA-able, review-safe, no identity bridge. Mobile Pro is written to the *Supabase* user's profile by Apple IAP; web subscriptions stay on web.
2. **Supabase native Apple Sign In** (`expo-apple-authentication` → `signInWithIdToken`). Cleaner UX but **native module = new build**, and opts back into full SIWA design rules. Add post-launch as a nicety, not P0.
3. **Stripe (web) → webhook → `profiles.subscription_tier`.** Fine for *web* entitlement only. On mobile it forces a Clerk↔Supabase email join (the hack to avoid) **and** can't legally unlock in-app digital content via a web purchase (3.1.1).
4. **(Last) Deep-link token bridge from web.** Brittle, needs a custom exchange endpoint, still hits 3.1.1. Avoid.

### Least-destructive migration ("browser-only sign-in" → "session in app")

- Add `app/sign-in.tsx` (email + OTP entry). ✅
- Add `contexts/AuthContext.tsx` over `supabase.auth.onAuthStateChange`. ✅
- **Replace** the single `WebBrowser.openBrowserAsync('.../sign-in')` call in `app/(tabs)/index.tsx` with `router.push('/sign-in')`. ✅
- Keep the web URL only as an optional "manage account on web" link.
- No data migration. No Clerk in mobile.

---

## B. Implementation plan (phased) — ordered task list

> **Sequencing note:** P0 landed as JS-only OTA after build 7 rejection fixes. Confirm no native diffs before future `eas update`.

### P0 — launch-safe (OTA-eligible unless noted)

| # | File | Change | Destructive? | Status |
|---|---|---|---|---|
| 1 | `constants/proAccess.ts` | **NEW.** `FREE_LESSON_IDS` allow-list (12 ids, 2 per tab); `isLessonFree(id)`; tool flags. | No | ✅ Implemented |
| 2 | `hooks/useAvaPro.ts` | Tri-state `{ status: 'loading'\|'free'\|'pro', isPro, isSignedIn, userEmail }`. Never `pro` on error; null profile → `free`. | No (additive) | ✅ Implemented |
| 3 | `contexts/AuthContext.tsx` | **NEW.** Wrap `supabase.auth` session + `onAuthStateChange`; expose `session`, `user`, `signOut`. | No | ✅ Implemented |
| 4 | `app/sign-in.tsx` | **NEW.** Email → `signInWithOtp` → code entry → `verifyOtp`. Full-opacity buttons. | No | ✅ Implemented |
| 5 | `app/(tabs)/index.tsx` | Swap browser sign-in for `router.push('/sign-in')`; signed-in affordance (email + Sign out) in header. | No (one call-site) | ✅ Implemented |
| 6 | `app/lesson/[id].tsx` | **Route guard.** `!isLessonFree(id) && !isPro → <Paywall/>`; else content. **Deep-link bypass fix.** | No (gate before existing render) | ✅ Implemented |
| 7 | `components/toolkit/CreatorTraining.tsx` + Tools components | Lock rendering via `isLessonProLocked` / `useAvaPro` from `proAccess`. | No | ✅ Implemented |
| 8 | `components/Paywall.tsx` | **NEW / shared** lock CTA. Explains AVA Pro until IAP exists; Sign in → `/sign-in`. | No | ✅ Implemented |
| 9 | `components/toolkit/RateCalculator.tsx` | Send Quote gate via `useAvaPro` + `isRateCalculatorQuoteProLocked()`. | No | ✅ Implemented |

### P1 — entitlement (**new build required** — native module)

| # | File | Change | Destructive? | Status |
|---|---|---|---|---|
| 10 | `react-native-purchases` + `app.json` / `ios/` | Install RevenueCat; set `appUserID = supabase auth user id` on login. | No to data; needs `eas build` | ⏳ Pending |
| 11 | Supabase Edge Function `revenuecat-webhook` | Verify webhook; `update profiles set subscription_tier='pro'` by `app_user_id`. | No | ⏳ Pending |
| 12 | `components/Paywall.tsx` | `Purchases.purchasePackage(...)` + **Restore Purchases** (Apple-required). | No | ⏳ Pending |

### P2 — projects/shoots + photo notes

| # | File | Change | Destructive? | Status |
|---|---|---|---|---|
| 13 | `projects` table or local-first keyed by project id | Migrate existing `ava_shoot_*` / `ava_edit_v1` into a "Default" project; keep old keys readable. | No (read-migrate, don't delete) | ⏳ Pending |
| 14 | Photo attachments | `expo-image-picker` (Photo Library) + `expo-sharing` (share sheet). No camera-maker SDKs. | No (build if picker scope expands) | ⏳ Pending |

---

## C. Pro gating policy (active rule + rationale)

**Active policy (June 4, 2026):** **Allow-list exactly 12 foundational lessons** — two per Creators Toolkit tab — in `constants/proAccess.ts`. **Invoice Builder is free.** Everything else (96 lessons), all cheat sheets, production checklists, and pro-only tools (presets, Sony shortcuts, shoot calc, Send Quote) require AVA Pro. Implement as an explicit id allow-list — do **not** gate by raw index (index math breaks when lesson order changes).

**Free lesson ids (canonical):**

| Tab | Lesson ids |
|---|---|
| Camera | `camera-iso`, `camera-aperture` |
| Framing | `framing-rule-of-thirds`, `framing-leading-lines` |
| Lighting | `lighting-three-point`, `lighting-natural-light` |
| Editing | `editing-resolve-interface`, `editing-project-setup` |
| Strategy | `strategy-reels`, `strategy-tiktok` |
| Production | `production-director`, `production-dp` |

**Rationale — two tiers, one active choice:**

- **Original doc recommendation (~25 lessons, ≥1 foundational per tab):** Optimized for **App Review (Guideline 2.2)** — a free, signed-in user sees enough usable content that the app doesn't read as a trial shell. More free lessons reduce re-rejection risk when reviewers sign in.
- **Joshua's conversion decision (6 lessons, June 4 AM):** Optimized for **IAP conversion** — free tier delivers *taste*, not the course. One strong lesson per track proves quality; the paywall lands when users want depth.
- **Active policy = 12 (2 per tab) + Invoice Builder free.** Evolved from 6 → 12 after free tier felt too locked — still conversion-balanced (12 free / 96 pro), not the full course. Invoice Builder unlocked OTA to give creators a tangible free utility. Cheat sheets, Send Quote, and other pro tools remain Pro-only. If App Review still pushes back, revisit expanding toward ~25 in `proAccess.ts` only (no curriculum changes).

**Tool flags (implemented):**

| Tool / feature | Free | Pro |
|---|---|---|
| Rate Calculator (browse + calculate) | ✅ | |
| Rate Calculator — Send Quote / export | | ✅ |
| Creator Training (browse) | ✅ | |
| Invoice builder | ✅ | |
| Lessons beyond 12 ids | | ✅ |
| Cheat sheets (all) | | ✅ |
| Production checklists | | ✅ |
| Presets, Sony shortcuts, shoot calc, etc. | | ✅ |

---

## D. Debug / test checklist

- **No session:** Tools show visible locks; `lesson/[id]` deep link → paywall; no "signed in" UI; Sign in opens in-app `/sign-in`.
- **Free signed-in:** session exists, `subscription_tier='free'` → locks visible; header shows email + Sign out; Pro lessons → paywall (incl. deep link).
- **Pro signed-in:** all lessons/tools unlocked; Send Quote works; no lock flash after load resolves.
- **`getUser()` / profile fetch fails (airplane mode mid-call):** show `loading` → fall back to **locked**, never unlocked; surface "couldn't verify subscription — retry" so a real Pro user isn't stranded. Confirm **no path defaults to `pro`**.
- **Offline Tools tab (Pro, previously verified):** honor cached `pro` for a short grace TTL. Cache **only verified pro**, never `free → pro`. Offline free user → still locked.
- **Deep-link bypass:** `yourscheme://lesson/<proId>` while free → paywall, not content.
- **OTA vs binary:** P0 = JS-only → `eas update --channel production`. RevenueCat / Apple Sign-In → `eas build`.
- **Sign out:** `supabase.auth.signOut()` clears session, locks reappear, header reverts to Sign in.
- **New OTP user:** `profiles` row auto-created `subscription_tier='free'`; brief null-profile window handled as `free`, not crash.

### How to verify locks without false positives when `getUser()` fails

Treat the gate as tri-state, not boolean. `isPro` must be **derived** from `status === 'pro'` only. Default render while `status === 'loading'` is a skeleton (not content, not an error). On fetch error → `status` stays/falls to `free` (locked) with a retry affordance. A boolean that defaults `true` on error is the classic false-positive that leaks Pro content — never do `const isPro = profile?.subscription_tier !== 'free'`.

---

## E. Risks

- **Biggest:** UI-locks only, while `app/lesson/[id].tsx` stays routable → free users (or testers with the scheme) reach Pro lessons by deep link; locks are theater. **Guard = Task #6.** ✅ Route guard shipped.
- **Content extraction:** bundled lesson *text* is extractable regardless of client gating. Client gating is acceptable for text; serve premium **media** from authorized URLs, not shipped in the binary.
- **Error-state leak:** any boolean Pro check that defaults open on failure unlocks everything offline/on error. Mitigated by tri-state + locked default.
- **Compliance (3.1.1):** selling the in-app unlock via an external web link risks rejection. Default to native IAP. External-link rules shifted post-2025 Epic injunction and are jurisdiction-specific — verify current ASC policy before relying on any link-out.

---

## F. Conflicts with Cursor (resolve before parallel work)

- **Single source of truth for "what's free."** If Cursor hardcodes the free list or scatters `subscription_tier === 'pro'` inside Tools components, it duplicates/fights `constants/proAccess.ts`. **Resolution:** Claude/Joshua own `proAccess.ts`; Cursor's lock UI *consumes* `isLessonFree()` + `useAvaPro()` and owns visuals. ✅
- **One Pro hook.** Extend `useAvaPro` to tri-state — do **not** add a parallel `useSubscription`. Align on the `status` field name before either ships. ✅
- **Don't redesign the lock component** — extend/harden only. Claude owns the *rule + route guard*; Cursor owns the *Tools-tab lock UI*. ✅
- **Merge hazard:** `useAvaPro.ts` is touched by both. **Land the tri-state refactor first, notify Cursor, then have components adopt it.** No simultaneous edits.

Legacy import path: `constants/toolkitProGating.ts` re-exports from `proAccess.ts` — prefer direct `proAccess` imports in new code.

---

## G. What Joshua must do manually

- **Supabase dashboard:** enable Email auth + OTP; **edit the email template to send `{{ .Token }}`** (numeric OTP, not magic link) so P0 stays deep-link-free; add `handle_new_user` trigger to insert a `profiles` row (`subscription_tier` default `'free'`); confirm RLS allows a user to read their own profile row.
- **App Store Connect:** finish the rejection (Age Rating → **Age Assurance / In-App Controls = None**; attach production build under **Distribution**; resubmit + reply). Create **AVA Pro** auto-renewable subscription ($9.99/mo, $40/year founding) in a subscription group for P1.
- **RevenueCat (P1):** create project; add ASC shared secret + products; define `pro` entitlement; configure webhook → Supabase Edge Function URL with a shared-secret header.
- **Stripe / web Clerk (separate):** keep web Pro on web; do **not** wire Stripe to mobile entitlement. Swap `pk_test` → `pk_live` in web `ClerkRoot.tsx` before web launch (web-only).

---

## Reference patterns (for Cursor — adapt to repo conventions)

> Illustrative, not drop-in. Reflects **implemented** `proAccess.ts` as of June 4, 2026.

```ts
// constants/proAccess.ts  (single source of truth)
/** Two foundational lessons per tab — conversion policy (active = 12, not 6, not ~25). */
const FREE_LESSON_IDS_LIST = [
  "camera-iso",
  "camera-aperture",
  "framing-rule-of-thirds",
  "framing-leading-lines",
  "lighting-three-point",
  "lighting-natural-light",
  "editing-resolve-interface",
  "editing-project-setup",
  "strategy-reels",
  "strategy-tiktok",
  "production-director",
  "production-dp",
] as const;

export function isLessonFree(lessonId: string): boolean {
  return FREE_LESSON_IDS.has(lessonId);
}

export function isToolProLocked(toolId: ToolkitMenuId): boolean {
  return !FREE_TOOL_IDS.has(toolId); // rate-calculator + training + invoice free
}
```

```ts
// hooks/useAvaPro.ts  (tri-state, locked-on-error)
// status === 'pro' is the ONLY thing that unlocks. Error/null -> 'free'.
const isPro = status === "pro";
// Do NOT: const isPro = profile?.subscription_tier !== 'free'  // leaks on error
```

```tsx
// app/lesson/[id].tsx  (route guard — deep-link bypass fix)
const { status, isPro, isSignedIn } = useAvaPro();
const locked = !isPro && isLessonProLocked(lesson.id);
if (locked) {
  return <Paywall contextTitle={lesson.title} status={status} isSignedIn={isSignedIn} onBack={...} />;
}
// ...existing lesson render unchanged
```

---

⚠️ **PENDING DEVICE VERIFICATION** — not done until JR confirms on a physical iPhone.
