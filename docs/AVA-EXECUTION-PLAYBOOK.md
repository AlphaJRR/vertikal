# AVA — Execution Playbook (Joshua ↔ Cursor)

**Purpose:** Turn IP valuation into real revenue. This doc defines who does what, how to run Cursor sessions, and the milestone map to $10K MRR.

---

## The Reality Check

**IP value on paper ≠ money in the bank.**

Investors and acquirers pay for:
1. **Proof people use it** (MAU, retention, App Store reviews)
2. **Proof people pay** (MRR, event contracts, Shopify GMV)
3. **Proof it survives without you** (docs, skills, repeatable ops)

Cursor can **ship and fix the product**. Joshua must **sell, verify on device, and close deals**. Split work accordingly.

---

## Three Revenue Engines (Pick One Primary This Quarter)

### Engine A — Events B2B (fastest cash)

**Who buys:** School photographers, reunion organizers, brand activations, wedding/event shooters.

**Offer:** “Sell at the event. Deliver in the app. Buyers get a private gallery code — no shared Dropbox.”

**Pricing sketch:** $500–$2,000 per event (flat) + optional operator training.

**Joshua does:**
- Identify 10 local photographers / operators
- Run 1 demo event (even free pilot) with signed testimonial
- Collect payment offline; document in a simple ledger

**Cursor does:**
- Fix upload queue, assign-to-buyer, redeem flow bugs (P0 only)
- Operator one-pager + demo seed (`DEMO01`)
- Attendee report reconciliation

**Proof metric:** 3 paid activations with written testimonials → **+$150K–$400K IP narrative**

---

### Engine B — AVA Pro (recurring, slower to start)

**Who buys:** Solo videographers, photographers billing clients.

**Offer:** Full 108-lesson toolkit + quote export + pro checklists.

**Pricing (approved):** $9.99/mo · $79.99/yr. See `docs/AI_EXEC_SALES_GOALS.md`.

**Joshua does:**
- Decide: flip `FREE_LAUNCH = false` only when IAP + App Store build ready
- Approve paywall copy and price point
- Device-test purchase flow on TestFlight

**Cursor does:**
- Ship StoreKit / RevenueCat integration (requires **native build**, not OTA)
- Wire `subscription_tier` webhook
- Keep 12-lesson free tier intact

**Proof metric:** 100 paying Pro users → ~$750–$900 gross MRR at launch mix ($9.99 / $79.99)

---

### Engine C — Apparel / Culture (brand gravity)

**Who buys:** Creators who identify with ALPHA.

**Offer:** Shop tab → shop.alphavisualartists.com

**Joshua does:**
- Push Shopify theme fixes (login required for deploy)
- Father’s Day / drop marketing
- Real checkout test with own card

**Cursor does:**
- Theme bug fixes (images, filters, collection counts)
- Match app Shop assets to web

**Proof metric:** $3K–$5K/mo gross → supports brand story, not core SaaS multiple

---

## Milestone Map to $10K MRR

| Month | Focus | Target | IP impact |
|-------|-------|--------|-----------|
| 1 | Events pilot + App Store live | 1 paid event ($500+) + app approved | Proof of B2B |
| 2 | Events scale + Pro IAP ship | 3 events/mo + 50 Pro subs | ~$4K–$6K/mo |
| 3 | Founding 50 + retention | 500 MAU + 100 Pro + 5 events | **$10K MRR** → $2M+ talk track |

**Mixed math example ($10K MRR):**
- 5 events × $1,200 = $6,000
- 150 Pro × $9.99 = ~$1,500
- Shopify net ~$1,500
- Toolkit partner pilot $1,000

---

## How to Set Up Cursor for Maximum Execution

### 1. One session = one outcome

Bad: “Fix everything and make us $10K.”  
Good: “P0: Event photo upload queue stuck — verify assign-to-attendee works on device after fix.”

Always include:
- **Priority:** P0 (blocks money/review) / P1 / P2
- **Success:** “JR confirms on iPhone” — not “code merged”
- **Scope:** Which tab/module only

### 2. Use the role switch

- **Engineering:** code, OTA, builds, Supabase, bugs
- **CCO:** one-pagers, event pitch copy, Founding 50 messaging, investor narrative

Say which you need in the first line.

