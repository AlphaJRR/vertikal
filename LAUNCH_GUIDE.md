# 🚀 VERTIKAL Launch Guide

**For:** Claude, Gemini, GPT, and Development Team  
**Date:** December 12, 2024  
**Status:** ✅ Ready for Launch

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
📡 VERTIKAL Backend live at http://localhost:4000
📊 Health check: http://localhost:4000/health
```

### Step 2: Start Mobile App
```bash
# From project root
npx expo start
```

**Then:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

### Step 3: Verify Connection
- App should load without crashes
- Loading spinner appears
- Creators list displays (200 users from database)
- Projects list displays

---

## 📋 Pre-Launch Checklist

### ✅ Infrastructure (Complete)
- [x] Database connected (Supabase PostgreSQL)
- [x] Schema pushed to database
- [x] 200 users seeded (5 VIPs + 195 creators)
- [x] Backend routes implemented
- [x] API client configured
- [x] Data transformation layer complete
- [x] Error handling implemented
- [x] Sentry integration configured

### ⏳ Required Before Production
- [ ] Backend server started and tested
- [ ] End-to-end testing completed
- [ ] Authentication implemented
- [ ] Backend deployed to cloud
- [ ] Production environment variables set
- [ ] Sentry DSN configured
- [ ] Mobile app tested on real devices

---

## 🔧 Detailed Launch Steps

### 1. Backend Server Setup

#### Start Server
```bash
cd backend
npm run dev
```

#### Verify Server
```bash
# Health check
curl http://localhost:4000/health

# Expected: {"status":"ok","timestamp":"..."}

# Test users endpoint
curl http://localhost:4000/api/users | jq 'length'

# Expected: 200

# Test shows endpoint
curl http://localhost:4000/api/shows

# Expected: Array of shows (may be empty if no shows seeded)
```

#### Troubleshooting
- **Port 4000 in use**: Change `PORT` in `backend/.env`
- **Database connection error**: Check `DATABASE_URL` in `backend/.env`
- **Prisma errors**: Run `npm run db:generate`

---

### 2. Mobile App Setup

#### Start Expo
```bash
npx expo start
```

#### Options
- **iOS Simulator**: Press `i` (requires Xcode)
- **Android Emulator**: Press `a` (requires Android Studio)
- **Physical Device**: Scan QR code with Expo Go app

#### Verify App
- ✅ App loads without crashes
- ✅ Loading spinner appears while fetching data
- ✅ Creators list displays (200 users)
- ✅ Error handling works (disconnect backend, verify error UI)
- ✅ Retry button works

#### Troubleshooting
- **Metro bundler errors**: Clear cache with `npx expo start -c`
- **API connection errors**: Verify backend is running on port 4000
- **Type errors**: Run `npm run type-check` (if available)

---

### 3. Testing Checklist

#### Backend API Tests
```bash
# Health check
curl http://localhost:4000/health

# Get all users
curl http://localhost:4000/api/users

# Get single user (replace {id} with actual user ID)
curl http://localhost:4000/api/users/{id}

# Get all shows
curl http://localhost:4000/api/shows

# Get single show (replace {id} with actual show ID)
curl http://localhost:4000/api/shows/{id}
```

#### Mobile App Tests
- [ ] App loads without crashes
- [ ] Loading states display correctly
- [ ] Creators list loads (200 users)
- [ ] Projects list loads
- [ ] Error states display when backend is down
- [ ] Retry functionality works
- [ ] Navigation between tabs works
- [ ] Images load correctly
- [ ] No console errors

---

## 🚀 Production Deployment

### Backend Deployment

#### Option 1: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Option 2: Render
1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `DATABASE_URL`
   - `PORT=4000`
   - `JWT_SECRET` (for auth)

#### Option 3: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend
vercel
```

### Mobile App Deployment

#### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```bash
# Database
DATABASE_URL="postgresql://postgres:Billion$Company@db.vuwawtzhhcarckybdgbd.supabase.co:5432/postgres"

# Server
PORT=4000

# Authentication (when implemented)
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key"
```

### Mobile App (`.env`)
```bash
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:4000
# Production: EXPO_PUBLIC_API_URL=https://your-backend.railway.app

# Sentry (Error Tracking)
EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_SUBSCRIPTIONS=true
```

---

## 📊 Monitoring & Analytics

### Sentry Error Tracking
1. Sign up at https://sentry.io
2. Create new project (React Native)
3. Copy DSN
4. Update `.env`: `EXPO_PUBLIC_SENTRY_DSN=your-dsn`
5. Errors will automatically be tracked

### Backend Logs
- Check server console for API requests
- Use `morgan` middleware for request logging
- Monitor database connection errors

### Mobile App Logs
- Check Expo DevTools console
- Use React Native Debugger
- Monitor Sentry dashboard for errors

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed**
```bash
# Check DATABASE_URL
cat backend/.env | grep DATABASE_URL

# Test connection
cd backend
npx prisma db execute --stdin <<< "SELECT 1;"
```

**Port Already in Use**
```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 {PID}

# Or change port in backend/.env
PORT=4001
```

**Prisma Errors**
```bash
# Regenerate Prisma Client
cd backend
npm run db:generate
```

### Mobile App Issues

**Metro Bundler Errors**
```bash
# Clear cache
npx expo start -c

# Reset Metro bundler
npx expo start --clear
```

**API Connection Errors**
- Verify backend is running: `curl http://localhost:4000/health`
- Check `EXPO_PUBLIC_API_URL` in `.env`
- For physical device, use computer's IP: `http://192.168.1.X:4000`

**Type Errors**
```bash
# Check TypeScript
npx tsc --noEmit

# Fix import errors
# Ensure all types are imported correctly
```

---

## 📝 Next Steps After Launch

1. **Monitor Errors**: Check Sentry dashboard daily
2. **Collect Feedback**: Gather user feedback
3. **Performance Monitoring**: Track API response times
4. **Feature Iteration**: Add features based on feedback
5. **Authentication**: Implement user authentication
6. **Content Management**: Add shows/projects to database
7. **Analytics**: Set up user analytics tracking

---

## 🤝 Team Collaboration

### Claude (Backend Integration Lead)
- Focus: API integration, data transformation, error handling
- Next: End-to-end testing, authentication support

### Gemini (Backend & Database)
- Focus: Backend routes, database optimization, API design
- Next: Authentication routes, backend deployment

### GPT (Frontend & UX)
- Focus: UI components, user experience, feature development
- Next: Authentication UI, user flows, performance

### Cursor (Implementation & Tooling)
- Focus: File management, dependencies, build configuration
- Next: Testing automation, deployment scripts, documentation

---

## ✅ Success Criteria

### Launch Ready When:
- [x] Database connected and seeded
- [x] Backend routes implemented
- [x] Mobile app integrated
- [ ] Backend server tested
- [ ] End-to-end testing complete
- [ ] No critical errors
- [ ] Performance acceptable

### Production Ready When:
- [ ] Authentication implemented
- [ ] Backend deployed
- [ ] Production environment configured
- [ ] Error tracking active
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] User testing complete

---

**Status:** ✅ Ready for Launch  
**Next:** Start backend server and test end-to-end  
**Team:** Claude + Gemini + GPT working together! 🚀

