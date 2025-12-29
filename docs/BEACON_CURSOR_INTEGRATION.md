# 🤝 BEACON-CURSOR BACKEND INTEGRATION

**Author:** BEACON → CURSOR Handoff  
**Status:** 🟢 READY FOR IMPLEMENTATION  
**Purpose:** Backend API documentation for Creator Dashboard integration

---

## 🎯 INTEGRATION OVERVIEW

**Goal:** Seamlessly extend the Creator Profile (built by CURSOR) with monetization and analytics features.

**Architecture:** RESTful API endpoints, real-time updates via WebSocket (optional)

---

## 💰 MONETIZATION ENDPOINTS

### GET /api/creator/payout/status
**Purpose:** Get creator's payout account status

**Authentication:** Required (JWT token)

**Response:**
```typescript
{
  status: 'connected' | 'pending' | 'not_connected' | 'suspended';
  payoutAccountId: string | null;
  nextPayoutDate: string | null; // ISO date
  payoutFrequency: 'monthly' | 'bi_weekly';
  minimumThreshold: number; // e.g., 50 (dollars)
  lastPayoutDate: string | null; // ISO date
  lastPayoutAmount: number | null;
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Creator not found
- `500`: Server error

---

### POST /api/creator/payout/connect
**Purpose:** Connect payout account (Stripe/PayPal/Bank)

**Authentication:** Required (JWT token)

**Request Body:**
```typescript
{
  provider: 'stripe' | 'paypal' | 'bank';
  accountToken: string; // OAuth token or account identifier
  accountDetails?: {
    // Provider-specific details
    email?: string;
    accountNumber?: string;
    routingNumber?: string;
  };
}
```

**Response:**
```typescript
{
  success: boolean;
  status: 'connected' | 'pending';
  payoutAccountId: string;
  verificationRequired: boolean;
  verificationUrl?: string; // If verification required
}
```

**Error Responses:**
- `400`: Invalid request (missing fields, invalid provider)
- `401`: Unauthorized
- `409`: Account already connected
- `500`: Server error

---

### GET /api/creator/earnings
**Purpose:** Get creator's earnings summary

**Authentication:** Required (JWT token)

**Query Parameters:**
- `period`: `7d` | `30d` | `all` (optional, default: `all`)

**Response:**
```typescript
{
  totalEarnings: number; // Lifetime total
  nextPayoutProjection: number; // Estimated next payout
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
    description: string;
  }>;
  period: {
    start: string; // ISO date
    end: string; // ISO date
  };
}
```

**Data Source:** Claude's Revenue Calculation Engine

---

### GET /api/creator/earnings/history
**Purpose:** Get detailed earnings history

**Authentication:** Required (JWT token)

**Query Parameters:**
- `startDate`: ISO date string (required)
- `endDate`: ISO date string (required)
- `source`: `subscription` | `tip` | `ad_revenue` | `content_unlock` (optional)
- `limit`: number (optional, default: 100)
- `offset`: number (optional, default: 0)

**Response:**
```typescript
{
  earnings: Array<{
    id: string;
    date: string; // ISO date
    amount: number;
    source: 'subscription' | 'tip' | 'ad_revenue' | 'content_unlock';
    description: string;
    contentId?: string; // If related to specific content
    userId?: string; // If from specific user (tipper)
  }>;
  total: number;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
```

---

## 📊 ANALYTICS ENDPOINTS

### GET /api/creator/analytics/watch-time
**Purpose:** Get total watch time metrics

**Authentication:** Required (JWT token)

**Query Parameters:**
- `period`: `7d` | `30d` | `all` (default: `30d`)

**Response:**
```typescript
{
  totalWatchTime: number; // Hours
  averageWatchTime: number; // Hours per day
  trend: {
    change: number; // Percentage change vs previous period
    direction: 'up' | 'down' | 'stable';
  };
  timeSeries: Array<{
    date: string; // ISO date
    watchTime: number; // Hours
  }>;
  period: {
    start: string;
    end: string;
  };
}
```

**Data Source:** `video_playback` duration events (GEMI/ATLAS)

---

### GET /api/creator/analytics/top-content
**Purpose:** Get top performing content

**Authentication:** Required (JWT token)

**Query Parameters:**
- `period`: `7d` | `30d` | `all` (default: `30d`)
- `metric`: `watch_time` | `completions` | `views` (default: `watch_time`)
- `limit`: number (optional, default: 10)

**Response:**
```typescript
{
  content: Array<{
    contentId: string;
    title: string;
    thumbnailUrl: string;
    watchTime: number; // Hours
    completionRate: number; // Percentage
    views: number;
    engagementRate: number; // Percentage
    likes: number;
    comments: number;
    shares: number;
  }>;
  period: {
    start: string;
    end: string;
  };
}
```

**Data Source:** `video_completion` events (GEMI/ATLAS)

---

### GET /api/creator/analytics/demographics
**Purpose:** Get audience demographics

**Authentication:** Required (JWT token)

**Query Parameters:**
- `period`: `7d` | `30d` | `all` (default: `30d`)

**Response:**
```typescript
{
  geographic: Array<{
    country: string;
    countryCode: string;
    percentage: number;
    viewers: number;
  }>;
  age: Array<{
    range: string; // e.g., "18-24"
    percentage: number;
    viewers: number;
  }>;
  gender: Array<{
    gender: string; // "male" | "female" | "other" | "unknown"
    percentage: number;
    viewers: number;
  }>;
  devices: Array<{
    device: string; // "mobile" | "desktop" | "tv" | "tablet"
    percentage: number;
    viewers: number;
  }>;
  period: {
    start: string;
    end: string;
  };
}
```

**Data Source:** User Auth / Geolocation data (GEMI/ATLAS)

---

### GET /api/creator/analytics/engagement
**Purpose:** Get engagement metrics

**Authentication:** Required (JWT token)

**Query Parameters:**
- `period`: `7d` | `30d` | `all` (default: `30d`)

**Response:**
```typescript
{
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  newSubscriptions: number;
  engagementRate: number; // Percentage
  timeSeries: Array<{
    date: string; // ISO date
    likes: number;
    comments: number;
    shares: number;
    subscriptions: number;
  }>;
  period: {
    start: string;
    end: string;
  };
}
```

**Data Source:** `interaction` events (GEMI/ATLAS)

---

### GET /api/creator/analytics/performance-trend
**Purpose:** Get content performance over time

**Authentication:** Required (JWT token)

**Query Parameters:**
- `period`: `7d` | `30d` | `all` (default: `30d`)
- `metric`: `views` | `watch_time` | `completion` (default: `views`)

**Response:**
```typescript
{
  metric: string;
  timeSeries: Array<{
    date: string; // ISO date
    value: number;
  }>;
  trend: {
    change: number; // Percentage change
    direction: 'up' | 'down' | 'stable';
  };
  period: {
    start: string;
    end: string;
  };
}
```

---

### GET /api/creator/analytics/retention
**Purpose:** Get audience retention data

**Authentication:** Required (JWT token)

**Query Parameters:**
- `contentId`: string (optional, if not provided, aggregate all content)
- `period`: `7d` | `30d` | `all` (default: `30d`)

**Response:**
```typescript
{
  averageWatchDuration: number; // Minutes
  averageCompletionRate: number; // Percentage
  dropOffPoints: Array<{
    timestamp: number; // Seconds into video
    percentage: number; // Percentage of viewers who dropped
  }>;
  rewatchRate: number; // Percentage
  bingeWatchRate: number; // Percentage
  contentId?: string;
  period: {
    start: string;
    end: string;
  };
}
```

**Data Source:** `video_playback` duration tracking

---

## 🔄 REAL-TIME UPDATES (OPTIONAL)

### WebSocket Endpoint
```
WS /api/creator/analytics/live
```

**Purpose:** Real-time earnings and engagement updates

**Authentication:** JWT token in query parameter

**Message Format:**
```typescript
{
  type: 'earnings_update' | 'engagement_update' | 'view_update';
  data: {
    // Type-specific data
  };
  timestamp: string; // ISO timestamp
}
```

---

## 🔒 SECURITY REQUIREMENTS

### Authentication
- All endpoints require JWT token
- Token must include creator ID
- Validate creator owns the data being accessed

### Authorization
- Creator can only access their own data
- Admin endpoints separate (not documented here)

### Rate Limiting
- **Standard:** 100 requests/minute per creator
- **Analytics:** 20 requests/minute per creator
- **Payout:** 10 requests/minute per creator

### Data Privacy
- No PII in analytics responses
- Anonymize user data in demographics
- Encrypt payout account information

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Payout System
- [ ] Implement `GET /api/creator/payout/status`
- [ ] Implement `POST /api/creator/payout/connect`
- [ ] Integrate with Stripe/PayPal OAuth
- [ ] Add payout account to database schema
- [ ] Create payout status widget component

### Phase 2: Earnings Dashboard
- [ ] Implement `GET /api/creator/earnings`
- [ ] Implement `GET /api/creator/earnings/history`
- [ ] Connect to Claude's Revenue Calculation Engine
- [ ] Create earnings dashboard component
- [ ] Add real-time updates (polling or WebSocket)

### Phase 3: Analytics Dashboard
- [ ] Implement analytics endpoints
- [ ] Connect to GEMI/ATLAS event data
- [ ] Create analytics dashboard components
- [ ] Add data visualization (charts, graphs)
- [ ] Implement caching for performance

### Phase 4: Integration
- [ ] Integrate with existing Creator Profile
- [ ] Add navigation to dashboard sections
- [ ] Test end-to-end flows
- [ ] Performance optimization
- [ ] Security audit

---

## 🎯 SUCCESS CRITERIA

### Performance
- **API Response Time:** < 500ms (p95)
- **Dashboard Load Time:** < 2 seconds
- **Real-time Update Latency:** < 5 seconds

### Reliability
- **Uptime:** > 99.9%
- **Error Rate:** < 0.1%
- **Data Accuracy:** 100%

### Security
- **Zero Data Breaches:** Payout account security
- **Rate Limit Compliance:** 100% enforcement
- **Authorization:** 100% validation

---

**Generated:** December 14, 2024  
**Version:** v1.0  
**Status:** Ready for CURSOR Implementation

