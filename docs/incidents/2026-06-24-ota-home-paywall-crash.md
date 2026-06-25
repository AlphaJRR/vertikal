# Incident Report — OTA / Home / Paywall / Cold-Start Crashes

**Date:** 2026-06-24 (evening, US Central)  
**Repo:** `/Users/alphavisualartists/Vertikal-App` (legacy folder name)  
**App:** Alpha Visual Artists (AVA) · `com.alphavisualartists.app`  
**Native runtime on device:** `1.30.2` (build 32–34 range)  
**Branch:** `main` · production OTA channel  
**Author:** CURSOR (Senior Engineer) · compiled from commits, EAS logs, and device reports  

---

## Executive summary

Launch night (Jun 24) exposed a chain of failures across **wrong-repo confusion**, **stale/mismatched OTA bundles**, **broken GitHub Actions OTA workflow**, **aggressive `reloadAsync`**, **Home video mount crashes**, **missing Supabase env in OTA bundles**, and **RevenueCat offerings fetch without SDK init**. Multiple manual OTAs shipped fixes faster than CI; the app stabilized after staging OTAs for next cold start, disabling inline Home HLS, guarding `VideoModal`/`useAvaPro`, and inlining Supabase env vars. **Paywall P0** — “Subscriptions are not available” — root cause: `getOfferings()` ran before `Purchases.configure()` on inline Paywall routes, compounded by OTA publishes that did not pass `--environment production` (RevenueCat/Supabase env vars not inlined). **Fix shipped** `11494ec` + OTA `8e04082b-7e51-4b39-bebf-bc873c9882fd` (`--environment production`).

---

## Timeline (chronological)

### Phase 0 — Pre-incident context (days before)

| Item | Detail |
|------|--------|
| Paid launch enabled | `e5c5149` — `FREE_LAUNCH = false` in `constants/proAccess.ts` |
| RevenueCat wired | `f3856f7`, `307d06b` — lazy-load `react-native-purchases`; product IDs aligned to ASC (`AvaCreatorPro`, `yearly`) in `87b9602` |
| Legacy dual-runtime OTAs | GHA workflow temporarily published to **both** runtime `1.0.0` and `1.0.4` (Vertikal-era binaries) — caused confusion about which JS bundle devices received |
| App Store native | Builds on `1.30.1` / `1.30.2`; latest production IPA build `564e1e64` @ `e5c5149`, runtime `1.30.2`, buildNumber 34 |

---

### ~17:00–19:00 — Wrong repo + stale OTA vs code

**Symptom:** Home tab missing new content (bio carousel, Mama Connie, JR interviews); paywall/account changes not visible on device despite code on `main`.

**Root causes:**
1. **Repo confusion** — work occasionally targeted `ava-v4` or other paths instead of canonical `/Users/alphavisualartists/Vertikal-App` (`app/` → `expo-router/entry`). OTAs published from wrong tree did not match device native runtime/channel.
2. **Stale OTA** — device running an older update group while `main` had newer commits (`46ecef3` home content, `0ac8e54` paywall surfacing).
3. **Runtime mismatch** — some OTAs targeted `1.30.1` while device native was `1.30.2` (OTA ignored until runtime aligned).

**Evidence:**
- Manual OTA `1272851f-5e95-4ad7-8855-42a5141520e2` — “Home bio carousel, Mama Connie, JR interviews, Shop apparel stack” (`46ecef3`)
- Manual OTA `26bc106c-68ff-45fe-a580-c048662b65d9` — “Paywall surfacing: Home modal, locked taps, Account tab” (`0ac8e54`)

---

### ~19:00–19:30 — Paywall surfacing + RevenueCat bootstrap split

**Commits:**
- `0ac8e54` — Home paywall modal, locked-content routing, Account tab Pro CTA
- `3466712` — **PurchasesBootstrap reverted to signed-in-only init**; anonymous RC configure deferred to `/pro` only (`app/pro.tsx` waits `rcReady` before rendering `Paywall`)

**Symptom:** Paywall visible pre-auth but subscription buttons show error; offerings empty.

**Technical note:** `components/PurchasesBootstrap.tsx` calls `initPurchases(user.id)` only when signed in; otherwise `logOutPurchases()`. Inline `Paywall` on `lesson/[id]`, `cheatsheet/[id]`, `slide/[id]` had **no** RC init gate — race with bootstrap on signed-in path.

