# AVA PRO — AI EXEC REVENUE OPERATING MEMO

**Status:** Approved by Joshua, June 2026.

AVA Pro pricing is now canonical.

---

## AVA Pro subscription (single tier)

- **$9.99/month**
- **$79.99/year**
- **Product IDs:** `AvaCreatorPro` (monthly), `yearly` (annual)
- **Subscription group:** **ALPHA CREATORS CREW** (App Store Connect)
- **RevenueCat entitlement:** `pro` (display name: **ALPHA Creators Pro**)

**Legacy (do not use for new ASC/RC setup):** `ava_pro_monthly`, `ava_pro_annual` — superseded June 2026.

---

## Hard launch rule

Do not flip `FREE_LAUNCH` to false until Build 27 IAP is wired and Joshua confirms a successful purchase on device/TestFlight.

---

## Primary 90-day subscription goal

Build the subscriber base, prove free-to-paid conversion, validate lesson-gate monetization, and create a clean revenue dashboard that separates cash collected from recognized MRR.

---

## Execution owners

### LEDGER — revenue reporting

- Gross cash collected (App Store payouts vs. in-app gross)
- Gross MRR and net MRR (after Apple fee)
- ARR run-rate
- Annual vs monthly mix

### ATLAS — funnel analytics

- Install → free lesson starts and completions
- Lesson 13 gate exposure and conversion
- Paywall views, upgrade taps, purchase completion
- Pro activation after purchase (entitlement + profile tier sync)

### NOVA — acquisition

- Organic campaigns (DM, email, creator word-of-mouth)
- CAC discipline — **no broad paid ads until purchase flow is stable on device**

### CROWN — Founding 50

- **50 invites** total
- **35+ paid before public** launch
- **45+ by day 30**
- **75% annual** plan mix in F50 cohort
- **10 testimonials by Month 2**

### BEACON — engagement

- Free lesson completion rates
- Pro DAU and lessons unlocked beyond free tier
- Invoice builder and checklist activation among Pro subs
- Restore purchases success rate (Apple requirement)

### CURSOR — Build 27

- Native IAP (RevenueCat / StoreKit)
- Product IDs wired to `AvaCreatorPro` + `yearly`
- Restore reliability
- **P0/P1 fixes only** — no new modules

---

## Operating constraints

- **No new modules.**
- **No false revenue claims.**
- **No `FREE_LAUNCH` flip without Joshua device confirmation.**

---

## Related docs

- `docs/AI_EXEC_SALES_GOALS.md` — subscriber/MRR targets and weekly KPI tables (derived from this memo)
- `docs/APP_STORE_IAP_CHECKLIST.md` — Build 27 IAP checklist and ASC/RevenueCat setup
- `docs/FINANCIAL_ASSUMPTIONS.md` — CLV/CAC and subscription math
- `lib/purchases.ts` — product IDs and RevenueCat client
- `constants/proAccess.ts` — `FREE_LAUNCH` gate and lesson/tool gating

---

**Version:** 1.1 — Joshua-approved, June 2026  
**Canonical for:** pricing, product IDs, launch gates, exec ownership
