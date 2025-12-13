# VERTIKAL Backend API

Backend API server for the VERTIKAL mobile app.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vertikal?schema=public"
```

For local development with SQLite:
```env
DATABASE_URL="file:./dev.db"
```

### 3. Set Up Database

Generate Prisma Client:
```bash
npm run db:generate
```

Push schema to database (creates tables):
```bash
npm run db:push
```

Or run migrations:
```bash
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3001`

## API Endpoints

### Users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/profile/:username` - Get user profile

### Shows
- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Get show details with seasons/episodes

### Comments (Vibe Mode)
- `GET /api/comments/episode/:episodeId` - Get comments for episode
- `GET /api/comments/episode/:episodeId?vibeMode=true` - Get Danmaku comments only
- `POST /api/comments` - Create comment (can be Danmaku)

### Transactions
- `GET /api/transactions/user/:userId` - Get user's transaction history
- `POST /api/transactions/coins` - Purchase coins

### Subscriptions
- `GET /api/subscriptions/user/:userId` - Get user's active subscriptions
- `POST /api/subscriptions` - Create subscription ($4.99/mo)

### Health Check
- `GET /health` - Server health status

## Database Management

### Prisma Studio (Visual Database Browser)
```bash
npm run db:studio
```

### Generate Prisma Client
```bash
npm run db:generate
```

### Create Migration
```bash
npm run db:migrate
```

### Seed Database with Sample Data
```bash
npm run seed
```

This will generate:
- 200 creators (first 10 are networks, first 50 have Founding 50 badge)
- 100 shows with multiple seasons and episodes

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `STRIPE_SECRET_KEY` - Stripe API key (for payments)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