**OTA:** `0e4806e1-2c29-4746-9573-fbe63c6e4a69` — “hotfix: PurchasesBootstrap signed-in-only init”

---

### ~19:30–20:20 — Cold-start crashes (Home video mount)

**Symptom:** App crashes on cold start after OTA; Home never renders; tabs missing.

**Commits (iterative):**
| Commit | Fix |
|--------|-----|
| `c023230` | Resolve cold-start crash on Home mount |
| `a6dbdf3` | Graceful video mount |
| `130f160` | Guard video pause on mount; paywall visible pre-auth |
| `f85f33c` | Lazy-mount `ReelVideoCover` |
| `32a0fbb` | Defer home video mount |

**Theory (initial):** “Mama Connie video stampede” — multiple simultaneous HLS decoders on Home cold start after content ship (`46ecef3`).

**Actual root cause (confirmed):** `VideoModal` called `useVideoPlayer(null)` on Home mount when `activeVideo` was still null — native player construction throws (`1550a4f`). Stampede may have worsened timing but **null player was the P0 crash**.

**OTAs:**
- `34d89586-3b7d-449f-895c-63fe79982cd3` — “hotfix: cold start crash fix”
- `22c47348-d413-4446-af14-c51c9f9680d5` — redeploy
- `114010ab-9e09-464d-a2f1-a87e1364c8b8` — defer home videos
- `6050ead5-0ac4-430f-9c12-53e164a77b9e` — VideoModal null-player + `DISABLE_HOME_VIDEOS`

---

### ~20:20–20:40 — OTA `reloadAsync` crash loop

**Commit:** `b5d8696` — auto `Updates.reloadAsync()` after OTA fetch; `UpdateDebugLine` for bundle diagnostics; section error boundaries on Home; zero-day paywall cooldown.

**Symptom:** Crash loop ~3s after intro — OTA downloaded, `reloadAsync` fired while Home video players mounting → native teardown crash.

**Fix:** `c909c65` — **revert auto-reload**; stage update for next cold start only; defer OTA check 10s after app interactive; guard intro `play()` via `playWhenReady`.

**OTA:** `b26556e9-61d1-425d-b3f4-b4467df80a39` — “P0: OTA auto-reload + bundle debug + paywall visibility” (broken) → superseded by staged-OTA fix.

**Device bundle ID observation (UpdateDebugLine):** JR reported sequential bundle prefixes during the loop — `019efc6f` → `019efca8` → `019efcc8` → `019efce1` (first 8 chars of `Updates.updateId` on device as each reload applied a new OTA).

---

### ~20:40–21:00 — Account tab / demo mode / paywall visibility

**Symptom:** Account tab showed demo/reviewer mode; Pro upgrade CTA hidden.

**Commit:** `7d1bd9a` — clear demo mode defaults; surface Pro account tab.

**OTAs:**
- `f13baeb0-ac2e-45c0-800a-d7309c115226` — “Launch fix account tab demo mode paywall” (runtime `1.30.2`)
- `a6c212ae-c091-45c9-8bff-fd93e513f217` — “Launch fix for 1.30.1 runtime account paywall” (parallel publish for older native)

---

### ~21:00–21:20 — GitHub Actions OTA workflow broken

**Symptom:** Pushes to `main` did not reliably publish OTAs; workflow appeared green but skipped publish.

**Commit:** `2165750` — `ci(ota): fix workflow runtime and secrets guard`

**Problems fixed:**
1. **Invalid `if: ${{ secrets.EXPO_TOKEN != '' }}`** — GitHub Actions does not allow `secrets` in `if` expressions; step was silently skipped.
2. **Dual runtime loop `1.0.0` / `1.0.4`** — overwrote `app.json` version temporarily; wrong for `1.30.2` native fleet.
3. **Missing fail-loud** — workflow succeeded when `EXPO_TOKEN` absent.

**After fix:** Single `eas update --channel production` using `appVersion` runtime policy from `app.json` (`1.30.2`).

**Gap remaining (fixed post-incident):** workflow did not pass `--environment production` → EAS env vars (`EXPO_PUBLIC_*`) not inlined into OTA JS bundle.

