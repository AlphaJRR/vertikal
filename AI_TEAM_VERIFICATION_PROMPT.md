# 🔍 AI TEAM VERIFICATION PROMPT

**PURPOSE:** Double-check if all Vertikal deployment issues are resolved.

**DATE:** December 13, 2024  
**STATUS:** Post-Emergency Fix Deployment

---

## 📋 VERIFICATION CHECKLIST

### **STEP 1: VERIFY ALL SITES ARE LIVE**

Check each URL in **incognito mode** (to avoid cache issues):

| Site | URL | Expected Status | Expected Content |
|------|-----|----------------|------------------|
| Main | https://vertikalapp.com | ✅ HTTP 200 | "STOP ROTATING YOUR PHONE" hero |
| Investors | https://investors.vertikalapp.com | ✅ HTTP 200 | "PRE-SEED • $500K TARGET" + tier cards |
| Networks | https://networks.vertikalapp.com | ✅ HTTP 200 | "THE FOUNDING 50 NETWORKS" + form |
| Creators | https://creators.vertikalapp.com | ✅ HTTP 200 | "FOR DIRECTORS. NOT INFLUENCERS." |
| Beta | https://beta.vertikalapp.com | ✅ HTTP 200 | Beta landing page |

**VERIFICATION COMMAND:**
```bash
curl -I https://vertikalapp.com
curl -I https://investors.vertikalapp.com
curl -I https://networks.vertikalapp.com
curl -I https://creators.vertikalapp.com
curl -I https://beta.vertikalapp.com
```

**EXPECTED:** All should return `HTTP/2 200` or `HTTP/1.1 200 OK`

---

### **STEP 2: VERIFY CORRECT CONTENT ON EACH PAGE**

#### **A. Main Page (vertikalapp.com)**

**MUST CONTAIN:**
- ✅ Hero headline: **"STOP ROTATING YOUR PHONE"** (NOT "CINEMA ISN'T DYING. IT'S ROTATING.")
- ✅ Section: **"THE CLOSED-LOOP ECOSYSTEM"**
- ✅ Section: **"PASS THE CULTURE CHECK"** (VIBE ENGINE)
- ✅ Section: **"FEATURED ORIGINALS"** (3 vertical poster cards)
- ✅ **MODAL SIGNUP** (not inline signup cards)
- ✅ Footer with Terms/Privacy links

**MUST NOT CONTAIN:**
- ❌ "CINEMA ISN'T DYING. IT'S ROTATING." as main hero
- ❌ Inline Viewer/Creator cards in hero section
- ❌ "VERTICAL CINEMA" as main headline

**VERIFICATION:**
```bash
curl -s https://vertikalapp.com | grep -i "STOP ROTATING"
curl -s https://vertikalapp.com | grep -i "CLOSED-LOOP ECOSYSTEM"
curl -s https://vertikalapp.com | grep -i "PASS THE CULTURE CHECK"
```

---

#### **B. Investors Page (investors.vertikalapp.com)**

**MUST CONTAIN:**
- ✅ Headline: **"PRE-SEED • $500K TARGET"**
- ✅ Subhead: **"THE VERTICAL HOLLYWOOD"**
- ✅ Three tier cards:
  - **FOUNDING PARTICIPANT:** $1,000 – $4,999
  - **STRATEGIC PARTICIPANT:** $5,000 – $24,999
  - **LEAD PARTICIPANT:** $25,000+
- ✅ Magic link signup form (email input)
- ✅ Core Vertikal logo in header (NOT investor badge)

**MUST NOT CONTAIN:**
- ❌ Investor badge logo (should be core Vertikal logo)
- ❌ Missing tier cards
- ❌ Wrong tier amounts

**VERIFICATION:**
```bash
curl -s https://investors.vertikalapp.com | grep -i "PRE-SEED"
curl -s https://investors.vertikalapp.com | grep -i "VERTICAL HOLLYWOOD"
curl -s https://investors.vertikalapp.com | grep -i "FOUNDING PARTICIPANT"
curl -s https://investors.vertikalapp.com | grep -i "STRATEGIC PARTICIPANT"
curl -s https://investors.vertikalapp.com | grep -i "LEAD PARTICIPANT"
```

