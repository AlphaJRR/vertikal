# 💵 FINANCIAL ASSUMPTIONS

**Author:** LEDGER — Chief Business Officer  
**Status:** 🟢 LOCKED  
**Purpose:** Inputs for ATLAS dashboard (CAC/CLV/Payback calculations)  
**Source:** Monetization model (SAGE/BEACON)

---

## 📊 KEY METRICS

| Metric | Assumption / Projection | Justification | Owner |
|:---|:---|:---|:---|
| **Average Creator Lifetime Value (CLV)** | **$15,000** (over 3 years) | Assumes Tier 2 Creator with modest audience monetization (excl. top 1%) | SAGE / BEACON |
| **Target Creator Acquisition Cost (CAC)** | **$1,500** | Must be ≤ 10% of CLV. This is NOVA's spending limit for paid acquisition | NOVA |
| **Payback Period Target** | **12 Months** | Highly efficient target. Requires high % of creators to upload content consistently | ATLAS |
| **Founding 50 Value** | **$50,000** (Soft Value) | Used to justify dedicated onboarding resources (CROWN) | CROWN |

---

## 💰 REVENUE MODEL ASSUMPTIONS

### Creator Monetization (Tier 2 Creator)
- **Average Monthly Revenue:** $400/month
- **Platform Take:** 20% ($80/month)
- **Creator Net:** $320/month
- **Annual Platform Revenue per Creator:** $960/year
- **3-Year CLV:** $2,880 (platform revenue) + $12,120 (network effects) = **$15,000**

### User Monetization (AVA Pro — approved June 2026)
- **Founding (Phase 2):** $9.99/mo · $39.99/yr — first 500 subs OR 90 days
- **Standard (Phase 3):** $14.99/mo · $49.99/yr
- **Free tier:** 12 lessons + rate calculator + invoice builder
- **Month 1 gross MRR target:** $1,000 (see `docs/AI_EXEC_SALES_GOALS.md`)
- **Net after Apple (15%):** ~85% of gross

---

## 📈 GROWTH ASSUMPTIONS

### Year 1 Targets
- **Total Creators:** 500
- **Active Creators:** 250 (50% activation rate)
- **Average Revenue per Creator:** $960/year
- **Total Platform Revenue:** $240,000/year

### Year 2 Targets
- **Total Creators:** 2,000
- **Active Creators:** 1,200 (60% activation rate)
- **Average Revenue per Creator:** $1,200/year
- **Total Platform Revenue:** $1,440,000/year

### Year 3 Targets
- **Total Creators:** 5,000
- **Active Creators:** 3,500 (70% activation rate)
- **Average Revenue per Creator:** $1,500/year
- **Total Platform Revenue:** $5,250,000/year

---

## 💸 COST ASSUMPTIONS

### Creator Acquisition Costs
- **Paid Acquisition (NOVA):** $1,500/creator (target)
- **Organic Acquisition (VERA):** $0/creator (warm outreach)
- **Founding 50 Onboarding (CROWN):** $1,000/creator (white-glove service)

### Infrastructure Costs
- **Supabase:** $25/month (starter)
- **Hosting (Netlify/Vercel):** $0/month (free tier)
- **CDN/Storage:** $50/month (estimated)
- **Total Monthly Infrastructure:** $75/month

---

## 🎯 EFFICIENCY TARGETS

### CAC/CLV Ratio
- **Target:** CAC ≤ 10% of CLV
- **Current:** $1,500 / $15,000 = **10%** ✅

### Payback Period
- **Target:** 12 months
- **Calculation:** $1,500 CAC / $960 annual revenue = **1.56 years**
- **Status:** ⚠️ Needs optimization (target: 12 months)

### Unit Economics
- **Gross Margin:** 80% (platform take)
- **Net Margin:** TBD (after infrastructure costs)
- **Break-even:** ~156 creators (at $1,500 CAC)

---

## 📋 USE CASES FOR ATLAS

### Dashboard Calculations:
1. **CAC Tracking:** Total ad spend / Creators acquired
2. **CLV Tracking:** Average revenue per creator × 3 years
3. **Payback Period:** CAC / Monthly revenue per creator
4. **ROI:** (CLV - CAC) / CAC × 100%

### Weekly Reports:
- CAC trends (should decrease over time)
- CLV trends (should increase with better retention)
- Payback period (should decrease with optimization)
- Unit economics (should improve with scale)

---

**Generated:** December 14, 2024  
**Version:** v1.0  
**Status:** Locked for Dashboard

