# 📱 AVA Media iOS Deployment Guide

**App Name:** AVA Media  
**Bundle ID:** `com.alphavisualartists.avamedia`  
**Display Name:** AVA Media  
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
- ✅ Splash screen support (black background)
- ✅ Safe area insets
- ✅ Webview settings optimized

---

## 🚀 BUILDING FOR APP STORE

### **Step 1: Build Your Web App**

First, ensure your React + Vite app is built:

```bash
# Build your Vite app (outputs to dist/)
npm run build:web

# Or if you have a custom build command
npm run build
```

**Important:** Make sure your build outputs to the `dist/` folder, as this is what Capacitor syncs to iOS.

### **Step 2: Sync to iOS**

```bash
# Sync web assets to iOS project
npm run sync:ios

# Or use the combined command (build + sync)
npm run build:ios
```

### **Step 3: Open in Xcode**

```bash
npm run open:ios
```

This will open the project in Xcode where you can build, test, and archive.

---

## 📋 XCODE STEPS FOR APP STORE SUBMISSION

### **Step 1: Configure Signing & Capabilities**

1. **Open Xcode** (via `npm run open:ios` or manually open `ios/App/App.xcworkspace`)

2. **Select the Project** in Xcode navigator (top "App" item)

3. **Select the "App" target** (under TARGETS in the main editor)

4. **Go to "Signing & Capabilities" tab**

#### **Signing:**
- ✅ Check **"Automatically manage signing"**
- Select your **Team** (your Apple Developer account)
- **Bundle Identifier** should be: `com.alphavisualartists.avamedia`
  - If it shows something else, change it to match exactly
- Xcode will automatically create/update provisioning profiles

#### **Capabilities (if needed):**
- **Camera** - Already configured in Info.plist
- **Photo Library** - Already configured in Info.plist
- **Associated Domains** (for deep linking):
  - Click **"+ Capability"** → Add **"Associated Domains"**
  - Add: `applinks:alphavisualartists.com`
  - Add: `applinks:*.alphavisualartists.com`

### **Step 2: Configure App Version**

1. **Select the "App" target**
2. **Go to "General" tab**
3. Set:
   - **Version:** `1.0.0` (or your version number)
   - **Build:** `1` (increment this for each submission)
   - **Display Name:** `AVA Media`
   - **Bundle Identifier:** `com.alphavisualartists.avamedia`

### **Step 3: Configure App Icons**

1. **Go to "Assets" in Xcode navigator** (left sidebar)
2. **Select "AppIcon"**
3. **Drag your app icons:**
   - **1024x1024** PNG (required for App Store)
   - Place in the **"App Store"** slot (1024x1024)

**Note:** Currently using placeholder icons. Replace with your actual design:
- Create a 1024x1024 PNG icon
- Place in `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`
- Or use the script: `./scripts/generate-placeholder-icons.sh` (if ImageMagick installed)

### **Step 4: Test on Device**

1. **Connect your iPhone** via USB
2. **Select your device** from the device dropdown (top toolbar, next to Play button)
3. **Click the Play button** (▶️) or press `Cmd + R`
4. **Trust the developer** on your iPhone:
   - Settings → General → VPN & Device Management
   - Tap your developer certificate → Trust

### **Step 5: Archive for App Store**

1. **Select "Any iOS Device"** from device dropdown (NOT a simulator)
   - This is critical - you cannot archive from a simulator
2. **Product menu → Archive**
   - Or press `Cmd + B` to build first, then Archive
3. **Wait for archive to complete** (may take a few minutes)
   - You'll see a progress indicator in Xcode

### **Step 6: Distribute to App Store**

