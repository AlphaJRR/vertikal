# 📊 KPI Dashboard Structure

**Author:** ATLAS — Head of Analytics & Insights  
**Status:** 🟢 LOCKED  
**Dashboard Title:** Vertikal AI - Week 1 Launch Metrics (Dec 14-20)  
**Audience:** JOSHUA (CEO), JIM (CSO)

---

## I. FUNNEL HEALTH (Top Priority)

| KPI / Metric | Calculation | Owner | Source | Target |
|:---|:---|:---|:---|:---|
| **Creator Conversion Rate (CCR)** | `Applications Submitted` / `Click CTA Primary (Creator)` | VERA / NOVA | `application_submitted` / `click_cta_primary` | 4.5% |
| **User Waitlist Growth** | Total `applications` where `funnel_type` is 'user' | NOVA | `application_submitted` (user) | 1,000/week |
| **Top Traffic Source** | Max of `page_view` by `referrer` / `utm_campaign` | NOVA | `page_view` | Track daily |
| **Form Drop-Off Rate** | `form_interaction (focused)` - `form_interaction (completed)` | NOVA | `form_interaction` | < 30% |
| **Funnel Completion Rate** | `application_submitted` / `funnel_start` | NOVA | `application_submitted` / `funnel_start` | > 50% |

---

## II. FOUNDING 50

| KPI / Metric | Calculation | Owner | Source | Target |
|:---|:---|:---|:---|:---|
| **Onboarding Completion** | `Active Creators` / `Total Founders Staged` (50) | CROWN | `creators` table `status='active'` | 50/50 (100%) |
| **Profile Completion Rate** | Creators with non-null `avatar_url` + `username` | CURSOR / CROWN | `creators` table | > 90% |
| **Founding 50 Acceptance Rate** | `waitlist` where `type='creator'` AND `status='accepted'` | VERA / CROWN | `waitlist` table | Track daily |
| **Time to Onboard** | Average time from `application_submitted` to `status='active'` | CROWN | `waitlist` + `creators` tables | < 48 hours |

---

## III. CORE ENGAGEMENT

| KPI / Metric | Calculation | Owner | Source | Target |
|:---|:---|:---|:---|:---|
| **Daily Active Creators (DAC)** | Unique Creators triggering *any* app event daily | BEACON | *Future events* | TBD |
| **Creator Upload Rate** | Videos uploaded per creator per week | BEACON | `Episode` table | TBD |
| **Content Engagement** | Views / Likes / Comments per episode | BEACON | `Interaction` table | TBD |

---

## IV. TRAFFIC & ACQUISITION

| KPI / Metric | Calculation | Owner | Source | Target |
|:---|:---|:---|:---|:---|
| **Total Page Views** | Count of `page_view` events | NOVA | `page_view` | Track daily |
| **Traffic by Source** | `page_view` grouped by `referrer` | NOVA | `page_view` | Track daily |
| **UTM Campaign Performance** | `page_view` grouped by `utm_campaign` | NOVA | `page_view` | Track daily |
| **CAC (Cost Per Acquisition)** | Ad spend / `application_submitted` | NOVA | Ad platform + `application_submitted` | < $50 |

---

## Dashboard Views

### Daily View
- Page views (last 7 days)
- CTA clicks (last 7 days)
- Applications submitted (last 7 days)
- Conversion rate (last 7 days)

### Weekly View
- Funnel health metrics
- Founding 50 progress
- Traffic source breakdown
- Top performing campaigns

### Monthly View
- Growth trends
- Cohort analysis
- Revenue metrics (when live)

---

## V. AVA PRO SUBSCRIPTION (approved June 2026)

**Canonical targets:** `docs/AI_EXEC_SALES_GOALS.md`

| KPI / Metric | Calculation | Owner | Target (M1) |
|:---|:---|:---|:---|
| **Gross MRR** | Sum active Pro subs × plan price (normalized monthly) | LEDGER / ATLAS | $1,000 |
| **Paid subs (cumulative)** | Active `subscription_tier = 'pro'` | ATLAS | 120–150 |
| **Founding 50 conversion** | F50 paid / 50 | CROWN | ≥ 90% by day 30 |
| **Free → Pro (30-day)** | New Pro / users hitting lesson 13 gate | BEACON | 6% |
| **Monthly churn** | Churned subs / start-of-month subs | ATLAS | < 6% |
| **Annual plan mix** | Annual subs / new subs | LEDGER | 60–65% |
| **Founding cap remaining** | 500 − founding subs | LEDGER | Track daily |

---

**Generated:** December 14, 2024  
**Version:** v1.0  
**Status:** Production Ready

