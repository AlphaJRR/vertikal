# 🔗 ZAPIER WEBHOOK SETUP - QUICK FIX

## Current Issue

**Error:** "Form submission not configured. Please contact support."

**Cause:** Zapier webhook URL is not set in `zapierForms.js`

---

## Quick Fix Steps

### **Step 1: Get Your Zapier Webhook URL**

1. Go to [Zapier.com](https://zapier.com) and log in
2. Click **"Create Zap"** (or use existing Zap)
3. Choose **"Webhooks by Zapier"** as trigger
4. Select **"Catch Hook"**
5. Click **"Continue"**
6. Copy the **Webhook URL** (looks like: `https://hooks.zapier.com/hooks/catch/12345678/abcdefgh/`)

### **Step 2: Update zapierForms.js**

**File:** `public/assets/js/zapierForms.js`  
**Line 6:** Replace `"PASTE_HERE"` with your webhook URL

```javascript
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/";
```

### **Step 3: Commit and Push**

```bash
cd ~/Vertikal-App
git add public/assets/js/zapierForms.js
git commit -m "Add Zapier webhook URL for form submissions"
git push origin main
```

### **Step 4: Test**

1. Wait 60 seconds for Cloudflare deployment
2. Visit `https://vertikalapp.com/apply/`
3. Fill out form and submit
4. Check Zapier dashboard for incoming webhook

---

## Alternative: Use Environment Variable (Recommended)

If you want to keep the webhook URL private:

### **Option A: Netlify Environment Variable**

1. Go to Netlify dashboard → Site settings → Environment variables
2. Add: `ZAPIER_WEBHOOK_URL` = `https://hooks.zapier.com/hooks/catch/...`
3. Update `zapierForms.js`:

```javascript
const ZAPIER_WEBHOOK_URL = window.ZAPIER_WEBHOOK_URL || "PASTE_HERE";
```

4. Add to HTML pages before script tag:

```html
<script>
  window.ZAPIER_WEBHOOK_URL = "{{ZAPIER_WEBHOOK_URL}}";
</script>
```

### **Option B: Server-Side Proxy**

Create a Netlify function to proxy requests (keeps webhook URL secret):

**File:** `netlify/functions/submit-application.ts`

```typescript
export async function handler(event: any) {
  const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Submission failed' }),
    };
  }
}
```

Then update `zapierForms.js` to call `/api/submit-application` instead.

---

## Testing Your Webhook

### **Test with curl:**

```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/ \
  -H "Content-Type: application/json" \
  -d '{
    "type": "apply",
    "role": "creator",
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test submission"
  }'
```

### **Check Zapier Dashboard:**

- Go to your Zap
- Click **"Test"** or check **"Task History"**
- You should see the test data appear

---

## Expected Payload Format

Your Zapier webhook will receive:

```json
{
  "type": "apply",
  "sourcePage": "https://vertikalapp.com/apply/",
  "role": "creator",
  "name": "Joshua Roberts",
  "email": "joshuaroberts0808@gmail.com",
  "message": "make it great",
  "portfolio": "https://alphavisualartists.com",
  "timestamp": "2025-01-03T15:43:00.000Z",
  "extra": {
    "portfolio": "https://alphavisualartists.com"
  }
}
```

---

**Status:** ⚠️ Waiting for Zapier webhook URL to be added