1. **Window menu → Organizer** (or press `Cmd + Shift + 9`)
2. **Select your archive** (should show "AVA Media" with today's date)
3. **Click "Distribute App"** button
4. **Choose distribution method:**
   - Select **"App Store Connect"**
   - Click **"Next"**
5. **Choose distribution options:**
   - Select **"Upload"** (automatically upload to App Store Connect)
   - Click **"Next"**
6. **Choose signing:**
   - Select **"Automatically manage signing"**
   - Click **"Next"**
7. **Review and upload:**
   - Review the summary
   - Click **"Upload"**
8. **Wait for upload to complete** (may take 10-30 minutes)
   - You'll see progress in Xcode
   - Check for any errors in the upload log

---

## 🏪 APP STORE CONNECT CONFIGURATION

### **Step 1: Create App Listing**

1. **Go to:** https://appstoreconnect.apple.com
2. **Sign in** with your Apple Developer account
3. **Click "My Apps"**
4. **Click the "+" button** → **"New App"**
5. **Fill in the form:**
   - **Platform:** iOS
   - **Name:** `AVA Media`
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** `com.alphavisualartists.avamedia`
     - Select from dropdown (should appear after you upload a build)
   - **SKU:** `ava-media-ios-001` (unique identifier, can be anything)
   - **User Access:** Full Access
6. **Click "Create"**

### **Step 2: App Information**

1. **Go to "App Information" tab**
2. **Fill in:**
   - **Category:**
     - Primary: **Entertainment** (or most appropriate category)
     - Secondary: (optional)
   - **Content Rights:** ✅ Check "I have the rights to use all content"
   - **Age Rating:** Click **"Edit"** and complete questionnaire
     - For a video production portfolio, likely **17+** due to video content

### **Step 3: Pricing and Availability**

1. **Go to "Pricing and Availability" tab**
2. **Set:**
   - **Price:** Free or Paid (your choice)
   - **Availability:** 
     - Select countries (or "All Countries")
   - **Schedule:** 
     - Available immediately, or
     - Schedule for a specific date

### **Step 4: Prepare for Submission**

#### **Version Information:**
1. **Go to "App Store" tab** (left sidebar)
2. **Click "+ Version"** or select existing version
3. **Fill in:**
   - **Version:** `1.0.0` (must match Xcode version)
   - **What's New in This Version:** Your release notes
     - Example: "Initial release of AVA Media - Portfolio and platform for video production company"

#### **App Screenshots:**
You need screenshots for different iPhone sizes. See "Generating Screenshots" section below.

**Required sizes:**
- **iPhone 6.7" Display** (iPhone 14 Pro Max, 15 Pro Max) - ✅ Required
- **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max) - ✅ Required
- **iPhone 5.5" Display** (iPhone 8 Plus) - ⚠️ Recommended

#### **App Preview Video (Optional):**
- 15-30 seconds
- Same sizes as screenshots
- Shows app in action

#### **Description:**
1. **Scroll to "Description" section**
2. **Fill in:**
   - **Subtitle:** Short tagline (30 characters max)
     - Example: "Video Production Portfolio Platform"
   - **Description:** Full app description (up to 4000 characters)
     - Describe your portfolio/platform features
     - Highlight key functionality
   - **Keywords:** Comma-separated keywords (100 characters max)
     - Example: "video,production,portfolio,media,filmmaking"
   - **Support URL:** Your support website
     - Example: `https://alphavisualartists.com/support`
   - **Marketing URL:** (optional)
     - Example: `https://alphavisualartists.com`

#### **App Icon:**
- **1024 x 1024 PNG**
- No transparency
- No rounded corners (Apple adds them automatically)
- Upload in the "App Icon" section

#### **Privacy Policy:**
- **Privacy Policy URL:** Required (must be publicly accessible)
  - Example: `https://alphavisualartists.com/privacy`
- **Privacy Choices:** If you collect user data, specify what data

### **Step 5: Build Selection**

1. **After uploading archive from Xcode, wait 10-30 minutes**
2. **Go to "TestFlight" tab** (optional - for beta testing)
   - You can test your build here before submitting
3. **Go to "App Store" tab → Your Version → Build section**
4. **Click "+" next to Build**
5. **Select your uploaded build** (should show version and build number)
6. **Click "Done"**

### **Step 6: Submit for Review**

1. **Complete all required sections** (marked with ⚠️ warning icons)
2. **Review all information** carefully
3. **Scroll to top and click "Submit for Review"** button
4. **Answer export compliance questions:**
   - **Uses encryption:** Yes (HTTPS uses encryption)
   - **Export compliance:** Usually "No" unless using custom encryption
   - **App uses encryption:** Select appropriate option
5. **Click "Submit"**
6. **Confirmation:** You'll see "Waiting for Review" status

