# 📊 Analytics Event Schema v1.0

**Author:** GEMI — VP Data & Infrastructure / CMO  
**Status:** 🟢 LOCKED  
**Implementation:** COPILOT / CURSOR  
**Tracking Provider:** PostHog / Supabase Analytics / Google Analytics

---

## Event Taxonomy

### 1. Page View
**Event:** `page_view`  
**Description:** User lands on landing page  
**Properties:**
- `path`: `/landing`
- `referrer`: `tiktok | linkedin | instagram | direct`
- `utm_campaign`: `founding_50_blitz` (or from URL params)
- `timestamp`: ISO 8601 timestamp

---

### 2. CTA Click (Primary)
**Event:** `click_cta_primary`  
**Description:** User clicks a main call-to-action button  
**Properties:**
- `label`: `apply_as_creator | join_waitlist | watch_manifesto`
- `location`: `hero_section | nav_bar | footer`
- `timestamp`: ISO 8601 timestamp

---

### 3. Funnel Start
**Event:** `funnel_start`  
**Description:** User opens the application modal/form  
**Properties:**
- `funnel_type`: `creator_application | user_waitlist`
- `timestamp`: ISO 8601 timestamp

---

### 4. Form Interaction
**Event:** `form_interaction`  
**Description:** User interacts with form fields (measures drop-off)  
**Properties:**
- `field_name`: `social_handle | email | name | city`
- `status`: `focused | completed`
- `timestamp`: ISO 8601 timestamp

---

### 5. Application Submitted ⭐ CRITICAL CONVERSION EVENT
**Event:** `application_submitted`  
**Description:** User successfully submits application form  
**Properties:**
- `is_founding_50_candidate`: `true | false`
- `platform_primary`: `instagram | tiktok | youtube | other | none`
- `handle_provided`: `true | false`
- `user_email`: User's email (hashed in production)
- `funnel_type`: `creator | user`
- `timestamp`: ISO 8601 timestamp

---

## Funnel Visualization

### Expected Funnel Metrics:
1. **Impressions:** Landing Page Views (`page_view`)
2. **Intent:** CTA Clicks (`click_cta_primary` with `apply_as_creator`)
3. **Engagement:** Form Interactions (`form_interaction` with `focused`)
4. **Conversion:** Applications Submitted (`application_submitted`)

### Projected Conversion Rate: 4.5%
- 10,000 Impressions
- 2,500 Intent (25%)
- 1,200 Engagement (48% of intent)
- 450 Conversion (37.5% of engagement)

---

## Implementation Status

✅ **Event Schema:** Defined and locked  
✅ **Landing Page:** Events implemented  
✅ **Backend Integration:** Ready for Supabase Analytics  
🟡 **Dashboard:** ATLAS to implement visualization

---

**Generated:** December 14, 2024  
**Version:** v1.0  
**Status:** Production Ready

