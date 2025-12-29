# 🔗 ZAPIER → AIRTABLE INTEGRATION SETUP

**Status:** ✅ **CODE INTEGRATED**  
**File:** `public/index.html`  
**Function:** `logSignupToZapier()`

---

## ✅ IMPLEMENTATION COMPLETE

### Code Added
- ✅ Zapier logging function (`logSignupToZapier`)
- ✅ Integrated into `handleViewerSignup()` - logs role: 'viewer'
- ✅ Integrated into `handleCreatorSignup()` - logs role: 'creator'
- ✅ Captures UTM parameters from URL
- ✅ Silent fail (doesn't block signup if Zapier is down)

### Payload Structure
```json
{
  "email": "user@example.com",
  "user_id": "uuid-from-supabase",
  "role": "viewer" | "creator",
  "signed_up_at": "2025-12-28T23:00:00.000Z",
  "source": "vertikalapp.com",
  "utm_source": "google" | "",
  "utm_campaign": "founding50" | ""
}
```

---

## 🔧 ZAPIER SETUP (REQUIRED)

### Step 1: Create Zapier Webhook

1. **Go to:** https://zapier.com/apps/webhooks/integrations
2. **Create Zap:**
   - **Trigger:** Webhooks by Zapier → Catch Hook
   - **Action:** Airtable → Create Record

### Step 2: Configure Filter (IMPORTANT)

**Add Filter step between Trigger and Airtable:**

- **Condition:** Only continue if...
- **Field:** `email` (Text)
- **Operator:** Exists
- **Value:** (leave empty)

**Why:** Prevents empty test hits or random webhooks from filling Airtable.

### Step 3: Configure Airtable Action

**Field Mapping:**

| Airtable Field | Source Field | Type |
|----------------|--------------|------|
| Email | `email` | Email |
| User ID | `user_id` | Text |
| Role | `role` | Text |
| Signed Up At | `signed_up_at` | Date/Time |
| Source | `source` | Text |
| UTM Source | `utm_source` | Text |
| UTM Campaign | `utm_campaign` | Text |

### Step 4: Get Webhook URL

1. **Test the Zap** (Zapier will provide a test webhook URL)
2. **Copy the webhook URL**
3. **Update code:** Replace `PASTE_YOUR_ZAPIER_WEBHOOK_URL_HERE` in `public/index.html`

---

## 📝 CODE LOCATION

**Function:** Lines ~1363-1383 in `public/index.html`

**Called From:**
- `handleViewerSignup()` - Line ~1407 (after successful signup)
- `handleCreatorSignup()` - Line ~1458 (after successful signup)

**Where Role is Captured:**
- **Viewer:** `role: 'viewer'` (line 1397)
- **Creator:** `role: 'creator'` (line 1446)

---

## ✅ VERIFICATION CHECKLIST

After setting up Zapier:

- [ ] Zapier webhook URL added to code (replace placeholder)
- [ ] Filter step added (email must exist)
- [ ] Airtable fields mapped correctly
- [ ] Test signup as viewer → record appears in Airtable
- [ ] Test signup as creator → record appears in Airtable
- [ ] UTM parameters captured (test with `?utm_source=test&utm_campaign=test`)
- [ ] Empty email attempts filtered out (no junk records)

---

## 🧪 TESTING

### Test Viewer Signup
1. Fill viewer form
2. Submit
3. Check Airtable → record should appear with `role: "viewer"`

### Test Creator Signup
1. Fill creator form
2. Submit
3. Check Airtable → record should appear with `role: "creator"`

### Test UTM Parameters
1. Visit: `vertikalapp.com?utm_source=google&utm_campaign=founding50`
2. Sign up
3. Check Airtable → `utm_source` and `utm_campaign` should be populated

### Test Filter
1. Send test webhook without email field
2. Verify → No record created in Airtable (filter blocked it)

---

## 🔒 SECURITY NOTES

- ✅ Webhook URL is public (acceptable for signup tracking)
- ✅ No sensitive data in payload (only email, user_id, role)
- ✅ Silent fail (doesn't expose errors to users)
- ✅ Filter prevents junk data

---

## 📊 EXPECTED AIRTABLE RECORDS

**After signup, each record contains:**

| Field | Example Value |
|-------|---------------|
| Email | `user@example.com` |
| User ID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| Role | `viewer` or `creator` |
| Signed Up At | `2025-12-28 23:00:00` |
| Source | `vertikalapp.com` |
| UTM Source | `google` (or empty) |
| UTM Campaign | `founding50` (or empty) |

---

**Status:** ✅ **READY FOR ZAPIER CONFIGURATION**  
**Next:** Add webhook URL to code, test signup flow