**Review Timeline:**
- Typically 24-48 hours for first submission
- Updates usually faster (12-24 hours)

---

## 📸 GENERATING APP STORE SCREENSHOTS

### **Method 1: Using iOS Simulator (Recommended)**

1. **Open Xcode**
2. **Run app in Simulator:**
   ```bash
   npm run open:ios
   # Then in Xcode, select a simulator and run
   ```
3. **Select device:**
   - **iPhone 14 Pro Max** (6.7" display)
   - **iPhone 11 Pro Max** (6.5" display)
   - **iPhone 8 Plus** (5.5" display)
4. **Navigate to key screens:**
   - Home/main screen
   - Portfolio gallery
   - Video player
   - About/contact screen
5. **Take screenshots:**
   - **Simulator menu → Device → Screenshot**
   - Or press `Cmd + S` in Simulator
6. **Screenshots saved to:** `~/Desktop/` (default)

### **Method 2: Using Physical Device**

1. **Run app on your iPhone** (via Xcode)
2. **Navigate to key screens**
3. **Take screenshots:**
   - **iPhone X and later:** `Side button + Volume up`
   - **iPhone 8 and earlier:** `Home + Side button`
4. **Transfer to Mac:**
   - AirDrop
   - Photos app sync
   - iCloud Photos

### **Method 3: Using Design Tools**

Create mockups in design tools:
- **Figma** - Export at exact sizes
- **Sketch** - Export at exact sizes
- **Photoshop** - Create artboards at exact sizes

### **Required Screenshot Sizes:**

| Device | Size (pixels) | Required |
|--------|--------------|----------|
| iPhone 6.7" (14 Pro Max) | 1290 x 2796 | ✅ Yes |
| iPhone 6.5" (11 Pro Max) | 1242 x 2688 | ✅ Yes |
| iPhone 5.5" (8 Plus) | 1242 x 2208 | ⚠️ Recommended |

### **Screenshot Best Practices:**

1. **Show key features:**
   - Home screen with portfolio
   - Video player in action
   - Gallery/portfolio view
   - Contact/about section

2. **Use real content:**
   - Not placeholder text
   - Actual portfolio work
   - Professional imagery

3. **Show different screens:**
   - At least 3-5 screenshots
   - Different sections of your app

4. **Highlight unique features:**
   - What makes AVA Media special
   - Video production focus
   - Portfolio showcase

5. **Keep text readable:**
   - Use clear, large fonts
   - Ensure contrast

6. **Match app design:**
   - Consistent with your brand
   - Professional appearance

### **Uploading Screenshots:**

1. **In App Store Connect:**
   - Go to your app → App Store tab → Version
   - Scroll to "App Screenshots"
   - Click "+" for each required size
   - Upload your screenshots
   - Drag to reorder (first screenshot is most important)

---

## 🔧 SAFE AREA INSETS CONFIGURATION

Your React + Vite web app should handle safe area insets for modern iPhones (notch, Dynamic Island). Add this to your main CSS file:

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

/* For fixed headers/footers */
.fixed-header {
  top: var(--safe-area-inset-top);
  padding-top: 20px;
}
```

**In your HTML `<head>` (index.html):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

The `viewport-fit=cover` is **crucial** for safe area insets to work properly.

---

## 🔗 DEEP LINKING CONFIGURATION

Deep linking is configured for `alphavisualartists.com`. 

### **To Enable in Xcode:**

1. **Go to Signing & Capabilities tab**
2. **Click "+ Capability"**
3. **Add "Associated Domains"**
4. **Add domains:**
   - `applinks:alphavisualartists.com`
   - `applinks:*.alphavisualartists.com`

### **To Test Deep Linking:**

1. **On your iPhone**, open Safari
2. **Navigate to:** `https://alphavisualartists.com/some-path`
3. **If app is installed**, iOS will prompt to open in AVA Media app
4. **In your web app**, handle deep links:
   ```javascript
   // Check if running in Capacitor
   import { App } from '@capacitor/app';
   
   App.addListener('appUrlOpen', (data) => {
     const url = data.url;
     // Handle the deep link URL
     console.log('Deep link opened:', url);
     // Navigate to the appropriate route
   });
   ```

### **Apple App Site Association File:**

For deep linking to work, you need an `apple-app-site-association` file on your server:
- Location: `https://alphavisualartists.com/.well-known/apple-app-site-association`
- Content type: `application/json`
- No file extension

Example content:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.alphavisualartists.avamedia",
        "paths": ["*"]
      }
    ]
  }
}
```

Replace `TEAM_ID` with your Apple Developer Team ID (found in Apple Developer account).

---

## 📝 PRE-SUBMISSION CHECKLIST

### **Code:**
- [ ] App builds without errors in Xcode
- [ ] Tested on physical iPhone (not just simulator)
- [ ] All features work correctly
- [ ] No console errors
- [ ] App icons replaced (not placeholders)
- [ ] Splash screen displays correctly
- [ ] Safe area insets work on iPhone with notch

### **App Store Connect:**
- [ ] App listing created
- [ ] All required screenshots uploaded (6.7" and 6.5" minimum)
- [ ] App description complete
- [ ] Privacy policy URL added and accessible
- [ ] Age rating completed
- [ ] Build selected and ready
- [ ] Export compliance questions answered

### **Testing:**
- [ ] Tested on iPhone (not just simulator)
- [ ] Tested deep linking (if implemented)
- [ ] Tested camera/photo permissions (if used)
- [ ] Tested on different iOS versions (if possible)
- [ ] Tested safe area insets on iPhone with notch/Dynamic Island
- [ ] Tested in both portrait and landscape (if supported)

### **Assets:**
- [ ] App icon: 1024x1024 PNG (no transparency, no rounded corners)
- [ ] Screenshots: All required sizes
- [ ] App preview video: (optional but recommended)

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
- Ensure "Automatically manage signing" is checked

**"Bundle identifier already exists"**
- Change bundle ID in Xcode (Signing & Capabilities)
- Or use your existing app in App Store Connect
- Ensure it matches: `com.alphavisualartists.avamedia`

**"The bundle identifier is invalid"**
- Check for special characters (only letters, numbers, dots, hyphens allowed)
- Ensure it matches exactly: `com.alphavisualartists.avamedia`

### **Runtime Errors:**

**White screen on launch**
- Check that `dist/index.html` exists
- Run `npm run build:web` first
- Then run `npm run sync:ios`
- Check Xcode console for errors

**App crashes immediately**
- Check Xcode console for error messages
- Verify all Capacitor plugins are installed
- Check that web assets synced correctly

**Deep linking not working**
- Verify Associated Domains in Xcode
- Check `capacitor.config.ts` server settings
- Ensure domain has Apple App Site Association file
- Test with `https://alphavisualartists.com` in Safari

