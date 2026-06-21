# App Store submission + AVA Pro IAP checklist

**App:** Alpha Visual Artists (AVA)  
**Bundle:** `com.alphavisualartists.app`  
**Current binary:** 1.30.1 / build 24  

---

## What ships today (code state)

| Area | Status |
|------|--------|
| Events guest redeem + gallery | ✅ Fixed — redeem context scopes gallery to correct attendee |
| FREE_LAUNCH | `true` — all Pro content unlocked for App Review (no IAP required in binary yet) |
| Paywall copy | Production-ready ($40/yr founding, $9.99/mo) — hidden while FREE_LAUNCH |
| Native IAP SDK | ❌ **Not installed** — `restorePurchases` is a stub in `app/(tabs)/more.tsx` |
| expo-notifications | In `app.json` — requires **build 24+** on device for reminders |

---

## App Store Connect — Joshua only (before resubmit)

### Metadata (Round 3 rejection fixes)

- [ ] **Age Assurance:** App Information → **None** (no in-app age controls)
- [ ] **Review credentials:** `appreview@alphavisualartists.com` / `AVAreview!2026#Pro`
- [ ] Remove old creds (`ALPHAJRR`, etc.)
- [ ] Scrub description/keywords for “beta”, “trial”, “TestFlight”
- [ ] Paste Resolution Center replies from `docs/APP_STORE_REJECTION_JUNE_2026.md`

### AVA Pro subscription products (when flipping FREE_LAUNCH)

Create in **App Store Connect → Subscriptions** (same subscription group):

| Product ID (suggested) | Type | Price |
|------------------------|------|-------|
| `ava_pro_monthly` | Auto-renewable | $9.99/mo |
| `ava_pro_annual` | Auto-renewable | $39.99/yr (founding $40/yr in UI) |

Then in code (P1 — not done yet):

1. Add `expo-in-app-purchases` or RevenueCat
2. Purchase flow in `Paywall.tsx` → sets `profiles.subscription_tier = 'pro'` via webhook/edge fn
3. Set `FREE_LAUNCH = false` in `constants/proAccess.ts`
4. **New App Store build** (native IAP module)

**Do not flip FREE_LAUNCH until IAP is wired and tested on device.**

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

**JS-only fixes (OTA):**

```bash
npx tsc --noEmit
eas update --channel production --message "description"
```

**Native changes (`app.json`, plugins, ios/, android/):**

```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

---

⚠️ PENDING DEVICE VERIFICATION — not done until JR confirms on device.
