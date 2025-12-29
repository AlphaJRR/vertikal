# 🧪 SWITCH — QA Plan (Mobile-First)

**Author:** SWITCH — Head of User Support & Quality  
**Status:** 🟢 READY  
**Priority:** P0 (Critical for Jan 1 Launch)

---

## 📱 TEST CASES

### iPhone Safari
- [ ] **Scroll:** Page scrolls smoothly, no horizontal scroll
- [ ] **Video Embeds:** About video plays correctly
- [ ] **Video Embeds:** Founding 50 video plays correctly
- [ ] **CTAs:** "Apply for Founding 50" button works
- [ ] **CTAs:** "Join Waitlist" button works
- [ ] **Forms:** Creator application form submits successfully
- [ ] **Forms:** User waitlist form submits successfully
- [ ] **Navigation:** Smooth scroll to sections works

**Device:** iPhone (latest iOS)  
**Browser:** Safari  
**Test Date:** ________  
**Tester:** ________  
**Result:** Pass / Fail  
**Notes:** ________

---

### Android Chrome
- [ ] **Scroll:** Page scrolls smoothly, no horizontal scroll
- [ ] **Video Embeds:** About video plays correctly
- [ ] **Video Embeds:** Founding 50 video plays correctly
- [ ] **CTAs:** "Apply for Founding 50" button works
- [ ] **CTAs:** "Join Waitlist" button works
- [ ] **Forms:** Creator application form submits successfully
- [ ] **Forms:** User waitlist form submits successfully
- [ ] **Navigation:** Smooth scroll to sections works

**Device:** Android (latest version)  
**Browser:** Chrome  
**Test Date:** ________  
**Tester:** ________  
**Result:** Pass / Fail  
**Notes:** ________

---

## 🔐 SIGNUP ERROR HANDLING

### Duplicate Handle
- [ ] **Test:** Try to sign up with existing handle
- [ ] **Expected:** Error message displayed
- [ ] **Message:** "Handle already taken. Please choose another."
- [ ] **Result:** Pass / Fail

### Missing Required Fields
- [ ] **Test:** Submit form without name/email
- [ ] **Expected:** Form validation prevents submission
- [ ] **Message:** "Name and email are required"
- [ ] **Result:** Pass / Fail

### Weak Network
- [ ] **Test:** Submit form with network throttled
- [ ] **Expected:** Loading state shown, error handled gracefully
- [ ] **Message:** "Network error. Please check your connection."
- [ ] **Result:** Pass / Fail

---

## 🏷️ BADGE VISIBILITY

### Approved Creator
- [ ] **Test:** View profile of approved Founding 50 creator
- [ ] **Expected:** "Founding 50" badge visible under display name
- [ ] **Styling:** Badge is 70-80% of name size, muted opacity
- [ ] **Result:** Pass / Fail

### Not Approved Creator
- [ ] **Test:** View profile of creator without approval
- [ ] **Expected:** No badge displayed
- [ ] **Result:** Pass / Fail

---

## 👤 ADMIN APPROVAL WORKFLOW

### End-to-End Test
- [ ] **Step 1:** Creator submits application
- [ ] **Step 2:** Admin views application in admin panel
- [ ] **Step 3:** Admin clicks "Approve"
- [ ] **Step 4:** Badge automatically assigned
- [ ] **Step 5:** Creator profile shows badge
- [ ] **Step 6:** Creator receives approval email
- [ ] **Result:** Pass / Fail

---

## 📊 QA REPORT TEMPLATE

### Test Summary
- **Date:** ________
- **Tester:** ________
- **Environment:** Production / Staging
- **Build:** ________

### Results
- **Total Tests:** ________
- **Passed:** ________
- **Failed:** ________
- **Blocked:** ________

### Critical Issues
1. ________
2. ________
3. ________

### Recommendations
- ________
- ________

---

## 🚨 BLOCKER CRITERIA

**Launch Blockers (P0):**
- ❌ Videos don't play
- ❌ Forms don't submit
- ❌ Badge doesn't render
- ❌ Admin can't approve
- ❌ Critical errors on mobile

**Non-Blockers (P1/P2):**
- ⚠️ Minor styling issues
- ⚠️ Non-critical error messages
- ⚠️ Performance optimizations

---

**Generated:** December 15, 2024  
**Version:** v1.0  
**Status:** Ready for Jan 1 QA Testing