---

#### **C. Networks Page (networks.vertikalapp.com)**

**MUST CONTAIN:**
- ✅ Headline: **"THE FOUNDING 50 NETWORKS"** (NOT "STUDIOS REBUILT")
- ✅ Network application form with fields:
  - Network/Studio Name
  - Contact Email
  - Contact Name
  - Description textarea
  - Portfolio URL (optional)
- ✅ Core Vertikal logo in header

**MUST NOT CONTAIN:**
- ❌ "STUDIOS REBUILT FOR THE VERTICAL ERA" as main headline
- ❌ Missing application form

**VERIFICATION:**
```bash
curl -s https://networks.vertikalapp.com | grep -i "FOUNDING 50 NETWORKS"
curl -s https://networks.vertikalapp.com | grep -i "APPLY TO BECOME A NETWORK"
curl -s https://networks.vertikalapp.com | grep -i "Network/Studio Name"
```

---

#### **D. Creators Page (creators.vertikalapp.com)**

**MUST CONTAIN:**
- ✅ Headline: **"FOR DIRECTORS. NOT INFLUENCERS."**
- ✅ Founding 50 signup form
- ✅ Core Vertikal logo in header

**MUST NOT CONTAIN:**
- ❌ "BUILD FRANCHISES. NOT JUST FOLLOWERS." as main headline (unless "FOR DIRECTORS" is also present)

**VERIFICATION:**
```bash
curl -s https://creators.vertikalapp.com | grep -i "FOR DIRECTORS"
curl -s https://creators.vertikalapp.com | grep -i "NOT INFLUENCERS"
```

---

### **STEP 3: VERIFY CLOUDFLARE PAGES DEPLOYMENT**

**MANUAL CHECK REQUIRED:** Go to Cloudflare Dashboard → Pages

For each project, verify:

| Project | Custom Domain | Assets Uploaded | Latest Deployment |
|---------|---------------|-----------------|-------------------|
| vertikalapp | vertikalapp.com | **3+ files** (NOT 1) | ✅ Recent (within 10 min) |
| investors-vertikalapp | investors.vertikalapp.com | **3+ files** (NOT 1) | ✅ Recent |
| networks-vertikalapp | networks.vertikalapp.com | **3+ files** (NOT 1) | ✅ Recent |
| creators-vertikalapp | creators.vertikalapp.com | **3+ files** (NOT 1) | ✅ Recent |
| beta-vertikalapp | beta.vertikalapp.com | **3+ files** (NOT 1) | ✅ Recent |

**CRITICAL:** If any project shows "1 file uploaded", that project is broken and needs manual file upload.

**CUSTOM DOMAIN STATUS:**
- Each custom domain must show **"Active"** (green checkmark)
- If showing "Pending" or missing, the site will return 404

---

### **STEP 4: VERIFY GITHUB ACTIONS DEPLOYMENT**

**CHECK:** https://github.com/AlphaJRR/vertikal/actions

**EXPECTED:**
- ✅ Latest workflow run shows **green checkmarks** for all 5 deployment jobs
- ✅ All jobs completed successfully (no red X marks)
- ✅ Latest commit: `ec1ee86` or newer

**IF FAILED:**
- Check logs for specific error
- Verify Cloudflare API token is valid
- Verify project names match exactly

---

### **STEP 5: VERIFY NO DNS CONFLICTS**

**CHECK:** Cloudflare Dashboard → DNS → Records

**MUST NOT EXIST:**
- ❌ `beta.vertikalapp.com` pointing to Netlify
- ❌ `cmo.vertikalapp.com` pointing to Netlify
- ❌ `cto.vertikalapp.com` pointing to Netlify
- ❌ `demo.vertikalapp.com` pointing to Netlify
- ❌ `kelmitchell.vertikalapp.com` (should be deleted)

