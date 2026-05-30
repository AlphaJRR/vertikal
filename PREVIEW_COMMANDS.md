# 🚀 AVA Media - Preview Commands

Quick reference for previewing the app before App Store submission.

---

## 📋 Quick Start (All-in-One)

```bash
# Run this single command to build and open in Xcode:
./preview-app.sh
```

---

## 🔧 Step-by-Step Commands

### **Option 1: Development Server (Web Preview)**

For quick web preview without iOS:

```bash
# Install dependencies (first time only)
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

### **Option 2: iOS Simulator/Device Preview**

For full iOS preview in Xcode:

```bash
# 1. Install dependencies (if not done)
npm install --legacy-peer-deps

# 2. Build the web app
npm run build:web

# 3. Sync to iOS
npm run sync:ios

# 4. Open in Xcode
npm run open:ios
```

**In Xcode:**
1. Select a simulator (e.g., iPhone 15 Pro) or your physical device
2. Click the **Play button** (▶️) or press `Cmd + R`
3. Wait for build to complete
4. App will launch in simulator/device

---

## 🎯 Individual Commands Reference

### **Build Commands:**

```bash
# Build web app only
npm run build:web

# Build web app + sync to iOS
npm run build:ios

# Sync web assets to iOS (after building)
npm run sync:ios

# Open Xcode project
npm run open:ios
```

### **Development Commands:**

```bash
# Start Vite dev server (web preview)
npm run dev

# Watch mode - rebuilds on file changes
npm run build:web -- --watch
```

---

## 📱 Testing in iOS Simulator

### **Recommended Simulators:**
- **iPhone 15 Pro** (6.7" display) - For App Store screenshots
- **iPhone 14 Pro** (6.1" display) - Standard testing
- **iPhone SE** (4.7" display) - Small screen testing

### **Testing Checklist:**

1. **Navigation:**
   - [ ] All tabs work (Home, Podcasts, Alpha Vault, Services, Booking)
   - [ ] About page accessible from settings icon
   - [ ] Smooth transitions between pages

2. **Favorites:**
   - [ ] Tap heart icon on video/podcast cards
   - [ ] Icon changes to filled heart (❤️)
   - [ ] Navigate to Favorites page
   - [ ] Verify favorited content appears
   - [ ] Close and reopen app - favorites persist

3. **Alpha Vault:**
   - [ ] Images display correctly
   - [ ] Download button works
   - [ ] Share button opens share sheet
   - [ ] Download status updates correctly

4. **Booking:**
   - [ ] Payment disclaimer is visible
   - [ ] "Open Booking in Browser" button works
   - [ ] Opens Calendly in browser

5. **Legal/About:**
   - [ ] Privacy Policy link opens
   - [ ] Terms of Service link opens
   - [ ] Support email link works

6. **Safe Area:**
   - [ ] Content doesn't hide behind notch
   - [ ] Tab bar respects safe area
   - [ ] All content is accessible

---

## 🐛 Troubleshooting

### **Build Errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **Capacitor Sync Issues:**

```bash
# Re-sync Capacitor
npx cap sync ios --force
```

### **Xcode Won't Open:**

```bash
# Manually open the workspace
open ios/App/App.xcworkspace
```

### **Simulator Issues:**

```bash
# Reset simulator
xcrun simctl erase all
```

---

## 📸 Taking Screenshots for App Store

### **In iOS Simulator:**

1. **Select device:**
   - iPhone 15 Pro Max (6.7") - 1290 x 2796
   - iPhone 11 Pro Max (6.5") - 1242 x 2688
   - iPhone 8 Plus (5.5") - 1242 x 2208

2. **Take screenshot:**
   - `Cmd + S` in Simulator
   - Or: Device → Screenshot

3. **Screenshots saved to:** `~/Desktop/`

### **Screenshot Best Practices:**

- Show key features on each page
- Use real content (not placeholders)
- Ensure text is readable
- Capture different screens (Home, Podcasts, Alpha Vault, etc.)

---

## ✅ Pre-Submission Checklist

Before submitting to App Store:

- [ ] App builds without errors
- [ ] All features tested on physical device
- [ ] Favorites persist after app restart
- [ ] Offline vault downloads work
- [ ] Share functionality works
- [ ] External links open correctly
- [ ] Safe area insets work on iPhone with notch
- [ ] No console errors
- [ ] App icons replaced (not placeholders)
- [ ] All placeholder data replaced with real content
- [ ] Privacy Policy and Terms URLs are live
- [ ] Calendly booking URL is correct

---

## 🚀 Ready to Submit?

Once preview looks good:

1. **Archive in Xcode:**
   - Product → Archive
   - Wait for archive to complete

2. **Distribute:**
   - Window → Organizer
   - Select archive → Distribute App
   - Follow App Store Connect wizard

3. **Submit:**
   - Complete App Store Connect listing
   - Upload screenshots
   - Submit for review

---

**Good luck with your submission!** 🎉
