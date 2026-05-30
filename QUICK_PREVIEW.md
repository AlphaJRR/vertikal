# 🚀 Quick Preview Commands

## ⚠️ IMPORTANT: Run from Project Directory

Make sure you're in the project directory first:

```bash
cd /Users/alphavisualartists/Vertikal-App
```

---

## 📱 Preview in iOS Simulator/Device

```bash
# Step 1: Navigate to project (if not already there)
cd /Users/alphavisualartists/Vertikal-App

# Step 2: Build and open in Xcode
npm run build:web && npm run sync:ios && npm run open:ios
```

**Or use the automated script:**

```bash
cd /Users/alphavisualartists/Vertikal-App
./preview-app.sh
```

---

## 🌐 Quick Web Preview (No iOS)

```bash
cd /Users/alphavisualartists/Vertikal-App
npm run dev
```

Then open: `http://localhost:3000`

---

## ✅ Verify You're in the Right Directory

```bash
# Check current directory
pwd

# Should show: /Users/alphavisualartists/Vertikal-App

# Verify package.json exists
ls package.json
```

---

## 🔧 If Commands Still Fail

```bash
# Make sure you're in the project directory
cd /Users/alphavisualartists/Vertikal-App

# Verify package.json exists
ls -la package.json

# Then run commands
npm run build:web
```
