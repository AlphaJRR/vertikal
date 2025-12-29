# 📊 ATLAS — KPI + Event Tracking Starter

**Author:** ATLAS — Head of Analytics & Insights  
**Status:** 🟢 READY  
**Purpose:** Track key metrics for Jan 1 launch

---

## 🎯 CORE KPIs

### Landing Page Metrics
- **Landing Views:** Total page views
- **Unique Visitors:** Distinct users
- **Bounce Rate:** % who leave without interaction
- **Time on Page:** Average session duration

### Video Engagement
- **About Video Plays:** Total plays of About video
- **Founding 50 Video Plays:** Total plays of Founding 50 video
- **Video Completion Rate:** % who watch full video
- **Video Click-Through:** % who click CTA after video

### Conversion Funnel
- **Signup Starts:** Users who begin signup process
- **Signup Completes:** Users who finish signup
- **Creator Applications Submitted:** Total applications
- **Application Completion Rate:** % who complete application

### Creator Metrics
- **Approved Creators:** Total approved applications
- **Activated Creators:** Creators with complete profile + first action
- **Activation Rate:** % of approved who activate
- **Time to Activation:** Average days from approval to activation

---

## 📈 EVENT TRACKING SCHEMA

### Page View Events
```javascript
{
  event: 'page_view',
  properties: {
    path: '/landing',
    referrer: 'direct|social|search',
    utm_source: 'instagram|tiktok|linkedin',
    utm_campaign: 'founding_50_blitz'
  }
}
```

### Video Play Events
```javascript
{
  event: 'video_play',
  properties: {
    video_type: 'about|founding50',
    video_id: 'Bz_ibyq0ATs',
    play_position: 0,
    duration: 120
  }
}
```

### Conversion Events
```javascript
{
  event: 'signup_started',
  properties: {
    type: 'creator|user',
    source: 'landing_page|video|cta'
  }
}

{
  event: 'signup_completed',
  properties: {
    type: 'creator|user',
    user_id: 'uuid',
    handle: 'username'
  }
}

{
  event: 'application_submitted',
  properties: {
    creator_id: 'uuid',
    category: 'series|docs|reality',
    has_content: true|false
  }
}

{
  event: 'creator_approved',
  properties: {
    creator_id: 'uuid',
    application_id: 'uuid',
    approved_by: 'admin_id'
  }
}

{
  event: 'creator_activated',
  properties: {
    creator_id: 'uuid',
    days_to_activate: 3,
    first_action: 'post|comment|upload'
  }
}
```

---

## 📊 DASHBOARD STRUCTURE

### Daily Metrics
- Landing views
- Video plays
- Signups
- Applications
- Approvals
- Activations

### Weekly Metrics
- Conversion rates (views → signups → applications)
- Activation rate (approved → activated)
- Average time to activation
- Top traffic sources

### Monthly Metrics
- Total creators onboarded
- Total applications received
- Approval rate
- Retention rate (30-day active)

---

## 🔗 INTEGRATION POINTS

### Analytics Tools
- **Google Analytics:** Page views, events
- **Posthog:** User behavior, funnels
- **Supabase Analytics:** Database queries, performance

### Data Sources
- **Frontend Events:** JavaScript event tracking
- **Backend Events:** API call logging
- **Database Events:** Application status changes

---

**Generated:** December 15, 2024  
**Version:** v1.0  
**Status:** Ready for Implementation

