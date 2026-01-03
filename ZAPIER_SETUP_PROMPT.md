# 🔗 ZAPIER SETUP PROMPT - VERTIKAL Application Forms

## 📋 SETUP INSTRUCTIONS FOR ZAPIER

Copy this entire prompt into Zapier when creating your webhook:

---

## **ZAPIER WEBHOOK CONFIGURATION**

**Purpose:** Receive application form submissions from VERTIKAL website and mobile app

**Form Types:**
1. **Creator Application** (`type: "apply"`) - `/apply/` page
2. **Network Application** (`type: "apply"`, `role: "network"`) - Networks page
3. **Investor Application** (`type: "invest"`) - Investors page
4. **Waitlist Signup** (`type: "waitlist"`) - Beta page
5. **Contact Form** (`type: "contact"`) - Contact forms

---

## **EXPECTED WEBHOOK PAYLOAD**

```json
{
  "type": "apply",
  "sourcePage": "https://vertikalapp.com/apply/",
  "role": "creator",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Why VERTIKAL? I want to build vertical cinema...",
  "portfolio": "https://portfolio.com/reel",
  "timestamp": "2025-01-03T15:30:00.000Z",
  "extra": {
    "portfolio": "https://portfolio.com/reel"
  }
}
```

---

## **FIELD DESCRIPTIONS**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Form type: `apply`, `invest`, `waitlist`, `contact` |
| `sourcePage` | string | Yes | URL where form was submitted |
| `role` | string | Yes | User role: `creator`, `network`, `investor`, `viewer` |
| `name` | string | Yes | Full name of applicant |
| `email` | string | Yes | Email address (validated) |
| `message` | string | No | Application message / "Why VERTIKAL?" |
| `portfolio` | string | No | Portfolio/reel URL |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `extra` | object | No | Additional fields (varies by form) |

---

## **ZAPIER WORKFLOW STEPS**

### **Step 1: Webhook Trigger**
- **Trigger:** "Catch Hook" (Webhooks by Zapier)
- **Event:** "Catch Hook"
- **Name:** "VERTIKAL Application Form"
- **Copy the webhook URL** - You'll need this for the code

### **Step 2: Data Parsing (Optional)**
- **Action:** "Code by Zapier" or "Formatter"
- Parse the incoming JSON payload
- Extract fields: `name`, `email`, `role`, `message`, `portfolio`

### **Step 3: Send to Email/CRM**
**Option A - Email Notification:**
- **Action:** "Email by Zapier" or "Gmail"
- **To:** Your team email (e.g., `applications@vertikalapp.com`)
- **Subject:** `New ${role} Application: ${name}`
- **Body:** Format the application details

**Option B - Google Sheets:**
- **Action:** "Google Sheets - Create Spreadsheet Row"
- **Spreadsheet:** VERTIKAL Applications
- **Columns:** Timestamp | Type | Role | Name | Email | Message | Portfolio | Source Page

**Option C - Airtable:**
- **Action:** "Airtable - Create Record"
- **Base:** VERTIKAL Applications
- **Table:** Applications
- **Fields:** Map all fields from webhook

**Option D - Notion:**
- **Action:** "Notion - Create Page"
- **Database:** Applications Database
- **Properties:** Map all fields

### **Step 4: Auto-Reply (Optional)**
- **Action:** "Email by Zapier"
- **To:** `{{email}}` (from webhook)
- **Subject:** "Thank you for applying to VERTIKAL"
- **Body:** Confirmation email template

---

## **WEBHOOK URL PLACEMENT**

After creating the Zapier webhook, update this file:

**File:** `public/assets/js/zapierForms.js`  
**Line 6:** Replace `"PASTE_HERE"` with your Zapier webhook URL

```javascript
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/";
```

---

## **TESTING**

1. **Test Webhook:**
   - Visit: `https://vertikalapp.com/apply/`
   - Fill out form
   - Submit
   - Check Zapier dashboard for incoming webhook

2. **Verify Data:**
   - Check that all fields are captured correctly
   - Verify email notifications work
   - Confirm data appears in your CRM/spreadsheet

---

## **FORM ENDPOINTS**

| Page | URL | Form Type | Role |
|------|-----|-----------|------|
| Creator Apply | `/apply/` | `apply` | `creator` |
| Network Apply | `/networks/` | `apply` | `network` |
| Investor Apply | `/investors/` | `invest` | `investor` |
| Beta Waitlist | `/beta/` | `waitlist` | `viewer` |

---

## **MOBILE APP INTEGRATION**

The mobile app will also submit to the same webhook using the same payload format. Ensure your Zapier workflow handles both web and mobile submissions.

---

## **SECURITY NOTES**

- ✅ Email validation happens client-side
- ✅ Webhook URL should be kept private (not exposed in public repo)
- ⚠️ Consider adding rate limiting in Zapier
- ⚠️ Consider adding spam filtering (honeypot fields)

---

## **SUCCESS RESPONSE**

Zapier should return:
```json
{
  "success": true,
  "message": "Application received"
}
```

---

## **ERROR HANDLING**

If webhook fails, the form will show:
- Error message to user
- Console log for debugging
- Form data is NOT lost (can be retried)

---

**Ready to set up?** Create your Zapier webhook and paste the URL into `zapierForms.js`!

