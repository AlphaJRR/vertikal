# 🔧 ENGINEER HANDOFF NOTES — SIGNUP SYSTEM

**Author:** CURSOR — Senior Engineer  
**Date:** December 15, 2024  
**Status:** Code Review Complete

---

## 🎯 HOW AUTH WORKS

### **Current System Architecture**

**Backend (Node.js/Express):**
- **Location:** `backend/src/routes/auth.ts`
- **Method:** JWT-based authentication
- **Database:** Prisma + PostgreSQL
- **Endpoints:**
  - `POST /api/auth/register` — Creates user in `User` table
  - `POST /api/auth/login` — Validates credentials, returns JWT
  - `GET /api/auth/me` — Returns current user + profile

**Frontend (React Native):**
- **Hooks:** `hooks/useAuth.ts` (React Query mutations)
- **Token Storage:** SecureStore (`utils/auth.ts`)
- **Profile Setup:** `screens/auth/SetupProfileScreen.tsx`

**Profile Creation:**
- **Endpoint:** `PUT /api/users/profile` (`backend/src/routes/users.ts`)
- **Method:** Uses Prisma `upsert` (prevents duplicates)
- **Trigger:** User manually completes profile after signup

---

## 📍 WHERE PROFILES ARE WRITTEN

### **Profile Creation Flow:**

1. **User registers** → `POST /api/auth/register`
   - Creates `User` record (email, username, passwordHash)
   - **NO profile created yet**

2. **User logs in** → `POST /api/auth/login`
   - Returns JWT token + user data
   - Profile may or may not exist

3. **User completes profile** → `PUT /api/users/profile`
   - **File:** `backend/src/routes/users.ts:192`
   - Uses `prisma.profile.upsert()` — **SAFE** (prevents duplicates)
   - Creates or updates profile linked to `userId`

### **Database Schema:**

- **Table:** `Profile` (Prisma schema)
- **Key:** `userId` (foreign key to `User.id`)
- **Unique Constraint:** `username` on `User` table (enforced)

---

## 🔍 WHERE TO LOOK IF SIGNUP BREAKS

### **1. Registration Fails**

**Check:**
- `backend/src/routes/auth.ts:21-94`
- **Error:** Email/username already exists → Returns 409
- **Error:** Validation fails → Returns 400
- **Error:** Database error → Returns 500

**Logs:** Check backend console for "Registration error"

### **2. Login Fails**

**Check:**
- `backend/src/routes/auth.ts:97-140`
- **Error:** Invalid credentials → Returns 401
- **Error:** User not found → Returns 401
- **Error:** Password mismatch → Returns 401

**Logs:** Check backend console for "Login error"

### **3. Profile Creation Fails**

**Check:**
- `backend/src/routes/users.ts:121-246`
- **Error:** Username taken → Returns 409
- **Error:** Validation fails → Returns 400
- **Error:** Database constraint → Returns 409

**Logs:** Check backend console for "Profile Update Error"

### **4. Token Validation Fails**

**Check:**
- `backend/src/middleware/auth.ts:27-61`
- **Error:** Missing token → Returns 401
- **Error:** Invalid token → Returns 403
- **Error:** Expired token → Returns 403

**Logs:** Check backend console for "Auth middleware error"

---

## 🧪 HOW TO TEST LOCALLY

### **1. Start Backend**

```bash
cd backend
npm install
npm run dev
```

**Verify:** Backend running on `http://localhost:3000`

### **2. Test Registration**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "testuser"
  }'
```

**Expected:** `{ "token": "...", "user": {...} }`

### **3. Test Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected:** `{ "token": "...", "user": {...} }`

### **4. Test Profile Creation**

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "username": "testuser",
    "displayName": "Test User",
    "avatarUrl": null
  }'
```

**Expected:** `{ "user": {...} }`

### **5. Test Current User**

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected:** `{ "id": "...", "username": "...", "profile": {...} }`

---

## 🔐 ENVIRONMENT VARIABLES REQUIRED

### **Backend (.env):**

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret-key-here
NODE_ENV=production
PORT=3000
```

### **Frontend (.env):**

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=https://...
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

---

## ⚠️ CRITICAL NOTES

1. **Profile is NOT auto-created on signup**
   - User must complete profile setup manually
   - Check `currentUser.profile` to determine if setup needed

2. **Username uniqueness is enforced**
   - Backend checks before insert
   - Database constraint as backup
   - Returns 409 if taken

3. **JWT tokens expire in 24 hours**
   - User must re-login after expiration
   - No refresh token mechanism (yet)

4. **Profile upsert is safe**
   - Uses Prisma `upsert` — prevents race conditions
   - Creates if missing, updates if exists

---

**Status:** ✅ Code Review Complete  
**Next:** See `SIGNUP_SYSTEM_CODE_REVIEW.md` for detailed findings

