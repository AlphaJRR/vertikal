# 🔧 CLOUDFLARE DASHBOARD FIX - EXACT STEPS

**Status:** 🟢 **READY TO EXECUTE**  
**Issue:** Sites showing 404/Unreachable  
**Root Cause:** Cloudflare Pages configuration

---

## 🎯 EXACT STEPS TO FIX IN CLOUDFLARE DASHBOARD

### **STEP 1: Verify Projects Exist**

Go to: **https://dash.cloudflare.com** → **Pages**

Verify these projects exist:
- [ ] `vertikalapp`
- [ ] `investors-vertikalapp`
- [ ] `networks-vertikalapp`
- [ ] `creators-vertikalapp`
- [ ] `beta-vertikalapp`

**If a project is missing:**
1. Click **"Create a project"**
2. Select **"Upload assets"**
3. Enter project name (e.g., `investors-vertikalapp`)
4. Upload files (see Step 3 below)
5. Click **"Save and deploy"**

---

### **STEP 2: Verify Custom Domains**

For **EACH** project above:

1. Click the project name
2. Go to **"Custom domains"** tab
3. Check if domain shows **"Active"** ✅

**Required mappings:**

| Project | Custom Domain | Status |
|---------|---------------|--------|
| `vertikalapp` | vertikalapp.com | ⬜ Check |
| `investors-vertikalapp` | investors.vertikalapp.com | ⬜ Check |
| `networks-vertikalapp` | networks.vertikalapp.com | ⬜ Check |
| `creators-vertikalapp` | creators.vertikalapp.com | ⬜ Check |
| `beta-vertikalapp` | beta.vertikalapp.com | ⬜ Check |

**If domain is missing or shows "Pending":**

1. Click **"Set up a custom domain"**
2. Enter domain (e.g., `investors.vertikalapp.com`)
3. Click **"Add domain"**
4. If DNS prompt appears, click **"Add record"** or **"Approve"**
5. Wait 2-5 minutes for status to change to **"Active"**

---

### **STEP 3: Manual Upload (IF Deployment Failed)**

**For vertikalapp.com:**

1. Cloudflare Dashboard → **vertikalapp** project
2. Click **"New deployment"** → **"Upload assets"**
3. From your Mac, navigate to: `/Users/alphavisualartists/Vertikal-App/public/`
4. Select these files/folders:
   - `index.html`
   - `terms.html` (if exists)
   - `privacy.html` (if exists)
   - `assets/` folder (if exists)
5. Drag ALL selected items into Cloudflare upload area
6. Click **"Save and deploy"**
7. Wait for deployment to complete
8. Verify **"Assets uploaded"** shows **3+ files** (NOT 1)

**For investors.vertikalapp.com:**

1. Cloudflare Dashboard → **investors-vertikalapp** project
2. Click **"New deployment"** → **"Upload assets"**
3. From your Mac, navigate to: `/Users/alphavisualartists/Vertikal-App/public/investors/`
4. Select ALL files in that folder:
   - `index.html`
   - `assets/` folder (if exists)
   - Any other files
5. Drag ALL selected items into Cloudflare upload area
6. Click **"Save and deploy"**
7. Wait for deployment to complete
8. Verify **"Assets uploaded"** shows **2+ files** (NOT 1)

**For networks.vertikalapp.com:**

1. Cloudflare Dashboard → **networks-vertikalapp** project
2. Click **"New deployment"** → **"Upload assets"**
3. From your Mac, navigate to: `/Users/alphavisualartists/Vertikal-App/public/networks/`
4. Select ALL files in that folder:
   - `index.html`
   - `success.html` (if exists)
   - Any other files
5. Drag ALL selected items into Cloudflare upload area
6. Click **"Save and deploy"**
7. Wait for deployment to complete
8. Verify **"Assets uploaded"** shows **2+ files** (NOT 1)

---

### **STEP 4: Verify Deployment**

After each upload:

1. Go to project → **"Deployments"** tab
2. Check latest deployment:
   - ✅ **Status:** Success (green checkmark)
   - ✅ **Assets uploaded:** 3+ files (NOT 1)
   - ✅ **Timestamp:** Recent (within last 5 minutes)

**If you see "1 file uploaded":**
- The upload failed
- Re-upload with ALL files
- Make sure you're dragging FILES, not the parent folder

---

### **STEP 5: Purge Cache**

After all deployments complete:

1. Cloudflare Dashboard → **Caching** → **Configuration**
2. Click **"Purge Everything"**
3. Confirm purge
4. Wait 30 seconds

---

### **STEP 6: Test Sites**

Open each URL in **incognito mode** (Cmd+Shift+N):

- [ ] https://vertikalapp.com → "CINEMA ISN'T DYING. IT'S ROTATING."
- [ ] https://investors.vertikalapp.com → "CAPITALIZING ON THE ROTATION"
- [ ] https://networks.vertikalapp.com → "STUDIOS REBUILT FOR THE VERTICAL ERA"
- [ ] https://creators.vertikalapp.com → "BUILD FRANCHISES. NOT JUST FOLLOWERS."
- [ ] https://beta.vertikalapp.com → "INSIDE THE ENGINE"

**If site still shows 404:**
1. Check Custom domains tab shows "Active"
2. Wait 2-3 minutes for DNS propagation
3. Hard refresh (Cmd+Shift+R)
4. Try different browser
5. Check Cloudflare Dashboard → Deployments → Verify files uploaded

---

## 🚨 COMMON ISSUES & FIXES

### **Issue: "1 file uploaded"**
**Cause:** Only index.html was uploaded  
**Fix:** Re-upload with ALL files (index.html + assets/ + other files)

### **Issue: Custom Domain Shows "Pending"**
**Cause:** DNS not propagated  
**Fix:** Wait 5-10 minutes, then check again. If still pending, delete and re-add.

### **Issue: Site Works on .pages.dev but Not Custom Domain**
**Cause:** Custom domain not properly attached  
**Fix:** Check Custom domains tab, verify "Active" status

### **Issue: 404 After Upload**
**Cause:** Files uploaded incorrectly  
**Fix:** Make sure you drag FILES (index.html, assets/, etc.), NOT the parent folder

---

## ✅ VERIFICATION CHECKLIST

After completing all steps:

- [ ] All 5 projects exist in Cloudflare Pages
- [ ] All custom domains show "Active"
- [ ] All deployments show "3+ files uploaded" (NOT 1)
- [ ] All sites return HTTP 200
- [ ] Content matches expected (check hero text)
- [ ] Cache purged

---

## 📊 QUICK REFERENCE

**Cloudflare Dashboard:** https://dash.cloudflare.com  
**GitHub Actions:** https://github.com/AlphaJRR/vertikal/actions

**Local Files Location:**
- Main: `/Users/alphavisualartists/Vertikal-App/public/`
- Investors: `/Users/alphavisualartists/Vertikal-App/public/investors/`
- Networks: `/Users/alphavisualartists/Vertikal-App/public/networks/`
- Creators: `/Users/alphavisualartists/Vertikal-App/public/creators/`
- Beta: `/Users/alphavisualartists/Vertikal-App/public/beta/`

---

**This is the exact fix. Follow step by step in Cloudflare Dashboard.**

**Generated:** Cloudflare Dashboard Fix Guide  
**Status:** ✅ READY TO EXECUTE

