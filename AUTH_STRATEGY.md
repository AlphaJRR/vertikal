# 🔐 Authentication Strategy Plan

**Date:** December 12, 2024  
**Status:** 📋 PLANNING PHASE

---

## 🎯 Authentication Requirements

### Core Features Needed
1. **User Registration** - Email/password signup
2. **User Login** - Email/password authentication
3. **JWT Token Management** - Access tokens + refresh tokens
4. **Protected Routes** - API endpoints requiring authentication
5. **Token Refresh** - Automatic token renewal
6. **Password Security** - Bcrypt hashing
7. **Session Management** - Token storage and validation

---

## 📐 Architecture Overview

### Flow Diagram
```
Mobile App                    Backend API                  Database
    |                              |                          |
    |-- POST /api/auth/register -->|                          |
    |                              |-- Hash password -------->|
    |                              |-- Create user ---------->|
    |<-- JWT token + user data ---|                          |
    |                              |                          |
    |-- POST /api/auth/login ----->|                          |
    |                              |-- Verify password ------->|
    |<-- JWT token + user data ---|                          |
    |                              |                          |
    |-- Store token (AsyncStorage) |                          |
    |                              |                          |
    |-- GET /api/users (with token)|                          |
    |                              |-- Verify JWT ----------->|
    |<-- Protected data ----------|                          |
```

---

## 🔧 Implementation Plan

### Phase 1: Backend Authentication (Priority 1)

#### 1.1 Install Dependencies
```bash
cd backend
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

#### 1.2 Create Auth Routes (`backend/src/routes/auth.ts`)
```typescript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, password, and username are required' 
      });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        role: 'USER',
        coinBalance: 0,
      },
      include: {
        profile: true,
      },
    });
    
    // Generate tokens
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          coinBalance: user.coinBalance,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register user' 
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Generate tokens
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          coinBalance: user.coinBalance,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to login' 
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Refresh token required' 
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid refresh token' 
      });
    }
    
    // Generate new access token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      data: { token },
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid refresh token' 
    });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    // Auth middleware will attach user to req
    const userId = (req as any).userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        coinBalance: user.coinBalance,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get user' 
    });
  }
});

export default router;
```

#### 1.3 Create Auth Middleware (`backend/src/middleware/auth.ts`)
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};
```

#### 1.4 Update Backend Server (`backend/src/index.ts`)
```typescript
import authRouter from './routes/auth';
import { authMiddleware } from './middleware/auth';

// Add auth routes
app.use('/api/auth', authRouter);

// Protect routes with auth middleware
app.use('/api/users', authMiddleware, usersRouter);
// Or protect specific routes:
// router.get('/me', authMiddleware, getCurrentUser);
```

---

### Phase 2: Mobile App Integration (Priority 2)

#### 2.1 Update API Client (`services/api.ts`)
- ✅ Already configured with token storage
- ✅ Request interceptor adds Bearer token
- ✅ Response interceptor handles 401 errors

#### 2.2 Update Auth Hooks (`hooks/useAuth.ts`)
- ✅ Already implemented
- ✅ Uses `backendClient.auth.login()`
- ✅ Stores tokens in AsyncStorage
- ✅ Sets Sentry user context

#### 2.3 Create Auth UI Screens (Priority 3)
- Login screen
- Register screen
- Protected route wrapper
- Token refresh logic

---

## 🔒 Security Considerations

### Password Security
- ✅ Use bcrypt with salt rounds (10)
- ✅ Never store plaintext passwords
- ✅ Validate password strength (min 8 chars, complexity)

### Token Security
- ✅ Use HTTPS in production
- ✅ Store tokens securely (AsyncStorage → SecureStore for production)
- ✅ Implement token refresh mechanism
- ✅ Set appropriate expiration times (24h access, 7d refresh)

### API Security
- ✅ Validate all inputs
- ✅ Rate limiting for auth endpoints
- ✅ CORS configuration
- ✅ Environment variables for secrets

---

## 📋 Implementation Checklist

### Backend
- [ ] Install `jsonwebtoken` and `bcryptjs`
- [ ] Create `/api/auth/register` endpoint
- [ ] Create `/api/auth/login` endpoint
- [ ] Create `/api/auth/refresh` endpoint
- [ ] Create `/api/auth/me` endpoint
- [ ] Create auth middleware
- [ ] Add auth middleware to protected routes
- [ ] Add JWT_SECRET to environment variables
- [ ] Test all auth endpoints

### Mobile App
- [ ] Verify `useAuth` hooks work with new endpoints
- [ ] Test token storage and retrieval
- [ ] Test automatic token refresh
- [ ] Create login UI screen
- [ ] Create register UI screen
- [ ] Add protected route navigation
- [ ] Test end-to-end auth flow

---

## 🧪 Testing Plan

### Backend Tests
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","username":"testuser"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get current user (with token)
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mobile App Tests
- [ ] Register new user
- [ ] Login with credentials
- [ ] Access protected endpoints
- [ ] Token refresh on expiration
- [ ] Logout clears tokens
- [ ] Error handling for invalid credentials

---

## 🚀 Deployment Considerations

### Environment Variables
```bash
# backend/.env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
```

### Production Security
- Use strong, randomly generated secrets
- Enable HTTPS only
- Implement rate limiting
- Add request logging
- Monitor auth failures

---

## 📝 Next Steps

1. **Implement backend auth routes** (Phase 1)
2. **Test auth endpoints** with curl/Postman
3. **Update mobile app** to use new endpoints
4. **Create auth UI screens**
5. **Test end-to-end auth flow**
6. **Deploy and monitor**

---

**Status:** Ready for implementation  
**Estimated Time:** 4-6 hours  
**Priority:** HIGH (Required for user features)

