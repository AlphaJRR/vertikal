# AVA Pro — AI Exec Sales & Revenue Goals

**Status:** 🟢 APPROVED (Joshua, June 2026)  
**Owner:** LEDGER (CBO) · ATLAS (Analytics) · NOVA (Acquisition) · CROWN (Founding 50)  
**Audience:** AI executive team — weekly board reports, Notion command center, ATLAS dashboard  

> **Canonical source:** [`docs/AI_EXEC_REVENUE_OPERATING_MEMO.md`](./AI_EXEC_REVENUE_OPERATING_MEMO.md) — Joshua-approved pricing, product IDs, founding window, launch gates, and exec ownership. This document holds **targets and KPI tables** only; do not change pricing here.

---

## Approved pricing

*Aligned with operating memo — Phase 2 founding / Phase 3 standard.*

| Phase | Window | Monthly | Annual | Product IDs | Notes |
|-------|--------|---------|--------|-------------|-------|
| **Phase 2 — Founding** | First **500 subs** OR **90 days** (whichever first) | **$9.99** | **$39.99** | `ava_pro_monthly`, `ava_pro_annual` | Founding 50: **7-day early access** before public IAP; **grandfathered forever** at founding price |
| **Phase 3 — Standard** | After founding window closes | **$14.99** | **$49.99** | `ava_pro_monthly_standard`, `ava_pro_annual_standard` | New subscribers only; existing founding subs keep Phase 2 pricing |
| **Free tier** | Always | $0 | $0 | — | **12 lessons** (2 per toolkit tab) + **rate calculator** + **invoice builder** |

**Subscription group (App Store Connect):** `ALPHA CREATORS CREW`

**Net revenue assumption (Apple 15% small-business):** ~85% of gross → use **$8.49/mo** and **$33.99/yr** (founding) for MRR/ARR math in dashboards.

---

## Launch timeline

| Step | Gate | Owner | Target |
|------|------|-------|--------|
| 1 | **v1.30.1 App Store approval** (build 24) | Joshua | ✅ In flight / approved |
| 2 | **Build 27** — native IAP binary (RevenueCat or StoreKit) | CURSOR | Ship within **7 days** of 1.30.1 approval |
| 3 | **App Store Connect** — create 4 products in `ALPHA CREATORS CREW` | Joshua | Same week as build 27 submit |
| 4 | **Phase 2 — Founding IAP live** | Joshua + CROWN | Flip `FREE_LAUNCH = false` only after device-tested purchase on TestFlight |
| 5 | **Founding 50 early access** | CROWN | **T-7 days** before public: invite 50 with TestFlight + purchase instructions |
| 6 | **Phase 2 public** | NOVA + CROWN | Day 0 founding window opens (500 cap / 90-day clock starts) |
| 7 | **Phase 3 — Standard pricing** | LEDGER | Auto-switch product IDs when **500 subs reached** OR **90 days** elapsed |

**Do not flip `FREE_LAUNCH` until build 27 IAP is wired and Joshua confirms purchase on device.**

---

## Revenue milestones (90-day founding window)

Assumptions: **65% annual / 35% monthly** mix at founding price; **6% monthly churn** after month 1; free-to-paid **6%** within 30 days of paywall exposure.

### Subscriber targets

| Milestone | Calendar | Paid subs (cumulative) | Founding @ $39.99/yr | Standard @ $49.99/yr | Notes |
|-----------|----------|------------------------|----------------------|----------------------|-------|
| **F50 early access** | Week 0 | **35–45** | 35–45 | 0 | 70–90% of Founding 50 convert in 7-day head start |
| **Public launch (Week 1)** | Month 1 W1 | **75–100** | 75–100 | 0 | NOVA + organic; no paid ads until paywall stable |
| **Month 1 close** | End M1 | **120–150** | 120–150 | 0 | ~$950–$1,200 **gross MRR** |
| **Month 2** | End M2 | **200–250** | 200–250 | 0 | ~$1,600–$2,000 gross MRR |
| **Month 3** | End M3 | **300–400** | 300–400 | 0 | ~$2,400–$3,200 gross MRR |
| **Founding cap / Phase 3** | Day 90 or 500 subs | **500** (cap) | 500 (grandfathered) | 0→ramp | Close founding; new subs at $14.99/$49.99 |
| **Month 4–6 (Phase 3)** | M4–M6 | **550–700** | 500 | 50–200 | Blended ARPU rises as standard mix grows |

### MRR / ARR targets (gross, before Apple fee)

| Period | Gross MRR target | Gross ARR run-rate | Primary driver |
|--------|------------------|--------------------|----------------|
| **Month 1** | **$1,000** | $12K | Founding 50 + launch cohort |
| **Month 2** | **$1,750** | $21K | Word-of-mouth + toolkit completion triggers |
| **Month 3** | **$2,800** | $34K | Founding window momentum toward cap |
| **Month 4** (Phase 3 start) | **$3,200** | $38K | Standard tier adds ~$15 ARPU uplift on new subs |
| **Month 6** | **$4,500** | $54K | 500 founding + 150–200 standard |

**Stretch (combined engines):** AVA Pro **$4.5K MRR** + Events B2B **$3K** + Apparel **$1.5K** = **~$9K total** by month 6 — path to $10K MRR per `docs/AVA-EXECUTION-PLAYBOOK.md`.

