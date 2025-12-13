# VERTIKAL Backend Setup Guide

## Quick Start

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your DATABASE_URL
# For PostgreSQL:
DATABASE_URL="postgresql://user:password@localhost:5432/vertikal?schema=public"

# OR for SQLite (local dev):
DATABASE_URL="file:./dev.db"
```

### 4. Initialize Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Connecting Mobile App to Backend

Update your mobile app's API configuration to point to:
- **Local Development**: `http://localhost:3001` (use your computer's IP for physical device)
- **Production**: Your deployed backend URL

Example API call from React Native:
```typescript
const API_URL = 'http://YOUR_IP:3001';

// Fetch shows
const response = await fetch(`${API_URL}/api/shows`);
const data = await response.json();
```

## API Endpoints Overview

### Users & Profiles
- `GET /api/users/:id` - Get user details
- `GET /api/users/profile/:username` - Get profile with shows

### Content
- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Get show with seasons/episodes

### Vibe Mode (Danmaku Comments)
- `GET /api/comments/episode/:episodeId` - All comments
- `GET /api/comments/episode/:episodeId?vibeMode=true` - Danmaku only
- `POST /api/comments` - Create comment/Danmaku

### Monetization
- `GET /api/transactions/user/:userId` - Transaction history
- `POST /api/transactions/coins` - Purchase coins
- `GET /api/subscriptions/user/:userId` - Active subscriptions
- `POST /api/subscriptions` - Subscribe ($4.99/mo)

## Database Schema

The Prisma schema is located at `/prisma/schema.prisma` and includes:
- User authentication & profiles
- Shows, Seasons, Episodes
- Comments (with Danmaku/Vibe Mode support)
- Transactions & Subscriptions
- Analytics

## Next Steps

1. **Set up database** (PostgreSQL or SQLite)
2. **Run migrations** to create tables
3. **Seed database** with initial data (optional)
4. **Connect mobile app** to backend API
5. **Deploy backend** to production (Vercel, Railway, etc.)

For detailed API documentation, see `backend/README.md`