---

### ~21:20–21:55 — Supabase auth null crash

**Symptom:** Cold-start crash in `useAvaPro` — `supabase.auth.onAuthStateChange` on null client.

**Root cause:** OTA bundles published **without** `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` inlined. `lib/supabase.ts` left `supabaseInstance = null`; `useAvaPro` line ~101 subscribed to auth without null guard (AuthContext was already safe).

**Commits:**
- `9ccc4cd` — guard `supabase?.auth` in `useAvaPro` + `isSupabaseAvailable()` helper

**Manual OTAs (env inlining):**
| Group ID | Message |
|----------|---------|
| `6ebf44c1-3488-4c6f-a119-d5142c939a44` | OTA: Supabase env vars in production bundle |
| `e8f5e922-d27f-4cf8-be29-105fadc80876` | OTA: Supabase env inlined |
| `b254e9d0-ecd4-4632-8a40-cfbd19e36f64` | OTA: Supabase env inlined (Sensitive) |
| `9c636984-f3bb-47b5-88d0-338777621858` | hotfix: supabase auth null cold-start crash |

**Lesson:** `EXPO_PUBLIC_*` must be present at **`eas update` bundle time**. Sensitive vars require `--environment production` (or explicit env file). Embedded native build env ≠ OTA bundle env.

---

### ~21:55–22:30 — Home stabilization: kill-switch + tap-to-play

**Commits:**
| Commit | Change |
|--------|--------|
| `1550a4f` | `DISABLE_HOME_VIDEOS = true`; `VideoModal` split — no `useVideoPlayer` until source set |
| `106be24` | Restore section order; **Featured Videos** vs **Recent Work** portfolio split |
| `a25f0e7` | Stage-1 tap-to-play reels; inline HLS off; `VideoModal` on tap |

**OTAs:**
- `a05a5138-ead6-4aa9-b96b-7bd6a0a9290f` — Featured vs portfolio split
- `56ffe355-361a-47d5-be78-0597ae3cde14` — tap-to-play stage 1

**`DISABLE_HOME_VIDEOS`:** `constants/homeVideos.ts` — inline HLS on Home disabled; Mama Connie shows static fallback; reels open in modal on tap only.

---

### ~22:30+ — Paywall P0 (end of night status)

**Symptom:** Paywall shows **“Subscriptions are not available right now. Try again later.”**

**String source:** `components/Paywall.tsx` line ~70 — set when `getOfferings()` returns null or `offerings.current` is missing.

**Failure paths:**
1. `isPurchasesSupported()` false → missing `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` in OTA bundle (same class of bug as Supabase env)
2. `getOfferings()` called **before** `Purchases.configure()` — inline Paywall routes + race with `PurchasesBootstrap`
3. RevenueCat dashboard — no default offering / product mapping (operator fix; not code)

**EAS production env (verified):** `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_pyikmJgFOZZhtKfFClxRSJQYYrr` — present in EAS; must be inlined at OTA publish.

**Code fix (shipped `11494ec`):**
- `Paywall.loadOfferings()` calls `initPurchases(user?.id ?? null)` before `getOfferings()`; re-runs when `user?.id` changes.
- GHA workflow `.github/workflows/eas-ota-update.yml` adds `--environment production`.

**OTA (shipped):** `8e04082b-7e51-4b39-bebf-bc873c9882fd` — “P0 paywall: init RC before offerings + OTA env production” · runtime `1.30.2` · `--environment production`.

**Not a code issue:** App Store Connect / RevenueCat offering must have default offering with `AvaCreatorPro` (monthly) and `yearly` (annual) attached to entitlement `pro`. Wrong mapping shows different error: “AVA Pro plans are not configured yet.”

---

## Manual `eas update` vs GitHub Actions — what actually shipped

| Publisher | When | What shipped |
|-----------|------|--------------|
| **Manual (`alpha_jrr`)** | Jun 24 evening | ~20+ production OTAs — all hotfixes that reached devices during incident |
| **GitHub Actions** | Broken until `2165750` | Skipped publish (secrets in `if`) or wrong runtime (`1.0.0`/`1.0.4` loop) |
| **GHA after `2165750`** | Late evening | Correct runtime policy; still missing `--environment production` until follow-up fix |