---

## Founding 50 — conversion targets

| KPI | Target | Owner | Window |
|-----|--------|-------|--------|
| Early-access invites sent | **50 / 50** | CROWN | T-7 before public IAP |
| Convert in **7-day early access** | **≥ 35 (70%)** | CROWN | Days -7 to 0 |
| Convert by **day 30** | **≥ 45 (90%)** | CROWN | First 30 days of IAP |
| Annual vs monthly (F50 cohort) | **≥ 75% annual** | CROWN | Prefer $39.99/yr lock-in |
| Testimonial / case study | **≥ 10** | CROWN + VERA | By end of Month 2 |

Founding 50 subscribers **must** use product IDs `ava_pro_monthly` / `ava_pro_annual` so grandfathering survives Phase 3 price increase.

---

## Free tier → Pro conversion

| KPI | Calculation | Target | Owner |
|-----|-------------|--------|-------|
| **Free lesson completion rate** | Users finishing all 12 free lessons / MAU | **15%** | BEACON |
| **Paywall impression → trial intent** | Tap upgrade CTA / paywall views | **25%** | BEACON |
| **Free → paid (30-day)** | New Pro subs / users who hit lesson 13 gate | **6%** | NOVA / BEACON |
| **Annual mix (non-F50)** | Annual subs / all new subs | **60–65%** | LEDGER |
| **Send Quote → Pro** (rate calc gate) | Pro subs with Send Quote event / paywall from tools | Track baseline M1 | BEACON |

---

## AI exec KPI dashboard (weekly)

### LEDGER — Revenue

| Metric | Source | Target (M1) |
|--------|--------|-------------|
| Gross MRR | App Store Connect / RevenueCat | $1,000 |
| Net MRR (after Apple) | × 0.85 | $850 |
| ARR run-rate | MRR × 12 | $12K |
| Founding subs remaining in cap | 500 − founding count | Track daily |
| Days until Phase 3 | 90 − days since founding open | Alert at ≤ 14 days |
| ARPU (blended) | MRR / active subs | ~$8–10 founding phase |

### ATLAS — Funnel & retention

| Metric | Target |
|--------|--------|
| Monthly churn | **< 6%** |
| Annual renewal rate (founding) | **> 80%** at first renewal |
| Lesson 13 gate conversion | **> 5%** |
| Pro feature activation (invoice + checklist) | **> 40%** of Pro subs in first 14 days |

### NOVA — Acquisition efficiency

| Metric | Target |
|--------|--------|
| CAC (paid) per Pro sub | **< $40** (founding phase; no broad paid until M2) |
| Organic installs → Pro | **> 3%** by M3 |
| Cost per founding-cap sub | **< $25** blended |

### CROWN — Founding 50

| Metric | Target |
|--------|--------|
| F50 paid conversion | **≥ 90%** by day 30 |
| F50 annual plan mix | **≥ 75%** |
| White-glove onboarding NPS | **≥ 50** (qualitative pulse) |

### BEACON — Product engagement

| Metric | Target |
|--------|--------|
| Pro DAU / Pro subs | **> 35%** |
| Lessons unlocked beyond free (avg Pro user) | **> 8** in first 30 days |
| Restore purchases success | **100%** when entitled (Apple requirement) |

---

## Week 1–4 sales goals (Month 1, public founding launch)

| Week | Subs (new) | Cumulative subs | Gross MRR | Exec focus |
|------|------------|-----------------|-----------|------------|
| **W1** | 40–60 | 75–100 | $600–800 | CROWN: F50 conversions; CURSOR: IAP stability |
| **W2** | 25–35 | 100–135 | $800–1,050 | BEACON: lesson-gate analytics; fix drop-off |
| **W3** | 20–30 | 120–165 | $950–1,200 | NOVA: first organic campaign (no paid until stable) |
| **W4** | 15–25 | 135–190 | $1,050–1,400 | LEDGER: Month-1 board report; churn watch |

---

## Phase 3 transition rules

1. **Trigger:** `founding_sub_count >= 500` **OR** `founding_window_days >= 90`.
2. **App Store Connect:** Enable standard products; keep founding products available only to existing subscribers (grandfathering).
3. **Paywall UI:** Show standard pricing to new users; never upsell existing founding subs to higher price.
4. **Reporting:** Split MRR into **Founding** vs **Standard** columns in ATLAS weekly export.

---

## Related docs

- `docs/AI_EXEC_REVENUE_OPERATING_MEMO.md` — **canonical** pricing, launch rules, exec owners  
- `docs/APP_STORE_IAP_CHECKLIST.md` — build 27 IAP checklist  
- `docs/FINANCIAL_ASSUMPTIONS.md` — CLV/CAC; subscription section updated  
- `docs/KPI_DASHBOARD_STRUCTURE.md` — funnel KPIs + AVA Pro section  
- `docs/AVA-EXECUTION-PLAYBOOK.md` — Engine B + $10K MRR milestone map  
- `APP_STORE_METADATA.md` — store-facing subscription copy  

---

**Generated:** June 2026  
**Version:** 1.0 — Joshua-approved pricing  
**Next review:** End of founding window (day 90 or 500 subs)
