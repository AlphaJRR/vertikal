# 🚀 EAS Build Setup - Complete Execution Guide

## ✅ Completed Steps

### 1. EAS CLI Installation
- ✅ EAS CLI installed globally
- ✅ Version: Latest

### 2. Authentication
- ✅ Logged in as: `vertikalapp`
- ✅ Account role: Owner
- ✅ Access to: `vertikalapp`, `vertikalapps-organization`

### 3. Project Initialization
- ✅ Project created: `@vertikalapp/vertikal-mobile`
- ✅ Project ID: `de55a2bd-e36f-4ebd-b775-07527d498c21`
- ✅ Project URL: https://expo.dev/accounts/vertikalapp/projects/vertikal-mobile
- ✅ `app.json` updated with project configuration

### 4. Build Configuration
- ✅ `eas.json` configured with production profile
- ✅ Environment variables set:
  - `NODE_ENV=production`
  - `EXPO_PUBLIC_API_URL=https://api.vertikal.com`
  - `EXPO_PUBLIC_SENTRY_DSN` (from env)
  - `EXPO_PUBLIC_ENABLE_ANALYTICS=true`
  - `EXPO_PUBLIC_ENABLE_SUBSCRIPTIONS=true`
  - `EXPO_PUBLIC_DEBUG_API=false`

---

## ⏳ Required: Interactive Credential Setup

**Both iOS and Android require interactive credential configuration.** This cannot be automated and must be done manually in your terminal.

### Step 1: Set Up Android Credentials

```bash
cd /Users/alphavisualartists/Vertikal-App
eas credentials:configure-build --platform android
```

**What will happen:**
- EAS will prompt: "Generate a new Android Keystore?"
- Select: **Yes** (recommended for first-time setup)
- Credentials will be stored securely on Expo servers
- Future builds will use these credentials automatically

### Step 2: Set Up iOS Credentials

```bash
eas credentials:configure-build --platform ios
```

**What will happen:**
- EAS will check for existing Apple Developer account
- May prompt for Apple ID and team selection
- Will generate/use distribution certificate
- Credentials stored securely on Expo servers

### Alternative: Use Setup Script

```bash
./scripts/setup-eas-credentials.sh
```

This script will guide you through both platforms interactively.

---

## 🚀 After Credentials Are Configured

Once credentials are set up, you can run builds **non-interactively**:

```bash
# Build for both platforms
eas build --platform all --profile production

# Or build separately
eas build --platform ios --profile production
eas build --platform android --profile production
```

**Build Time:** 10-30 minutes per platform

---

## 📋 Build Configuration Details

### iOS Build
- **Build Configuration:** Release
- **Bundle Identifier:** `com.vertikal.app`
- **Distribution:** App Store (via EAS Submit)

### Android Build
- **Build Type:** APK (for testing)
- **Package Name:** `com.vertikal.app`
- **Distribution:** Internal track (via EAS Submit)

**Note:** For Play Store submission, change `buildType` to `"app-bundle"` in `eas.json`

---

## 🔍 Troubleshooting

### "Credentials are not set up"
**Solution:** Run the credential setup commands above

### "Distribution Certificate is not validated"
**Solution:** Complete iOS credential setup interactively

### "Generate a new Android Keystore?"
**Solution:** Select "Yes" for first-time setup

### Build fails with environment variable errors
**Solution:** Ensure `EXPO_PUBLIC_SENTRY_DSN` is set in EAS environment variables or `.env` file

---

## 📊 Current Status

| Component | Status |
|-----------|--------|
| EAS CLI | ✅ Installed |
| Authentication | ✅ Logged in |
| Project Setup | ✅ Initialized |
| Build Config | ✅ Configured |
| Android Credentials | ⏳ **Required (Interactive)** |
| iOS Credentials | ⏳ **Required (Interactive)** |
| Build Execution | ⏳ **Pending Credentials** |

---

## 🎯 Next Steps

1. **Run credential setup** (interactive):
   ```bash
   ./scripts/setup-eas-credentials.sh
   ```

2. **Execute production build**:
   ```bash
   eas build --platform all --profile production
   ```

3. **Monitor build progress**:
   - Builds will appear in: https://expo.dev/accounts/vertikalapp/projects/vertikal-mobile/builds
   - You'll receive email notifications when builds complete

4. **Download builds**:
   ```bash
   eas build:list
   eas build:download [build-id]
   ```

---

**Last Updated:** December 13, 2024  
**Status:** Ready for credential setup → Build execution