**Rule going forward:** Treat manual OTAs as source of truth during incident; verify device `UpdateDebugLine` bundle ID matches expected group after publish.

---

## What worked

- `UpdateDebugLine` on Account tab — confirmed which OTA bundle device ran
- Staging OTA for next cold start (no mid-session `reloadAsync`)
- `DISABLE_HOME_VIDEOS` kill-switch — stopped inline decoder stampede
- `VideoModal` null guard — eliminated primary cold-start crash
- `useAvaPro` / `supabase` null guards — graceful degrade when env missing
- Section error boundaries on Home — isolated render failures
- Manual OTA velocity — faster than fixing CI mid-incident
- `app/pro.tsx` `rcReady` gate — correct pattern for RC init before paywall (but not replicated on inline Paywall)

---

## What didn’t work

- Auto `reloadAsync` after OTA fetch (`b5d8696`)
- Publishing OTAs without `--environment production`
- Dual-runtime `1.0.0` / `1.0.4` GHA loop
- Assuming embedded native env vars flow into OTA bundles automatically
- `PurchasesBootstrap` signed-in-only init without Paywall-side init fallback
- Mama Connie stampede theory as sole explanation — distracted from null `useVideoPlayer`

---

## Lessons learned

1. **OTA ≠ native build for env** — every `eas update` must use `--environment production` (or explicit env) so `EXPO_PUBLIC_*` are inlined.
2. **Never `reloadAsync` during warm start** — stage only; minimum 10s after interactive.
3. **One canonical repo** — `Vertikal-App` only; verify `Updates.runtimeVersion` matches `app.json` before publish.
4. **RC init is a prerequisite** — any UI calling `getOfferings()` must `await initPurchases()` first.
5. **Video hooks need non-null sources** — split components so `useVideoPlayer` never sees null.
6. **CI must fail loud** — no silent skip on missing `EXPO_TOKEN`; no `secrets` in `if`.
7. **Device bundle ID is ground truth** — `UpdateDebugLine` before declaring fix shipped.

---

## Current stable state (end of Jun 24)

| Area | State |
|------|-------|
| Cold start | Stable with staged OTA + video guards |
| Home content | Bio carousel, Featured Videos, Recent Work portfolio, JR interviews visible |
| Inline Home video | **Off** (`DISABLE_HOME_VIDEOS = true`) |
| Tap-to-play | **On** — reels open `VideoModal` on tap (`a25f0e7`) |
| Autoplay | **Not enabled** — stage 2 pending device verification |
| Supabase auth | Guarded; env inlined via manual OTAs |
| OTA delivery | Staged for next cold start; no auto-reload |
| Paywall | **Fix shipped** (`11494ec` + OTA `8e04082b`) — pending JR device verification |
| Native version | `1.30.2` · channel `production` · EAS project `39911e65-82a6-47ca-af2b-3769a15817df` |

---

## Key commits (reference)

```
11494ec fix(paywall): init RevenueCat before offerings fetch + incident memo
106be24 fix(home): restore section order and separate featured videos
a25f0e7 feat(home): stage-1 tap-to-play reels
9ccc4cd fix(hotfix): guard supabase.auth when client null
1550a4f fix(hotfix): stop VideoModal null-player cold-start crash
32a0fbb fix(hotfix): defer home video mount
2165750 ci(ota): fix workflow runtime and secrets guard
7d1bd9a fix(launch): clear demo mode and surface pro account tab
c909c65 fix(hotfix): stop reloadAsync cold-start crash
b5d8696 fix(ota,paywall): auto-reload updates (reverted behavior in c909c65)
3466712 fix(purchases): signed-in-only bootstrap; lazy RC on /pro
46ecef3 feat(home): bio carousel, Mama Connie, JR interviews
0ac8e54 feat(paywall): surface Pro upsell on Home, Account tab
e5c5149 feat(iap): enable paid launch — FREE_LAUNCH false
```

---

## OTA group IDs (Jun 24 evening — production / 1.30.2 unless noted)

