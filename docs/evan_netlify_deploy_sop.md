# 🚀 EVAN — Netlify Deploy + Rollback SOP

**Author:** EVAN — DevOps & Infrastructure Lead  
**Status:** 🟢 READY  
**Purpose:** Standard operating procedure for deployments

---

## 📦 DEPLOY PROCEDURE

### Step 1: Pre-Deploy Checklist
- [ ] Latest code committed to `main` branch
- [ ] Build passes locally (if applicable)
- [ ] Environment variables set in Netlify
- [ ] No critical errors in staging

### Step 2: Deploy Execution
1. **Netlify Dashboard** → Site → **Deploys**
2. Confirm latest deploy has expected commit
3. Check build logs are clean (no errors)
4. Verify deploy status: **Published**

### Step 3: Post-Deploy Verification
- [ ] **Home scroll:** Test on mobile and desktop
- [ ] **Video embeds:** About video plays
- [ ] **Video embeds:** Founding 50 video plays
- [ ] **CTA buttons:** "Apply for Founding 50" works
- [ ] **CTA buttons:** "Join Waitlist" works
- [ ] **Forms:** Creator application submits
- [ ] **Forms:** User waitlist submits

**Test URLs:**
- Production: `https://vertikalapp.com`
- Staging: `https://staging.vertikalapp.com` (if configured)

---

## 🔄 ROLLBACK PROCEDURE (INSTANT)

### Step 1: Identify Issue
- Document the problem
- Take screenshots if possible
- Note which deploy introduced the issue

### Step 2: Rollback Execution
1. **Netlify Dashboard** → **Deploys**
2. Find last "known good" deploy (before issue)
3. Click **"Publish deploy"** button
4. Confirm rollback in popup

### Step 3: Post-Rollback Verification
- [ ] Retest scroll functionality
- [ ] Retest video embeds
- [ ] Retest forms
- [ ] Verify issue is resolved

**Rollback Time Target:** < 5 minutes

---

## 🚨 EMERGENCY FREEZE

### Stop Auto-Publishing
1. **Netlify Dashboard** → Site Settings
2. **Build & deploy** → **Stop auto publishing**
3. Manual deploys only until issue resolved

### Resume Auto-Publishing
1. **Netlify Dashboard** → Site Settings
2. **Build & deploy** → **Resume auto publishing**

---

## 📊 DEPLOYMENT CHECKLIST

### Before Deploy
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Env vars set
- [ ] Backup current deploy

### During Deploy
- [ ] Monitor build logs
- [ ] Watch for errors
- [ ] Verify build completes

### After Deploy
- [ ] Test critical paths
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Document deploy

---

## 🔍 TROUBLESHOOTING

### Build Fails
1. Check build logs for errors
2. Verify environment variables
3. Check for syntax errors
4. Rollback if needed

### Deploy Succeeds But Site Broken
1. Check browser console for errors
2. Verify env vars are set correctly
3. Check CDN cache (clear if needed)
4. Rollback to last known good

### Videos Don't Play
1. Verify `ABOUT_VIDEO_EMBED_URL` is set
2. Verify `FOUNDING50_VIDEO_EMBED_URL` is set
3. Check iframe src attributes
4. Test URLs directly

---

**Generated:** December 15, 2024  
**Version:** v1.0  
**Status:** Ready for Use

