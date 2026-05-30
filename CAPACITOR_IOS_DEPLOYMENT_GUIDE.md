# 📱 Capacitor iOS Deployment Guide - Vertikal

**App Name:** Vertikal  
**Bundle ID:** `com.alphavisualartists.vertikal`  
**Display Name:** Vertikal  
**Date:** January 23, 2025

---

## ✅ SETUP COMPLETE

Capacitor has been successfully configured for iOS with the following:

### **Configuration Files:**
- ✅ `capacitor.config.ts` - Main Capacitor configuration
- ✅ `ios/App/App/Info.plist` - iOS app settings and permissions
- ✅ Build scripts added to `package.json`

### **Features Configured:**
- ✅ Dark theme status bar
- ✅ Deep linking for `alphavisualartists.com`
- ✅ Camera and photo library permissions
- ✅ Splash screen support
- ✅ Safe area insets
- ✅ Webview settings optimized

---

## 🚀 BUILDING FOR APP STORE

### **Step 1: Build Your Web App**

First, ensure your React + Vite app is built:

```bash
# If using Vite
npm run build:web

# Or your custom build command that outputs to dist/
npm run build
```

### **Step 2: Sync to iOS**

```bash
# Sync web assets to iOS project
npm run sync:ios

# Or use the combined command
npm run build:ios
```

### **Step 3: Open in Xcode**

```bash
npm run open:ios
```

This will open the project in Xcode.

---

## 📋 XCODE STEPS FOR APP STORE SUBMISSION

### **Step 1: Configure Signing & Capabilities**

1. **Select the Project** in Xcode navigator (top "App" item)
2. **Select the "App" target** (under TARGETS)
3. **Go to "Signing & Capabilities" tab**

#### **Signing:**
- ✅ Check "Automatically manage signing"
- Select your **Team** (your Apple Developer account)
- **Bundle Identifier** should be: `com.alphavisualartists.vertikal`
- Xcode will automatically create/update provisioning profiles

#### **Capabilities (if needed):**
- **Camera** - Already configured in Info.plist
- **Photo Library** - Already configured in Info.plist
- **Associated Domains** (for deep linking):
  - Add: `applinks:alphavisualartists.com`
  - Add: `applinks:*.alphavisualartists.com`

### **Step 2: Configure App Version**

1. **Select the "App" target**
2. **Go to "General" tab**
3. Set:
   - **Version:** `1.0.0` (or your version)
   - **Build:** `1` (increment for each submission)
   - **Display Name:** `Vertikal`
   - **Bundle Identifier:** `com.alphavisualartists.vertikal`

### **Step 3: Configure App Icons**

1. **Go to "Assets" in Xcode navigator**
2. **Select "AppIcon"**
3. **Drag your app icons:**
   - **1024x1024** PNG (required for App Store)
   - Place in the "App Store" slot

**Note:** Currently using placeholder icons. Replace with your actual design:
- Run: `./scripts/generate-placeholder-icons.sh` (if ImageMagick installed)
- Or manually create 1024x1024 PNG and place in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### **Step 4: Test on Device**

1. **Connect your iPhone** via USB
2. **Select your device** from the device dropdown (top toolbar)
3. **Click the Play button** (▶️) or press `Cmd + R`
4. **Trust the developer** on your iPhone (Settings > General > VPN & Device Management)

### **Step 5: Archive for App Store**

1. **Select "Any iOS Device"** from device dropdown (not a simulator)
2. **Product menu → Archive**
3. Wait for archive to complete (may take a few minutes)

### **Step 6: Distribute to App Store**

1. **Window menu → Organizer** (or `Cmd + Shift + 9`)
2. **Select your archive**
3. **Click "Distribute App"**
4. **Choose "App Store Connect"**
5. **Follow the wizard:**
   - Upload: Automatically upload to App Store Connect
   - Distribution options: App Store distribution
   - Signing: Automatically manage signing
6. **Click "Upload"**
7. Wait for upload to complete (may take 10-30 minutes)

---

## 🏪 APP STORE CONNECT CONFIGURATION

