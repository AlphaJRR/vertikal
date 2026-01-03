# 🚀 VERTIKAL APP LAUNCH GUIDE

## Quick Start

### **Option 1: Start Metro + Open Simulator (Recommended)**

```bash
# Start Metro bundler and open iOS simulator
npx expo start --ios

# OR start Metro bundler and open Android emulator
npx expo start --android
```

---

### **Option 2: Start Metro Separately**

**Terminal 1 - Metro Bundler:**
```bash
cd /Users/alphavisualartists/Vertikal-App
npx expo start --clear
```

**Terminal 2 - Open Simulator:**
```bash
# iOS Simulator
npx expo start --ios

# OR Android Emulator
npx expo start --android
```

**In Metro Terminal, press:**
- `i` - Open iOS simulator
- `a` - Open Android emulator
- `w` - Open web browser
- `r` - Reload app
- `m` - Toggle menu

---

### **Option 3: Physical Device (Expo Go)**

**1. Install Expo Go:**
- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

**2. Start Metro with Tunnel:**
```bash
npx expo start --tunnel
```

**3. Scan QR Code:**
- iOS: Open Camera app → Scan QR code
- Android: Open Expo Go app → Scan QR code

---

## Troubleshooting

### **Clear Cache:**
```bash
npx expo start --clear
```

### **Reset Metro Cache:**
```bash
rm -rf node_modules/.cache .expo
npx expo start --clear
```

### **Fix Module Resolution Errors:**
```bash
# Clear all caches
rm -rf node_modules/.cache .expo node_modules
npm install
npx expo start --clear
```

### **Check Expo Doctor:**
```bash
npx expo-doctor
```

---

## Environment Setup

### **Required Environment Variables:**
Create `.env` file in project root:
```env
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Development Workflow

### **1. Start Development Server:**
```bash
npx expo start
```

### **2. Hot Reload:**
- Press `r` in Metro terminal to reload
- Shake device → "Reload" (physical device)
- `Cmd+R` (iOS Simulator)
- `R+R` (Android Emulator)

### **3. Open Dev Menu:**
- Shake device (physical)
- `Cmd+D` (iOS Simulator)
- `Cmd+M` (Android Emulator)

---

## Production Build

### **iOS:**
```bash
eas build --platform ios --profile production
```

### **Android:**
```bash
eas build --platform android --profile production
```

---

## Quick Reference

| Command | Action |
|---------|--------|
| `npx expo start` | Start Metro bundler |
| `npx expo start --clear` | Start with cleared cache |
| `npx expo start --ios` | Start + open iOS simulator |
| `npx expo start --android` | Start + open Android emulator |
| `npx expo start --tunnel` | Start with tunnel (for physical device) |
| `npx expo-doctor` | Check for issues |
| `npx expo install <package>` | Install Expo-compatible package |

---

**Status:** ✅ App ready to launch