### **Upload Errors:**

**"Invalid Bundle"**
- Check that you selected "Any iOS Device" (not simulator)
- Verify bundle identifier matches App Store Connect
- Check version numbers match

**"Missing Compliance"**
- Answer export compliance questions
- Usually: "Uses encryption: Yes" and "Export compliance: No"

---

## 📚 ADDITIONAL RESOURCES

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Apple App Store Connect:** https://appstoreconnect.apple.com
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/
- **Apple Developer Portal:** https://developer.apple.com

---

## ✅ QUICK REFERENCE COMMANDS

```bash
# Build web app and sync to iOS
npm run build:ios

# Build web app only
npm run build:web

# Sync only (after building)
npm run sync:ios

# Open in Xcode
npm run open:ios

# Generate placeholder icons (if ImageMagick installed)
./scripts/generate-placeholder-icons.sh
```

---

## 🎯 SUMMARY

Your AVA Media app is now configured for iOS with:
- ✅ Bundle ID: `com.alphavisualartists.avamedia`
- ✅ Display Name: AVA Media
- ✅ Dark theme status bar
- ✅ Camera/photo permissions
- ✅ Deep linking for alphavisualartists.com
- ✅ Safe area insets support
- ✅ Build scripts ready

**Next Steps:**
1. Build your web app: `npm run build:web`
2. Sync to iOS: `npm run sync:ios`
3. Open in Xcode: `npm run open:ios`
4. Replace app icons with your design
5. Test on physical device
6. Create screenshots
7. Submit to App Store Connect

**Good luck with your App Store submission!** 🚀

---

**Last Updated:** January 23, 2025