**MUST EXIST (as CNAME to Cloudflare Pages):**
- ✅ `vertikalapp.com` → `vertikalapp.pages.dev`
- ✅ `investors.vertikalapp.com` → `investors-vertikalapp.pages.dev`
- ✅ `networks.vertikalapp.com` → `networks-vertikalapp.pages.dev`
- ✅ `creators.vertikalapp.com` → `creators-vertikalapp.pages.dev`
- ✅ `beta.vertikalapp.com` → `beta-vertikalapp.pages.dev`

---

## 🎯 VERIFICATION REPORT TEMPLATE

**Copy and fill out:**

```
═══════════════════════════════════════════════════════════
        VERIFICATION REPORT - [DATE]
═══════════════════════════════════════════════════════════

SITE STATUS:
============
✅ vertikalapp.com              → HTTP [STATUS] | Content: [CORRECT/WRONG]
✅ investors.vertikalapp.com    → HTTP [STATUS] | Content: [CORRECT/WRONG]
✅ networks.vertikalapp.com     → HTTP [STATUS] | Content: [CORRECT/WRONG]
✅ creators.vertikalapp.com     → HTTP [STATUS] | Content: [CORRECT/WRONG]
✅ beta.vertikalapp.com         → HTTP [STATUS] | Content: [CORRECT/WRONG]

CONTENT VERIFICATION:
=====================
✅ Main Page Hero: "STOP ROTATING YOUR PHONE" → [YES/NO]
✅ Investors Headline: "PRE-SEED • $500K TARGET" → [YES/NO]
✅ Networks Headline: "THE FOUNDING 50 NETWORKS" → [YES/NO]
✅ Creators Headline: "FOR DIRECTORS. NOT INFLUENCERS." → [YES/NO]

CLOUDFLARE PAGES:
=================
✅ All projects show "3+ files uploaded" → [YES/NO]
✅ All custom domains show "Active" → [YES/NO]
✅ Latest deployments are recent (< 10 min) → [YES/NO]

GITHUB ACTIONS:
===============
✅ All deployment jobs passed → [YES/NO]
✅ Latest commit: [COMMIT_HASH]

DNS:
====
✅ No conflicting DNS records → [YES/NO]
✅ All subdomains point to Cloudflare Pages → [YES/NO]

ISSUES FOUND:
=============
[List any issues found, or write "NONE"]

OVERALL STATUS:
===============
✅ ALL ISSUES RESOLVED
❌ ISSUES REMAIN (see above)

═══════════════════════════════════════════════════════════
```

---

## 🚨 IF ISSUES FOUND

### **Issue: Site returns 404**
**Fix:**
1. Check Cloudflare Pages → Custom domains → Verify domain is "Active"
2. If missing, add custom domain manually
3. Wait 2-3 minutes for DNS propagation

### **Issue: Site shows "1 file uploaded"**
**Fix:**
1. Cloudflare Pages → Project → New deployment → Upload assets
2. Upload entire folder contents (not the folder itself)
3. Ensure `index.html` and all assets are included

### **Issue: Wrong content displayed**
**Fix:**
1. Verify GitHub Actions deployment completed successfully
2. Check Cloudflare cache → Purge cache for that domain
3. Verify local repo files are correct (check `public/[site]/index.html`)
4. If files are wrong, fix and push again

### **Issue: DNS conflicts**
**Fix:**
1. Cloudflare Dashboard → DNS → Delete conflicting records
2. Ensure only Cloudflare Pages CNAME records exist
3. Wait 5-10 minutes for DNS propagation

---

## ✅ SUCCESS CRITERIA

**ALL ISSUES RESOLVED IF:**
1. ✅ All 5 sites return HTTP 200
2. ✅ All sites show correct content (headlines match expected)
3. ✅ All Cloudflare Pages projects show "3+ files uploaded"
4. ✅ All custom domains show "Active"
5. ✅ GitHub Actions shows all deployments successful
6. ✅ No DNS conflicts exist

**IF ANY CRITERIA FAILS:** Issue is NOT resolved. Follow fix steps above.

---

**END OF VERIFICATION PROMPT**

