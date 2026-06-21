# App Store submission + AVA Pro IAP checklist

**App:** Alpha Visual Artists (AVA)  
**Bundle:** `com.alphavisualartists.app`  
**Current binary:** 1.30.1 / build 27  

---

## What ships today (code state)

| Area | Status |
|------|--------|
| Events guest redeem + gallery | ✅ Fixed — redeem context scopes gallery to correct attendee |
| FREE_LAUNCH | `true` — all Pro content unlocked for App Review (no purchase UI yet) |
| Paywall copy + purchase flow | ✅ RevenueCat SDK wired — hidden while FREE_LAUNCH |
| Native IAP SDK | ✅ `react-native-purchases` ^10.4 — requires **build 27+** on device |
| Restore Purchases | ✅ `Paywall.tsx` + `app/(tabs)/more.tsx` |
| Supabase webhook | ✅ `supabase/functions/revenuecat-webhook` — deploy + set secret |
| expo-notifications | In `app.json` — requires **build 24+** on device for reminders |

---

## Environment variables

### EAS (Expo) — client

Set in **Expo → Project → Environment variables → production**:

| Variable | Where to get it |
|----------|-----------------|
| `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` | RevenueCat → Project → API keys → **Apple App Store** (public SDK key) |

Existing vars still required: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

### Supabase Edge Function — server

Deploy `revenuecat-webhook` and set:

| Secret | Where to get it |
|--------|-----------------|
| `REVENUECAT_WEBHOOK_SECRET` | Generate a random string; paste same value in RevenueCat webhook **Authorization** header (`Bearer <secret>`) |

Webhook URL (after deploy):

```
https://dyhmyvzgqonngzjueyoq.supabase.co/functions/v1/revenuecat-webhook
```

---

## RevenueCat dashboard — Joshua only

1. **Project** → add iOS app `com.alphavisualartists.app`
2. **Entitlements** → create `pro`
3. **Products** → import/link ASC products (see table below)
4. **Offerings** → default offering with founding monthly + annual packages
5. **Integrations → Webhooks** → URL above, Authorization `Bearer <REVENUECAT_WEBHOOK_SECRET>`
6. Copy **Apple public SDK key** → EAS `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`

Product IDs (subscription group **ALPHA CREATORS CREW**):

| Product ID | Type | Price | Phase |
|------------|------|-------|-------|
| `ava_pro_monthly` | Auto-renewable | $9.99/mo | Founding (Phase 2) |
| `ava_pro_annual` | Auto-renewable | $39.99/yr | Founding (Phase 2) |
| `ava_pro_monthly_standard` | Auto-renewable | $14.99/mo | Standard (Phase 3) |
| `ava_pro_annual_standard` | Auto-renewable | $49.99/yr | Standard (Phase 3) |

**Founding window:** First 500 subs OR 90 days. Founding 50 get 7-day early access; grandfathered at founding price forever.

Canonical pricing & launch rules: `docs/AI_EXEC_REVENUE_OPERATING_MEMO.md`. Sales targets: `docs/AI_EXEC_SALES_GOALS.md`.

---

## App Store Connect — Joshua only (before resubmit)

### Metadata (Round 3 rejection fixes)

- [ ] **Age Assurance:** App Information → **None** (no in-app age controls)
- [ ] **Review credentials:** `appreview@alphavisualartists.com` / `AVAreview!2026#Pro`
- [ ] Remove old creds (`ALPHAJRR`, etc.)
- [ ] Scrub description/keywords for “beta”, “trial”, “TestFlight”
- [ ] Paste Resolution Center replies from `docs/APP_STORE_REJECTION_JUNE_2026.md`

### AVA Pro subscription products

Create in **App Store Connect → Subscriptions** — group **`ALPHA CREATORS CREW`** (same product IDs as RevenueCat table).

- [ ] `ava_pro_monthly` — $9.99/mo
- [ ] `ava_pro_annual` — $39.99/yr
- [ ] `ava_pro_monthly_standard` — $14.99/mo (Phase 3 — can add later)
- [ ] `ava_pro_annual_standard` — $49.99/yr (Phase 3 — can add later)
- [ ] Subscription localization + review screenshot
- [ ] Sandbox tester account for purchase QA

### Flip FREE_LAUNCH (after device QA)

1. Sandbox purchase succeeds on build 27+
2. Webhook sets `profiles.subscription_tier = 'pro'`
3. Set `FREE_LAUNCH = false` in `constants/proAccess.ts`
4. **OTA is not enough** if native module changed — ship new binary or confirm build 27 already includes SDK

**Do not flip FREE_LAUNCH until IAP is verified on a physical device.**

---

## DEMO01 gallery testing

If operator shows photos assigned but gallery is empty:

1. Run `scripts/reset-demo01.sql` in Supabase SQL editor
2. On device: Events → enter **DEMO01** (not signed in as operator on a different account)
3. Complete **Photo Release** screen
4. Gallery should show assigned photos

**Common mistake:** DEMO01 is linked to `reviewer.attendee@alphavisualartists.com` in seed. Testing as operator or a different account without reset → “code already claimed” or empty gallery.

---

## Deploy commands

**JS-only fixes (OTA) — blocked when native deps change:**

```bash
npx tsc --noEmit
eas update --channel production --message "description"
```

**Native changes (`app.json`, plugins, `react-native-purchases`, ios/, android/):**

```bash
npx tsc --noEmit
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

**Deploy RevenueCat webhook:**

```bash
supabase functions deploy revenuecat-webhook --no-verify-jwt
supabase secrets set REVENUECAT_WEBHOOK_SECRET=<your-secret>
```

---

⚠️ PENDING DEVICE VERIFICATION — not done until JR confirms on device.
