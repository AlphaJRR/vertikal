# ZAPIER — VERTIKAL MONITORING & ALERTS (AGENT MODE)

**ROLE:** Automation Engineer  
**MISSION:** Build monitoring and alert workflows for Vertikal sites. Zapier cannot deploy code or fix Cloudflare, but it CAN monitor and alert you when things break.

---

## ⚠️ LIMITATIONS (WHAT ZAPIER CANNOT DO)

- ❌ Deploy to Cloudflare Pages
- ❌ Edit code or HTML files
- ❌ Change Cloudflare settings
- ❌ Fix DNS or routing issues

**Zapier CAN:**
- ✅ Monitor site uptime
- ✅ Alert on errors
- ✅ Log signups to Airtable
- ✅ Send notifications (email/Slack/SMS)

---

## ✅ BUILD THESE ZAPS (HIGH-IMPACT)

### **ZAP 1: Site Uptime Monitor**

**Trigger:** Schedule (every 6 hours)

**Actions:**
1. **HTTP Request** → Ping these URLs:
   - https://vertikalapp.com
   - https://creators.vertikalapp.com
   - https://investors.vertikalapp.com
   - https://networks.vertikalapp.com

2. **Filter:** Only continue if HTTP status ≠ 200

3. **Email** → Send alert:
   - **Subject:** 🚨 Vertikal Site Down: {{site_url}}
   - **Body:** Site returned status {{status_code}} at {{timestamp}}

4. **Slack** → Send message (if connected):
   - **Channel:** #alerts
   - **Message:** 🚨 {{site_url}} is DOWN ({{status_code}})

---

### **ZAP 2: Signup Logging (Already Configured)**

**Status:** ✅ Already integrated in `public/index.html`

**What it does:**
- Captures signups via webhook
- Logs to Airtable (email, role, user_id, timestamp, UTM params)
- Filters empty emails

**No action needed** — already working.

---

### **ZAP 3: Daily Health Check Email**

**Trigger:** Schedule (daily at 9 AM)

**Actions:**
1. **HTTP Request** → Check all Vertikal URLs (same as Zap 1)

2. **Airtable** → Count records from "Signups" table (last 24 hours)

3. **Email** → Send daily report:
   - **Subject:** 📊 Vertikal Daily Health Check
   - **Body:**
     ```
     Site Status:
     - vertikalapp.com: {{status_1}}
     - creators: {{status_2}}
     - investors: {{status_3}}
     - networks: {{status_4}}
     
     Signups (last 24h): {{signup_count}}
     ```

---

### **ZAP 4: GitHub Deploy Notifications**

**Trigger:** GitHub → New Push (if you deploy via Git)

**Actions:**
1. **Filter:** Only continue if branch = `main`

2. **Email** → Send notification:
   - **Subject:** 🚀 Vertikal Deployed: {{commit_message}}
   - **Body:** Commit {{commit_hash}} by {{author}} pushed to main

3. **Slack** → Notify team (optional)

---

## 📋 SETUP INSTRUCTIONS

### **For Zap 1 (Uptime Monitor):**

1. **Create Zap:**
   - Trigger: Schedule by Zapier → Every 6 hours
   - Action: Webhooks by Zapier → POST (to check URLs)

2. **Add HTTP Request step:**
   - Method: GET
   - URL: https://vertikalapp.com
   - Test → Check response status

3. **Add Filter:**
   - Condition: Status Code ≠ 200
   - If true → Continue

4. **Add Email action:**
   - Configure alert email

5. **Repeat for other URLs** (or use a loop if Zapier supports it)

---

### **For Zap 3 (Daily Health Check):**

1. **Trigger:** Schedule → Daily at 9 AM

2. **Action 1:** HTTP Request → Check vertikalapp.com
   - Store status in variable

3. **Action 2-4:** Repeat for creators/investors/networks

4. **Action 5:** Airtable → Find Records
   - Table: Signups
   - Filter: Created Date = Last 24 hours
   - Count results

5. **Action 6:** Email → Send report with all data

---

## 🎯 WHAT THIS ACHIEVES

**After setup:**
- ✅ You get instant alerts if any site goes down
- ✅ Daily health report in your inbox
- ✅ Signup tracking (already working)
- ✅ Deploy notifications (if using Git)

**You still need Cursor to fix the Cloudflare deployment issue** (use the Cursor prompt I provided).

---

## 📝 NEXT STEPS

1. **Build Zap 1** (uptime monitor) — highest priority
2. **Build Zap 3** (daily health check) — nice to have
3. **Use Cursor prompt** to fix Cloudflare Pages deployment
4. **Test:** Trigger a test alert to confirm notifications work

---

**Zapier cannot fix Cloudflare, but it CAN alert you when things break. Build these Zaps, then use Cursor to fix the actual deployment issue.**

