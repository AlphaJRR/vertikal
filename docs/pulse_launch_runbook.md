# 🚀 PULSE — Jan 1 Launch Runbook v1

**Author:** PULSE — VP Operations & Launch  
**Status:** 🟢 LOCKED  
**Milestone:** Jan 1, 2026

---

## ✅ GO/NO-GO GATES (MUST PASS)

### Pre-Launch Checklist

- [ ] **Landing scroll works on mobile/desktop** ✅
- [ ] **About video plays** ✅
- [ ] **Founding 50 video plays** ✅
- [ ] **Signup/profile works** ✅
- [ ] **Badge renders under name** ✅
- [ ] **Admin can approve** ✅
- [ ] **Rollback confirmed** ✅
- [ ] **QA pass report** ✅

**Gate Keeper:** JIM (System Integrity Architect)  
**Approval Required:** All items must be ✅ before launch

---

## 📅 LAUNCH DAY STEPS

### 9:00 AM — Final QA
**Owner:** SWITCH (QA Lead)

**Checklist:**
- [ ] Test landing page on iPhone Safari
- [ ] Test landing page on Android Chrome
- [ ] Verify video embeds play
- [ ] Test signup flow end-to-end
- [ ] Test creator application submission
- [ ] Verify badge visibility (approved vs not)
- [ ] Test admin approval workflow
- [ ] Check error handling (duplicate handle, network failure)

**Deliverable:** QA report with screenshots

---

### 11:00 AM — Deploy/Publish
**Owner:** EVAN (DevOps Lead)

**Steps:**
1. Confirm latest commit is on `main` branch
2. Verify Netlify build logs are clean
3. Confirm env vars are set:
   - `ABOUT_VIDEO_EMBED_URL`
   - `FOUNDING50_VIDEO_EMBED_URL`
4. Trigger deploy (or confirm auto-deploy)
5. Verify deploy completes successfully
6. Test production URL:
   - Landing page loads
   - Videos play
   - Forms submit
   - Scroll works

**Deliverable:** Deploy confirmation + production test results

---

### 1:00 PM — First Creator Outreach Wave
**Owner:** VERA (VP Creator Acquisition)

**Actions:**
1. Send first batch of 20 DMs to warm leads
2. Post "Founding 50 Applications Open" on social
3. Monitor application submissions
4. Begin review process for first applications

**Deliverable:** Outreach report + application count

---

## 🔄 ROLLBACK PROCEDURE

### If Critical Issue Detected

1. **EVAN:** Immediately rollback to last known good deploy
2. **SWITCH:** Document issue + steps to reproduce
3. **CURSOR:** Fix issue in staging
4. **JIM:** Approve fix before re-deploy
5. **EVAN:** Re-deploy after fix approved

**Rollback Time Target:** < 5 minutes

---

## 📊 POST-LAUNCH MONITORING

### First 24 Hours

**ATLAS (Analytics):**
- Monitor landing page views
- Track video play rates
- Monitor signup conversion
- Track application submissions

**CLAUDE (Backend):**
- Monitor API error rates
- Check database performance
- Monitor authentication issues

**SWITCH (QA):**
- Monitor user-reported bugs
- Track error logs
- Document critical issues

---

## 🎯 SUCCESS METRICS (First 24h)

- **Landing Views:** > 100
- **Video Plays:** > 50% of views
- **Signups:** > 10
- **Creator Applications:** > 5
- **Error Rate:** < 1%

---

**Generated:** December 15, 2024  
**Version:** v1.0  
**Status:** Locked for Jan 1 Launch

