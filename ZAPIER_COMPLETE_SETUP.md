# ⚡ ZAPIER — COMPLETE AUTOMATION SETUP FOR VERTIKAL

**Status:** ✅ Signup logging already integrated in code  
**Next:** Build these 3 Zaps + Cloudflare webhook setup

---

## ✅ WHAT'S ALREADY DONE

**Signup Webhook Logging:**
- ✅ `logSignupToZapier()` function in `public/index.html`
- ✅ Integrated into viewer/creator signup handlers
- ✅ Captures: email, user_id, role, signed_up_at, source, UTM params
- ✅ Silent fail (doesn't break signup if Zapier is down)

**What you need:** Get your Zapier webhook URL and replace `PASTE_YOUR_ZAPIER_WEBHOOK_URL_HERE` in the code.

---

## 🔧 ZAP 1: SIGNUP LOGGING (ALREADY IN CODE — JUST BUILD THE ZAP)

### **STEP 1: Create the Zap**

1. **Zapier → Create Zap**
2. **Trigger:** Webhooks by Zapier → **Catch Hook**
3. **Copy the webhook URL** (looks like: `https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx`)

### **STEP 2: Add Filter (Prevent Junk Data)**

**Add Filter step between Trigger and Action:**

- **Condition:** Only continue if...
- **Field:** `email` (Text)
- **Operator:** Exists
- **Value:** (leave empty)

**Why:** Prevents empty test hits from filling Airtable.

### **STEP 3: Create Airtable Table (If Not Exists)**

**Table Name:** `Signups`

**Fields:**
- `Email` (Email)
- `User ID` (Text)
- `Role` (Single select: viewer, creator)
- `Signed Up At` (Date)
- `Source` (Text)
- `UTM Source` (Text)
- `UTM Campaign` (Text)

### **STEP 4: Map Fields in Zapier**

**Action:** Airtable → Create Record

**Field Mappings:**
- Email ← `email`
- User ID ← `user_id`
- Role ← `role`
- Signed Up At ← `signed_up_at`
- Source ← `source`
- UTM Source ← `utm_source`
- UTM Campaign ← `utm_campaign`

### **STEP 5: Update Your Code**

**In `public/index.html`, find line ~1375:**

```javascript
const ZAPIER_WEBHOOK_URL = "PASTE_YOUR_ZAPIER_WEBHOOK_URL_HERE";
```

**Replace with your actual webhook URL:**

```javascript
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_KEY";
```

### **STEP 6: Test**

1. **Turn Zap ON** in Zapier
2. **Sign up as viewer** on vertikalapp.com
3. **Check Airtable** → Record should appear within 10 seconds
4. **Sign up as creator** → Should log with role: "creator"

**✅ DONE — Signup logging is now live.**

---

## 🔧 ZAP 2: FORM SUBMISSIONS (Contact/Investor/Network Forms)

### **STEP 1: Create the Zap**

1. **Zapier → Create Zap**
2. **Trigger:** Webhooks by Zapier → **Catch Hook**
3. **Copy the webhook URL**

### **STEP 2: Add Filter**

- **Condition:** Only continue if `email` (Text) Exists

### **STEP 3: Create Airtable Table**

**Table Name:** `Form_Submissions`

**Fields:**
- `Email` (Email)
- `Name` (Text)
- `Form Type` (Single select: contact, investor, network, other)
- `Message` (Long text)
- `Submitted At` (Date)
- `Source` (Text)
- `UTM Source` (Text)
- `UTM Campaign` (Text)

### **STEP 4: Map Fields**

**Action:** Airtable → Create Record

**Field Mappings:**
- Email ← `email`
- Name ← `name`
- Form Type ← `form_type`
- Message ← `message`
- Submitted At ← `submitted_at`
- Source ← `source`
- UTM Source ← `utm_source`
- UTM Campaign ← `utm_campaign`

### **STEP 5: Add Email Alert (Optional)**

**Action 2:** Gmail → Send Email

**To:** Your email  
**Subject:** New Form Submission: {{form_type}}  
**Body:**
```
Name: {{name}}
Email: {{email}}
Form: {{form_type}}
Message: {{message}}
Source: {{source}}
```

### **STEP 6: Add JavaScript to Your Forms**

**For contact/investor/network forms, add this function:**

```javascript
async function logFormSubmission({ email, name, formType, message, source }) {
    const params = new URLSearchParams(window.location.search);
    const payload = {
        email,
        name,
        form_type: formType,
        message,
        submitted_at: new Date().toISOString(),
        source: source || window.location.hostname,
        utm_source: params.get("utm_source") || "",
        utm_campaign: params.get("utm_campaign") || ""
    };

    try {
        await fetch("YOUR_FORM_WEBHOOK_URL_HERE", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        // Silent fail
    }
}
```

**Call it after form submission:**

```javascript
// Example: Investor form submit
document.getElementById("investorForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // ... your existing form handling ...
    
    // Log to Zapier
    logFormSubmission({
        email: formData.get("email"),
        name: formData.get("name"),
        formType: "investor",
        message: formData.get("message"),
        source: "investors.vertikalapp.com"
    });
    
    // ... rest of your form logic ...
});
```

**✅ DONE — Form submissions now log to Airtable.**

---

## 🔧 ZAP 3: CLOUDFLARE DEPLOY ALERTS

### **STEP 1: Create the Zap**

1. **Zapier → Create Zap**
2. **Trigger:** Webhooks by Zapier → **Catch Hook**
3. **Copy the webhook URL**

### **STEP 2: Add Filter (Optional — Only Alert on Failures)**

**Add Filter step:**

- **Condition:** Only continue if...
- **Field:** `deployment_status` (Text)
- **Operator:** (Text) Contains
- **Value:** `failed`

**Why:** Only alert on failures (or remove filter to get all deploy notifications).

### **STEP 3: Add Email Action**

**Action:** Gmail → Send Email

**To:** Your email  
**Subject:** 🚀 Cloudflare Deploy: {{deployment_status}} — {{project_name}}  
**Body:**
```
Project: {{project_name}}
Status: {{deployment_status}}
Environment: {{environment}}
URL: {{url}}
Commit: {{commit_hash}}
Timestamp: {{timestamp}}
```

### **STEP 4: Add Slack Alert (Optional)**

**Action 2:** Slack → Send Direct Message

**To:** Your Slack user  
**Message:**
```
🚀 Cloudflare Deploy: {{deployment_status}}
Project: {{project_name}}
URL: {{url}}
```

### **STEP 5: Configure Cloudflare Pages Webhook**

**In Cloudflare Dashboard:**

1. **Go to:** Workers & Pages → Pages → [Your Project] → Settings → Webhooks
2. **Click:** Add webhook
3. **Paste:** Your Zapier webhook URL
4. **Select Events:**
   - ✅ Deployment Succeeded
   - ✅ Deployment Failed
5. **Save**

**Cloudflare will POST this payload:**

```json
{
  "project_name": "vertikalapp",
  "deployment_status": "success" | "failed",
  "environment": "production",
  "url": "https://vertikalapp.pages.dev",
  "commit_hash": "abc123...",
  "timestamp": "2025-12-29T10:30:00Z"
}
```

### **STEP 6: Test**

1. **Trigger a deploy** (push to Git or manual upload)
2. **Check Zapier** → Should receive webhook
3. **Check email** → Should receive alert

**✅ DONE — Deploy alerts are now live.**

---

## 📊 AIRTABLE SCHEMA (COMPLETE)

### **Table 1: Signups**

| Field | Type | Options |
|-------|------|---------|
| Email | Email | — |
| User ID | Text | — |
| Role | Single select | viewer, creator |
| Signed Up At | Date | — |
| Source | Text | — |
| UTM Source | Text | — |
| UTM Campaign | Text | — |

### **Table 2: Form_Submissions**

| Field | Type | Options |
|-------|------|---------|
| Email | Email | — |
| Name | Text | — |
| Form Type | Single select | contact, investor, network, other |
| Message | Long text | — |
| Submitted At | Date | — |
| Source | Text | — |
| UTM Source | Text | — |
| UTM Campaign | Text | — |

### **Table 3: Deploy_Log (Optional)**

| Field | Type | Options |
|-------|------|---------|
| Project Name | Text | — |
| Status | Single select | success, failed |
| Environment | Text | — |
| URL | URL | — |
| Commit Hash | Text | — |
| Timestamp | Date | — |

---

## 🎯 QUICK START CHECKLIST

- [ ] **Zap 1:** Build signup logging Zap → Get webhook URL → Update `public/index.html` line 1375
- [ ] **Zap 2:** Build form submission Zap → Add JavaScript to forms → Test
- [ ] **Zap 3:** Build deploy alerts Zap → Configure Cloudflare webhook → Test
- [ ] **Airtable:** Create 3 tables (Signups, Form_Submissions, Deploy_Log)
- [ ] **Test:** Sign up → Check Airtable → Submit form → Check Airtable → Deploy → Check email

---

## 🚨 TROUBLESHOOTING

### **Signup logging not working:**
- Check webhook URL is correct in code
- Check Zap is ON in Zapier
- Check Airtable table fields match exactly
- Check browser console for errors

### **Form submissions not logging:**
- Verify JavaScript function is called after form submit
- Check webhook URL is correct
- Check Zap filter (email exists) isn't blocking valid submissions

### **Deploy alerts not firing:**
- Verify Cloudflare webhook is configured correctly
- Check Zap is ON
- Test webhook manually (use curl/Postman to POST test payload)

---

## 📝 NEXT STEPS

1. **Build all 3 Zaps** (15 minutes)
2. **Update code** with webhook URLs (2 minutes)
3. **Configure Cloudflare webhook** (2 minutes)
4. **Test everything** (5 minutes)

**Total setup time:** ~25 minutes

**After setup:** Zero manual work. Signups, forms, and deploys are all automated.

---

**Status:** ✅ **READY TO BUILD**  
**Files:** `public/index.html` (signup logging already integrated)  
**Next:** Get webhook URLs from Zapier and update code