### **Step 1: Create App Listing**

1. **Go to:** https://appstoreconnect.apple.com
2. **My Apps → Click "+" → New App**
3. **Fill in:**
   - **Platform:** iOS
   - **Name:** Vertikal
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** `com.alphavisualartists.vertikal`
   - **SKU:** `vertikal-ios-001` (unique identifier, can be anything)
   - **User Access:** Full Access

### **Step 2: App Information**

1. **App Information tab:**
   - **Category:** 
     - Primary: Entertainment (or appropriate category)
     - Secondary: (optional)
   - **Content Rights:** Check "I have the rights to use all content"
   - **Age Rating:** Complete questionnaire (likely 17+ for video content)

### **Step 3: Pricing and Availability**

1. **Set price:** Free or Paid
2. **Availability:** Select countries (or "All Countries")
3. **Schedule:** Available immediately or schedule release

### **Step 4: Prepare for Submission**

#### **Version Information:**
- **Version:** `1.0.0` (must match Xcode)
- **What's New:** Your release notes

#### **App Screenshots:**
You need screenshots for:
- **iPhone 6.7" Display** (iPhone 14 Pro Max, 15 Pro Max) - Required
- **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max) - Required
- **iPhone 5.5" Display** (iPhone 8 Plus) - Optional but recommended

**Sizes:**
- 6.7": 1290 x 2796 pixels
- 6.5": 1242 x 2688 pixels
- 5.5": 1242 x 2208 pixels

#### **App Preview Video (Optional):**
- 15-30 seconds
- Same sizes as screenshots

#### **Description:**
- **Subtitle:** Short tagline (30 characters)
- **Description:** Full app description (up to 4000 characters)
- **Keywords:** Comma-separated keywords (100 characters)
- **Support URL:** Your support website
- **Marketing URL:** (optional)

#### **App Icon:**
- 1024 x 1024 PNG
- No transparency
- No rounded corners (Apple adds them)

#### **Privacy Policy:**
- **Privacy Policy URL:** Required (must be publicly accessible)
- **Privacy Choices:** If you collect data

### **Step 5: Build Selection**

1. **After uploading archive, wait 10-30 minutes**
2. **Go to "TestFlight" tab** (optional - for beta testing)
3. **Go to "App Store" tab → Version → Build**
4. **Click "+" next to Build**
5. **Select your uploaded build**
6. **Click "Done"**

### **Step 6: Submit for Review**

1. **Complete all required sections** (marked with ⚠️)
2. **Review all information**
3. **Click "Submit for Review"**
4. **Answer export compliance questions:**
   - Uses encryption: Yes (HTTPS)
   - Export compliance: Usually "No" unless using custom encryption

---

## 📸 GENERATING APP STORE SCREENSHOTS

### **Method 1: Using iOS Simulator**

1. **Open Xcode**
2. **Run app in Simulator:**
   ```bash
   npm run open:ios
   # Then run in Xcode on desired simulator
   ```
