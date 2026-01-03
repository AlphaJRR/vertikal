# 🔧 QUICK FIX - Module Resolution Error

## Problem
Metro bundler can't find `useRequireAuth` module.

## Solution Applied
✅ Fixed import path in `screens/JobsScreen.tsx`:
- Changed: `../../hooks/useRequireAuth`
- To: `../hooks/useRequireAuth`

## Restart Metro Now

**Stop Metro (if running):**
```bash
# Press Ctrl+C in Metro terminal
```

**Clear cache and restart:**
```bash
cd /Users/alphavisualartists/Vertikal-App
rm -rf node_modules/.cache .expo
npx expo start --clear
```

**Reload app:**
- Press `r` in Metro terminal
- OR `Cmd+R` in iOS Simulator
- OR `R+R` in Android Emulator

---

## Why This Happened
Metro bundler's cache was stale and the import path was incorrect (`../../` instead of `../`).

**Status:** ✅ Fixed - Restart Metro to apply

