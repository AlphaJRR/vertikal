# RevenueCat + Expo — ALPHA Creators Pro

Step-by-step setup for **ALPHA Creators** (`com.alphavisualartists.app`). Code is already wired; this doc is the operator checklist.

> **Do not commit API keys.** Set `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` in `.env` (local) and EAS production env only.

---

## 1. Install SDKs (already done in repo)

```bash
cd /Users/alphavisualartists/Vertikal-App
npx expo install react-native-purchases react-native-purchases-ui
```

- `react-native-purchases` — purchases, offerings, customer info
- `react-native-purchases-ui` — hosted Paywall + Customer Center

**Requires a native build** (EAS build 27+). OTA alone cannot add these modules to older binaries.

---

## 2. API key

1. [RevenueCat](https://app.revenuecat.com) → your project → **API keys**
2. Copy **Apple App Store** public SDK key (`appl_…` for production, or `test_…` for sandbox project)
3. Local dev — add to `.env`:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=your_key_here
```

4. Production — Expo dashboard → project → **Environment variables** → `production` → same variable name

The app reads the key in `lib/purchases.ts` via `initPurchases()`. If missing, purchases are disabled (safe no-op).

---

## 3. RevenueCat dashboard — entitlement

| Field | Value |
|-------|--------|
| **Identifier** | `pro` |
| **Display name** | `ALPHA Creators Pro` |

Code checks `entitlements.active.pro` in `lib/purchases.ts` (`hasProEntitlement`).

---

## 4. App Store Connect products

Group: **ALPHA CREATORS CREW**

| Package (RevenueCat) | App Store Product ID | Price |
|----------------------|----------------------|-------|
| **Monthly** | `AvaCreatorPro` | $9.99/mo |
| **Yearly** (Annual) | `yearly` | $79.99/yr |
| **Lifetime** | *(optional — not in launch)* | Add later if needed |

**Legacy (do not create):** `ava_pro_monthly`, `ava_pro_annual` — superseded June 2026.

---

## 5. RevenueCat — offerings

1. **Products** → import from App Store Connect (`AvaCreatorPro`, `yearly`)
2. Attach each product to entitlement **`pro`**
3. **Offerings** → **default** offering:
   - Package **Monthly** → `AvaCreatorPro`
   - Package **Annual** (Yearly) → `yearly`
   - Package **Lifetime** → only if you create a non-consumable/lifetime product in ASC
4. **Paywalls** → design template in RevenueCat (optional; app can use hosted `presentPaywall()`)
5. **Customer Center** → enable in RevenueCat project settings

---

## 6. Webhook (Supabase tier sync)

- URL: `https://dyhmyvzgqonngzjueyoq.supabase.co/functions/v1/revenuecat-webhook`
- Authorization: `Bearer <REVENUECAT_WEBHOOK_SECRET>`
- Secret: `supabase secrets set REVENUECAT_WEBHOOK_SECRET=<random>`

Updates `profiles.subscription_tier` to `pro` / `free`.

---

## 7. App architecture (already implemented)

| File | Role |
|------|------|
| `lib/purchases.ts` | Configure SDK, offerings, purchase, restore, Paywall UI, Customer Center |
| `components/PurchasesBootstrap.tsx` | `initPurchases(supabaseUserId)` on login |
| `hooks/useAvaPro.ts` | Entitlement: `loading` \| `free` \| `pro` |
| `components/Paywall.tsx` | Custom paywall + **View subscription plans** (RC Paywall) |
| `app/(tabs)/more.tsx` | Subscribe, Restore, **Manage Subscription** (Customer Center) |
| `app/_layout.tsx` | Mounts `PurchasesBootstrap` when `FREE_LAUNCH === false` |

### Entitlement check (example)

```typescript
import { useAvaPro } from "../hooks/useAvaPro";

const { isPro, loading, status } = useAvaPro();
if (loading) return <Loading />;
if (!isPro) return <Paywall status={status} isSignedIn={!!user} />;
```

### Customer info

```typescript
import { getCustomerInfo, hasProEntitlement } from "../lib/purchases";

const info = await getCustomerInfo();
if (info && hasProEntitlement(info)) {
  // ALPHA Creators Pro active
}
```

### Present RevenueCat Paywall

```typescript
import { presentRevenueCatPaywall, presentRevenueCatPaywallIfNeeded } from "../lib/purchases";

const result = await presentRevenueCatPaywall();
// purchased | restored | cancelled | not_presented | error

await presentRevenueCatPaywallIfNeeded(); // only if `pro` inactive
```

### Customer Center

```typescript
import { presentCustomerCenter } from "../lib/purchases";

await presentCustomerCenter(); // manage / cancel subscription
```

---

## 8. Error handling best practices

- **User cancelled** — `isUserCancelledPurchase(error)` → silent return (no alert)
- **Missing API key** — log warning; UI shows “not configured”
- **Offerings empty** — retry button on paywall; check RC offering + ASC product status
- **Purchase succeeded but tier not pro** — webhook delay; call `refresh()` on `useAvaPro`
- **Never crash on IAP errors** — all paths try/catch with `console.error('[purchases] …')`

---

## 9. FREE_LAUNCH gate (critical)

`constants/proAccess.ts` → `FREE_LAUNCH = true` today.

| While `true` | While `false` |
|--------------|---------------|
| All toolkit unlocked | Pro gating active |
| Paywall hidden | Paywall + RC UI available |
| `PurchasesBootstrap` not mounted | RevenueCat initialized on login |

**Flip `FREE_LAUNCH` to `false` only after:**

1. Build **27+** on TestFlight/device  
2. ASC products + RevenueCat offering live  
3. `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` in EAS production  
4. Sandbox purchase succeeds → `profiles.subscription_tier = 'pro'`

---

## 10. Test sandbox purchase

1. ASC → Sandbox tester Apple ID  
2. iPhone → Settings → App Store → Sandbox Account  
3. Install build 28+ from TestFlight  
4. Set `FREE_LAUNCH = false` (engineering) → new build/OTA per native rules  
5. Sign in → locked lesson → purchase annual plan  
6. Verify More tab shows **PRO** and Supabase tier is `pro`

---

## 11. Build & submit

```bash
cd /Users/alphavisualartists/Vertikal-App
eas build --platform ios --profile production
```

Attach both subscriptions to version **1.30.1** when submitting IAP build (not the free-only build 26).

---

**References:** [RevenueCat Expo install](https://www.revenuecat.com/docs/getting-started/installation/expo), [Paywalls](https://www.revenuecat.com/docs/tools/paywalls), [Customer Center](https://www.revenuecat.com/docs/tools/customer-center), `docs/APP_STORE_IAP_CHECKLIST.md`