3. **Select device:**
   - iPhone 14 Pro Max (6.7")
   - iPhone 11 Pro Max (6.5")
   - iPhone 8 Plus (5.5")
4. **Take screenshots:**
   - `Cmd + S` in Simulator
   - Or: Device → Screenshot
5. **Screenshots saved to:** `~/Desktop/`

### **Method 2: Using Physical Device**

1. **Run app on your iPhone**
2. **Navigate to key screens:**
   - Home screen
   - Main features
   - Profile screen
3. **Take screenshots:**
   - iPhone X and later: `Side button + Volume up`
   - iPhone 8 and earlier: `Home + Side button`
4. **Transfer to Mac** via AirDrop or Photos app

### **Method 3: Using Design Tools**

Create mockups in:
- **Figma** - Export at exact sizes
- **Sketch** - Export at exact sizes
- **Photoshop** - Create artboards at exact sizes

### **Required Screenshot Sizes:**

| Device | Size | Required |
|--------|------|----------|
| iPhone 6.7" (14 Pro Max) | 1290 x 2796 | ✅ Yes |
| iPhone 6.5" (11 Pro Max) | 1242 x 2688 | ✅ Yes |
| iPhone 5.5" (8 Plus) | 1242 x 2208 | ⚠️ Recommended |

### **Screenshot Best Practices:**

1. **Show key features** - Home screen, main functionality
2. **Use real content** - Not placeholder text
3. **Show different screens** - At least 3-5 screenshots
4. **Highlight unique features** - What makes Vertikal special
5. **Keep text readable** - Use clear, large fonts
6. **Match app design** - Consistent with your brand

---

## 🔧 SAFE AREA INSETS CONFIGURATION

Your web app should handle safe area insets for modern iPhones (notch, Dynamic Island). Add this to your main CSS:

```css
/* Safe area insets for iOS */
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
}

/* Apply to body or main container */
body {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
}

/* Or use in specific containers */
.header {
  padding-top: calc(20px + var(--safe-area-inset-top));
}

.footer {
  padding-bottom: calc(20px + var(--safe-area-inset-bottom));
}
```

**In your HTML `<head>`:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

The `viewport-fit=cover` is crucial for safe area insets to work.

---

## 🔗 DEEP LINKING CONFIGURATION

Deep linking is configured for `alphavisualartists.com`. To test:

1. **On your iPhone**, open Safari
2. **Navigate to:** `https://alphavisualartists.com/some-path`
3. **If app is installed**, iOS will prompt to open in Vertikal app
4. **In your web app**, handle deep links:
   ```javascript
   // Check if running in Capacitor
   import { App } from '@capacitor/app';
   
   App.addListener('appUrlOpen', (data) => {
     const url = data.url;
     // Handle the deep link URL
     console.log('Deep link opened:', url);
   });
   ```

---

## 📝 CHECKLIST BEFORE SUBMISSION

### **Code:**
- [ ] App builds without errors
- [ ] Tested on physical iPhone
- [ ] All features work correctly
- [ ] No console errors
- [ ] App icons replaced (not placeholders)
- [ ] Splash screen configured

### **App Store Connect:**
- [ ] App listing created
- [ ] All required screenshots uploaded
- [ ] App description complete
- [ ] Privacy policy URL added
- [ ] Age rating completed
- [ ] Build selected and ready
- [ ] Export compliance answered

### **Testing:**
- [ ] Tested on iPhone (not just simulator)
- [ ] Tested deep linking
- [ ] Tested camera/photo permissions (if used)
- [ ] Tested on different iOS versions (if possible)
- [ ] Tested safe area insets on iPhone with notch

---

## 🐛 TROUBLESHOOTING

### **Build Errors:**

**"No such module 'Capacitor'"**
```bash
cd ios/App
pod install
```

**"Signing for 'App' requires a development team"**
- Go to Xcode → Signing & Capabilities
- Select your Apple Developer team

**"Bundle identifier already exists"**
- Change bundle ID or use your existing app in App Store Connect

### **Runtime Errors:**

**White screen on launch**
- Check that `dist/index.html` exists
- Run `npm run sync:ios` again
- Check Xcode console for errors

**Deep linking not working**
- Verify Associated Domains in Xcode
- Check `capacitor.config.ts` server settings
- Ensure domain has Apple App Site Association file

---

## 📚 ADDITIONAL RESOURCES

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Apple App Store Connect:** https://appstoreconnect.apple.com
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/

---

## ✅ QUICK REFERENCE COMMANDS

```bash
# Build web app and sync to iOS
npm run build:ios

# Sync only (after building)
npm run sync:ios

# Open in Xcode
npm run open:ios

# Generate placeholder icons
./scripts/generate-placeholder-icons.sh
```

---

**Setup Complete!** 🎉

Your Vertikal app is now ready for iOS development and App Store submission. Follow the steps above to build, test, and submit your app.

**Next Steps:**
1. Replace placeholder app icons with your design
2. Build and test on a physical device
3. Create App Store screenshots
4. Submit to App Store Connect
5. Wait for review (typically 24-48 hours)

Good luck with your App Store submission! 🚀
