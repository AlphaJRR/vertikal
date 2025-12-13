# 🚀 VERTIKAL Quick Start Guide

**For:** Development Team  
**Status:** ✅ Ready to Launch

---

## ⚡ Quick Commands

### Start Backend Server
```bash
cd /Users/alphavisualartists/Vertikal-App/backend
npm run dev
```

### Start Mobile App
```bash
cd /Users/alphavisualartists/Vertikal-App
npx expo start
```

---

## 📍 Important: Always Use Full Paths

**Backend:**
```bash
cd /Users/alphavisualartists/Vertikal-App/backend
```

**Mobile App:**
```bash
cd /Users/alphavisualartists/Vertikal-App
```

---

## ✅ Verify Server is Running

```bash
# Health check
curl http://localhost:4000/health

# Get users (should return 200)
curl http://localhost:4000/api/users | jq 'length'
```

---

## 🐛 Common Issues

### "cd: no such file or directory: backend"
**Solution:** Use full path:
```bash
cd /Users/alphavisualartists/Vertikal-App/backend
```

### "npm error ENOENT: Could not read package.json"
**Solution:** You're in the wrong directory. Navigate to project root:
```bash
cd /Users/alphavisualartists/Vertikal-App
# or for backend:
cd /Users/alphavisualartists/Vertikal-App/backend
```

---

## 🚀 Launch Checklist

- [ ] Navigate to backend directory
- [ ] Start backend: `npm run dev`
- [ ] Verify health: `curl http://localhost:4000/health`
- [ ] Navigate to project root
- [ ] Start mobile app: `npx expo start`
- [ ] Test in simulator/emulator

---

**Status:** ✅ Ready  
**Next:** Start backend server from correct directory

