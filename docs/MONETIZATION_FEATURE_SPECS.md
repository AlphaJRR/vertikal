# 📝 MONETIZATION FEATURE SPECS

**Author:** BEACON — Product Manager (Creator Tools)  
**Status:** 🟢 LOCKED  
**Purpose:** Implement LEDGER's revenue model for Jan 31 milestone  
**Architecture:** Claude's revenue_splits schema

---

## 🎯 OVERVIEW

**Objective:** Enable creators to track earnings and manage payouts, fulfilling the "Get Paid from Day 1" promise (VERA).

**Priority:** P0 for Jan 31 milestone  
**Engineering Owner:** CURSOR (Backend Integration)

---

## 💰 FEATURE 1: PAYOUT SETUP & STATUS

### Feature Name
**Payout Configuration Widget**

### Priority
**P0 (Critical for Jan 31)**

### Requirements

#### 1. Payout Account Connection
- **Action:** Connect external payout service (Stripe/similar)
- **Backend Field:** `payout_account_id` (Claude's schema)
- **Security:** Secure OAuth flow, encrypted storage
- **Validation:** Verify account before enabling payouts

#### 2. Payout Status Display
**Status States:**
- ✅ **Connected:** Account verified, payouts enabled
- ⏳ **Verification Pending:** Account linked, awaiting verification
- ❌ **Not Connected:** No payout account linked
- 🔒 **Suspended:** Account suspended (admin action)

**Display Information:**
- Current status badge
- Next payout date (e.g., "Next Payout: Jan 31")
- Payout frequency (monthly, bi-weekly)
- Minimum payout threshold

#### 3. CROWN Integration
**Step III Checklist Item:**
- **If Not Connected:** Display "ACTION REQUIRED: Connect your Payout Account"
- **If Connected:** Display "✅ Payout Account Connected"
- **Link:** Direct to payout setup flow

### UI Components

#### Payout Configuration Widget
```typescript
interface PayoutWidgetProps {
  creatorId: string;
  payoutStatus: 'connected' | 'pending' | 'not_connected' | 'suspended';
  nextPayoutDate?: Date;
  payoutAccountId?: string;
}
```

**Visual Design:**
- Status badge (color-coded)
- "Connect Account" button (if not connected)
- "Manage Account" link (if connected)
- Next payout countdown timer

### Backend Endpoints Required

#### GET /api/creator/payout/status
**Response:**
```typescript
{
  status: 'connected' | 'pending' | 'not_connected' | 'suspended';
  payoutAccountId: string | null;
  nextPayoutDate: string | null; // ISO date
  payoutFrequency: 'monthly' | 'bi_weekly';
  minimumThreshold: number; // e.g., $50
}
```

#### POST /api/creator/payout/connect
**Request:**
```typescript
{
  provider: 'stripe' | 'paypal' | 'bank';
  accountToken: string; // OAuth token or account identifier
}
```

**Response:**
```typescript
{
  success: boolean;
  status: 'connected' | 'pending';
  payoutAccountId: string;
}
```

---

## 💵 FEATURE 2: EARNINGS DASHBOARD

### Feature Name
**Real-time Revenue Tracker**

### Priority
**P0 (Critical for Jan 31)**

### Requirements

#### 1. Total Earnings Display
- **Metric:** Total lifetime earnings
- **Format:** Currency (USD)
- **Update:** Real-time (via WebSocket or polling)
- **Calculation:** Sum of all revenue sources

#### 2. Next Payout Projection
- **Metric:** Estimated payout amount
- **Calculation:** Earnings since last payout - platform fee (20%)
- **Display:** "Next Payout: $X.XX (Jan 31)"
- **Update:** Real-time as earnings accrue

#### 3. Revenue Breakdown
**Revenue Sources (aligned with Claude's Revenue Architecture):**
- **Subscription Share:** Revenue from creator subscriptions
- **Tipping:** Direct tips from viewers
- **Ad Revenue Share:** Platform ad revenue split
- **Content Unlocks:** Pay-per-view content revenue

**Display Format:**
- Pie chart (visual breakdown)
- Table (detailed breakdown with percentages)
- Time series graph (earnings over time)

### UI Components

#### Earnings Dashboard
```typescript
interface EarningsDashboardProps {
  creatorId: string;
  totalEarnings: number;
  nextPayoutProjection: number;
  revenueBreakdown: {
    subscriptions: number;
    tips: number;
    adRevenue: number;
    contentUnlocks: number;
  };
  earningsHistory: Array<{
    date: string;
    amount: number;
    source: string;
  }>;
}
```

**Visual Design:**
- Large total earnings display (prominent)
- Next payout card (highlighted)
- Revenue breakdown chart (interactive)
- Earnings history graph (time series)

### Backend Endpoints Required

#### GET /api/creator/earnings
**Response:**
```typescript
{
  totalEarnings: number;
  nextPayoutProjection: number;
  revenueBreakdown: {
    subscriptions: number;
    tips: number;
    adRevenue: number;
    contentUnlocks: number;
  };
  earningsHistory: Array<{
    date: string; // ISO date
    amount: number;
    source: 'subscription' | 'tip' | 'ad_revenue' | 'content_unlock';
  }>;
}
```

**Data Source:** Claude's Revenue Calculation Engine

#### GET /api/creator/earnings/history
**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `source`: Optional filter by revenue source

**Response:**
```typescript
{
  earnings: Array<{
    date: string;
    amount: number;
    source: string;
    description: string;
  }>;
  total: number;
}
```

---

## 🔄 REVENUE CALCULATION LOGIC

### Platform Fee Structure
- **Creator Share:** 80%
- **Platform Share:** 20%

### Calculation Example
```
Subscription Revenue: $100
Platform Fee (20%): $20
Creator Earnings: $80
```

### Real-time Updates
- **Event-Driven:** Update on transaction completion
- **Polling:** Refresh every 5 minutes (fallback)
- **WebSocket:** Real-time updates (preferred)

---

## 🔒 SECURITY REQUIREMENTS

### Payout Account
- **Encryption:** Store payout account IDs encrypted
- **OAuth:** Use secure OAuth flow for account connection
- **Verification:** Require account verification before payouts
- **Audit:** Log all payout account changes

### Earnings Data
- **Authorization:** Only creator can view their earnings
- **Rate Limiting:** Prevent excessive API calls
- **Data Privacy:** No PII in earnings data

---

## 📊 SUCCESS METRICS

### Payout Setup
- **Connection Rate:** > 80% of F50 creators connect payout account
- **Verification Time:** < 48 hours average
- **Error Rate:** < 5% connection failures

### Earnings Dashboard
- **Usage Rate:** > 90% of creators view dashboard weekly
- **Data Accuracy:** 100% accuracy (no discrepancies)
- **Load Time:** < 2 seconds dashboard load

---

## 🎯 INTEGRATION POINTS

### CROWN (Creator Success)
- **Step III:** Payout account connection checklist
- **Support:** Help creators connect accounts
- **Monitoring:** Track connection rates

### LEDGER (Business)
- **Revenue Model:** Validate 80/20 split
- **Payout Processing:** Coordinate payout execution
- **Financial Reporting:** Aggregate earnings data

### ATLAS (Analytics)
- **Earnings Tracking:** Monitor creator earnings trends
- **Payout Metrics:** Track payout completion rates
- **Revenue Analytics:** Aggregate platform revenue

---

**Generated:** December 14, 2024  
**Version:** v1.0  
**Status:** Locked for Jan 31 Implementation

