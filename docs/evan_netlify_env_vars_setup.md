# 🔧 EVAN — Netlify Environment Variables Setup

**Author:** EVAN — DevOps & Infrastructure Lead  
**Priority:** 🟥 P0  
**Date:** Tuesday, December 16, 2024  
**Status:** ⏳ READY TO EXECUTE

---

## 🎯 OBJECTIVE

Set two environment variables in Netlify to enable YouTube video embeds on the landing page.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Access Netlify Dashboard
1. Go to: https://app.netlify.com
2. Log in with your credentials
3. Select site: **vertikalapp.com** (or your site name)

### Step 2: Navigate to Environment Variables
1. Click **Site settings** (gear icon)
2. Scroll to **Build & deploy** section
3. Click **Environment** in the left sidebar
4. You should see the "Environment variables" section

### Step 3: Add First Variable
1. Click **Add variable** button
2. **Variable name:** `ABOUT_VIDEO_EMBED_URL`
3. **Value:** `https://www.youtube.com/embed/Bz_ibyq0ATs`
   - ⚠️ **NOTE:** Replace `Bz_ibyq0ATs` with actual About video YouTube ID
4. **Scopes:** Select **All scopes** (Production, Deploy previews, Branch deploys)
5. Click **Save**

### Step 4: Add Second Variable
1. Click **Add variable** button again
2. **Variable name:** `FOUNDING50_VIDEO_EMBED_URL`
3. **Value:** `https://www.youtube.com/embed/PLACEHOLDER2`
   - ⚠️ **NOTE:** Replace `PLACEHOLDER2` with actual Founding 50 video YouTube ID
4. **Scopes:** Select **All scopes**
5. Click **Save**

### Step 5: Trigger Redeploy
1. Go to **Deploys** tab (top navigation)
2. Click **Trigger deploy** dropdown
3. Select **Deploy site**
4. Wait for build to complete (usually 1-2 minutes)

---

## ✅ VERIFICATION CHECKLIST

- [ ] Both variables visible in Environment Variables section
- [ ] Variable names are exact (case-sensitive):
  - `ABOUT_VIDEO_EMBED_URL`
  - `FOUNDING50_VIDEO_EMBED_URL`
- [ ] Values are valid YouTube embed URLs (format: `https://www.youtube.com/embed/VIDEO_ID`)
- [ ] Scopes set to "All scopes"
- [ ] Deploy completed successfully
- [ ] Videos play on production site: `https://vertikalapp.com`

---

## 📸 PROOF DELIVERABLE

**Required Screenshot:**
1. Netlify Dashboard → Site Settings → Environment
2. Show both variables in the list
3. Values can be partially obscured for security (just show they exist)

**Example Screenshot Description:**
```
Environment Variables:
- ABOUT_VIDEO_EMBED_URL: https://www.youtube.com/embed/...
- FOUNDING50_VIDEO_EMBED_URL: https://www.youtube.com/embed/...
```

---

## 🔍 TROUBLESHOOTING

### Variable Not Showing in Production
- **Issue:** Variables set but not accessible in production
- **Fix:** Ensure "Production" scope is selected, then trigger redeploy

### Videos Still Not Playing
- **Issue:** Variables set but videos don't load
- **Fix:** 
  1. Check browser console for errors
  2. Verify YouTube video IDs are correct
  3. Verify embed URLs are accessible (test in browser)
  4. Check iframe src attributes in page source

### Build Fails After Adding Variables
- **Issue:** Deploy fails after adding env vars
- **Fix:**
  1. Check variable names for typos
  2. Verify values don't contain special characters that need escaping
  3. Check build logs for specific error

---

## 📝 NOTES

- Environment variables are case-sensitive
- Changes require a redeploy to take effect
- Variables are available in all build contexts (production, previews, branches)
- YouTube embed URLs must use `/embed/` format, not `/watch?v=`

---

**Generated:** December 15, 2024  
**Status:** Ready for Execution

