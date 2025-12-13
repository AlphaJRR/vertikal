# 📱 VERTIKAL — TESTFLIGHT TESTER INSTRUCTIONS

**Version:** v1.0.0-RC1  
**Platform:** iOS (TestFlight)  
**Date:** December 13, 2024

---

## 🎯 WHAT TO TEST

### Core Features

1. **Vertical Feed**
   - Scroll through home feed
   - Verify hero video loads
   - Check "Continue Watching" section
   - Verify "Director Originals" section
   - Test Founding 50 creators rail (horizontal scroll)
   - Test Crew row (avatars under hero)
   - Test Category filter buttons

2. **Daunt Effect (Danmaku)**
   - Watch hero video section
   - Verify comments scroll right-to-left
   - Check comments appear above video (not behind)
   - Verify smooth animation (60fps)
   - Test with multiple comments

3. **Creator Profiles**
   - Tap on any creator card
   - Verify profile loads correctly
   - Check stats display (fans, series, views)
   - Verify bio text displays
   - Check shows grid displays

4. **DM Permissions (Role-Based)**
   - **As Viewer (USER role):**
     - Verify "Leave Comment" button appears
     - Verify "Message" button does NOT appear
     - Try to leave a comment (if implemented)
   
   - **As Creator (CREATOR role):**
     - Verify "Message" button appears
     - Verify "Leave Comment" button does NOT appear
     - Try to send a DM (should work)

5. **Navigation**
   - Test all 4 tabs (Home, Series, Shorts, Profile)
   - Verify bottom navigation bar works
   - Test navigation between screens
   - Verify back button works

---

## 🐛 BUG REPORTING

### How to Report Bugs

1. **Take Screenshots**
   - Capture the error screen
   - Include device info (Settings → General → About)

2. **Record Steps to Reproduce**
   - What were you doing?
   - What did you expect?
   - What actually happened?

3. **Include Device Info**
   - Device model (e.g., iPhone 14 Pro)
   - iOS version (e.g., iOS 17.2)
   - App version (v1.0.0-RC1)

4. **Submit via TestFlight**
   - Use TestFlight feedback button
   - OR email: [support email]

---

## ✅ SUCCESS CRITERIA

### Must Work (Critical)

- ✅ App launches without crash
- ✅ Home feed loads within 3 seconds
- ✅ Navigation works (all 4 tabs)
- ✅ Creator profiles load
- ✅ Daunt Effect animates smoothly
- ✅ Role-based buttons display correctly

### Should Work (Important)

- ✅ API calls complete successfully
- ✅ Images load correctly
- ✅ No excessive loading delays
- ✅ Error boundaries catch crashes gracefully

---

## 🚨 KNOWN ISSUES

### Current Limitations

1. **Auth Context Mock**
   - User role is currently mocked
   - Real auth integration coming in v1.0.1

2. **Comment Sheet Missing**
   - "Leave Comment" button exists but modal not implemented
   - Coming in v1.0.1

3. **DM Chat Screen Missing**
   - "Message" button exists but chat UI not implemented
   - Backend ready, frontend coming in v1.0.1

---

## 📞 SUPPORT

### Questions?

- **Email:** [support email]
- **Slack:** [team channel]
- **Status Page:** https://status.vertikal.com

### Critical Issues?

- **On-Call:** [contact info]
- **Escalation:** [escalation path]

---

## 🎉 THANK YOU

Your feedback is critical for making VERTIKAL production-ready. We appreciate your time and testing!

---

**Generated:** December 13, 2024  
**Version:** v1.0.0-RC1