| Group ID | Message |
|----------|---------|
| `26bc106c-68ff-45fe-a580-c048662b65d9` | Paywall surfacing |
| `1272851f-5e95-4ad7-8855-42a5141520e2` | Home bio carousel, Mama Connie |
| `34d89586-3b7d-449f-895c-63fe79982cd3` | Cold start crash fix |
| `0e4806e1-2c29-4746-9573-fbe63c6e4a69` | PurchasesBootstrap signed-in-only |
| `b26556e9-61d1-425d-b3f4-b4467df80a39` | OTA auto-reload (problematic) |
| `6050ead5-0ac4-430f-9c12-53e164a77b9e` | VideoModal null + DISABLE_HOME_VIDEOS |
| `9c636984-f3bb-47b5-88d0-338777621858` | Supabase auth null guard |
| `6ebf44c1` / `e8f5e922` / `b254e9d0` | Supabase env inlining (manual) |
| `f13baeb0-ac2e-45c0-800a-d7309c115226` | Account demo mode fix (1.30.2) |
| `56ffe355-361a-47d5-be78-0597ae3cde14` | Tap-to-play stage 1 |
| `a05a5138-ead6-4aa9-b96b-7bd6a0a9290f` | Featured vs portfolio split |
| `8e04082b-7e51-4b39-bebf-bc873c9882fd` | **P0 paywall: init RC before offerings + env production** (`11494ec`) |
| `37137deb-ea3e-4302-90ac-aec3375fc55e` | **P0 paywall: getOfferings auto-init RC** (`bf93ead`) |

---

## Jun 25 follow-up — paywall still failing after `11494ec` / `bf93ead`

**Symptom (JR screenshot):** Paywall shows static `$79.99/year` / `$9.99/month` prices **and** red error *“Subscriptions are not available right now. Try again later.”* Subscribe buttons visible but non-functional (only retried `loadOfferings`).

**Root cause (code):**
1. `Paywall.tsx` always renders **fallback price strings** even when offerings fail — screenshot looked “half working.”
2. Error fires when `offerings.current` is `null` — even if `offerings.all["default"]` exists or StoreKit products are live.
3. `getFoundingPackages()` only searched `offerings.current`, ignoring `offering.monthly` / `offering.annual` shortcuts and `offerings.all` fallback.
4. When packages missing, static Subscribe buttons called `loadOfferings()` again — **never** `purchasePackage` / StoreKit.

**Likely operator cause (if StoreKit fallback also fails):** RevenueCat dashboard has no **Current** offering set, or products `AvaCreatorPro` / `yearly` not imported from ASC.

**Code fix (Jun 25):**
- `lib/purchases.ts` — `resolveCurrentOffering()` (`current` → `default` → first non-empty `all`), `loadPaywallPlans()` with StoreKit `getProducts` fallback + `purchaseStoreProduct`, RC error code in logs/detail.
- `components/Paywall.tsx` — real purchase via package **or** store product; retry offerings ×2; `UpdateDebugLine` on paywall; surface `error.code` + `detail` to JR.

**JR RevenueCat dashboard checklist:**
1. [app.revenuecat.com](https://app.revenuecat.com) → AVA project → **Products** → confirm `AvaCreatorPro` + `yearly` imported from App Store Connect (status **Ready**).
2. **Entitlements** → `pro` → both products attached.
3. **Offerings** → offering `default` (or any) with packages: **Monthly** → `AvaCreatorPro`, **Annual** → `yearly`.
4. Set offering as **Current** (star icon) — fixes `offerings.current` null.
5. **Apps** → iOS app bundle `com.alphavisualartists.app` linked; API key matches EAS `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`.

**ASC checklist:** Subscription group `ALPHA CREATORS CREW` — `AvaCreatorPro` ($9.99/mo), `yearly` ($79.99/yr) — **Ready to Submit** or approved.

---

## Follow-up actions

- [ ] JR device-verify paywall purchase flow after Jun 25 OTA (kill app → cold start; confirm `UpdateDebugLine` bundle ID)
- [ ] Confirm RevenueCat **Current** offering + ASC products synced (dashboard steps above)
- [ ] Stage 2: re-enable inline Home video after decoder budget verified
- [ ] Remove `UpdateDebugLine` from Paywall after stable fleet confirmed
- [ ] Document mandatory `eas update --environment production` in runbook

---

*⚠️ PENDING DEVICE VERIFICATION — incident mitigations and paywall fix not done until JR confirms on physical device.*