### 3. Respect the canonical path

- Mobile = `app/` + Supabase only (no Clerk)
- Lessons = `data/toolkitCurriculum.ts` only
- OTA blocked if `ios/`, `android/`, `app.json`, `package.json` changed

Run before every OTA:
```bash
git diff --name-only HEAD | grep -E "^(ios/|android/|app\.json|eas\.json|package\.json)"
```

### 4. Device verification protocol (non-negotiable)

Nothing is “done” until Joshua confirms on a physical device. End every ship note with:

> ⚠️ PENDING DEVICE VERIFICATION

### 5. Attach context for faster loops

When reporting bugs, include:
- Screenshot or screen recording
- Account used (reviewer / your email)
- Build number (TestFlight)
- Exact tap path (Events → Upload → …)

### 6. Skills already loaded — invoke them

| Topic | Skill / doc |
|-------|-------------|
| Events module | `.cursor/skills/ava-event-delivery/SKILL.md` |
| IP / one-pagers | Feature inventory (chat) + `Investor_Data_Room/01 Overview/AVA IP Summary.md` |
| Pro gating | `constants/proAccess.ts` |
| App Store | `APP_STORE_METADATA.md`, `docs/APP_STORE_REJECTION_JUNE_2026.md` |

Say: “Read ava-event-delivery skill first” when touching Events.

### 7. Weekly rhythm (recommended)

| Day | Joshua | Cursor session |
|-----|--------|----------------|
| Mon | Pick **one** P0 from device testing | Hotfix + OTA if JS-only |
| Wed | Sales: 5 outreach (events or Pro) | Feature only if no P0 |
| Fri | Device QA pass (30 min) | Typecheck + commit if asked |
| Sun | Review MRR ledger + metrics | Plan next week’s single P0 |

### 8. Metrics ledger (simple — you own this)

Spreadsheet or Notion with weekly rows:

- App Store: downloads, MAU (ASC)
- Pro: active subs, churn
- Events: activations, gross $, photos delivered, redeem rate
- Shop: sessions, orders, GMV
- Support: # of P0 bugs found on device

Cursor cannot invent these numbers — you log them. They **are** the valuation.

### 9. What to ask Cursor to build vs not

**Ask:**
- P0/P1 bug fixes
- Event upload / assign / redeem reliability
- IAP when you approve native build
- One-pagers, pitch copy, data room docs
- Shopify theme fixes (with Shopify access)

**Don’t ask (without explicit approval):**
- New features outside the three engines
- Refactors “while we’re here”
- Parallel architectures (`artifacts/`, legacy paths)
- Commit/push/OTA unless you say so

### 10. Native build triggers (flag to Joshua)

These require **full App Store build**, not OTA:
- `expo-notifications` (reminders)
- StoreKit / IAP
- Any `app.json` / `ios/` / `android/` change

Cursor should **stop and flag** before proceeding.

---

## Leverage Tactics (Real World)

### Sell the module, not the whole app

- **To schools/reunions:** Events one-pager only
- **To solo shooters:** Toolkit + Rate Calculator one-pager
- **To investors:** Full IP Summary + milestone map

### Pilot → testimonial → price

First event can be discounted or free in exchange for:
- Written quote
- Permission to use event name
- Before/after (line time, delivery speed)

That testimonial is worth more than $500 in IP narrative.

### Founding 50 as distribution, not just badge

Each Founding creator gets:
- Custom toolkit mention or featured reel slot
- Requirement: 3 referrals who install + complete one project

Cursor seeds content; Joshua closes the velvet-rope list.

### Trademark + ledger (1 hour each, high ROI)

- File USPTO intent-to-use for **ALPHA VISUAL ARTISTS** / **AVA**
- Open business checking line item: “AVA Pro — June — $79”

Both show up in diligence immediately.

---

## Decision Queue (Joshua — pick and tell Cursor)

1. **Primary engine this quarter:** Events / Pro / Shop?
2. **Pro price:** $9.99/mo vs $79/yr?
3. **When to flip FREE_LAUNCH:** After IAP build approved?
4. **First paid event target:** Name + date?

Reply with those four answers and the next Cursor session can be scoped to revenue, not random fixes.

---

*Update this playbook when MRR milestones hit or primary engine changes.*
