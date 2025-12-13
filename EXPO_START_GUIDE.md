# 🚀 Expo Start Guide

## Starting the Mobile App

```bash
npx expo start
```

## Backend Configuration

**API URL:** `http://localhost:4000`
- Configured in `.env`: `EXPO_PUBLIC_API_URL=http://localhost:4000`
- Used in `services/api.ts`: `const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000'`

---

## 📱 Testing the Connection

### 1. Start Backend Server:
```bash
cd backend
npm run dev
# Backend runs on http://localhost:4000
```

### 2. Start Mobile App:
```bash
npx expo start
# Opens Expo DevTools
```

### 3. Test API Connection:
- Open app on simulator/device
- Check network requests in console
- Verify data loads from backend

---

## 🔍 Verification

### Check API URL:
```typescript
// services/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
```

### Expected Endpoints:
- `GET http://localhost:4000/api/users` - Get creators
- `GET http://localhost:4000/api/shows` - Get projects

---

## ✅ Status

| Component | Status | Port |
|-----------|--------|------|
| Backend Server | ⏳ Start with `npm run dev` | 4000 |
| Mobile App | ⏳ Start with `npx expo start` | - |
| API Connection | ✅ Configured | 4000 |

**Ready to test the connection!** 🚀
