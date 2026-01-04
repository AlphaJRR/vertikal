# Backend Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp env.example .env

# Edit .env with your database credentials
# Update DATABASE_URL with your PostgreSQL connection string
```

Example `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vertikal?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database (if it doesn't exist)
# You may need to create it manually:
# psql -U postgres
# CREATE DATABASE vertikal;

# Run migrations to create tables
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Database Setup (PostgreSQL)

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE vertikal;
   ```
3. Update `DATABASE_URL` in `.env`

### Option 2: Docker

```bash
docker run --name vertikal-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=vertikal \
  -p 5432:5432 \
  -d postgres:15
```

Then use: `DATABASE_URL="postgresql://postgres:password@localhost:5432/vertikal?schema=public"`

### Option 3: Cloud Database (Supabase, Neon, etc.)

1. Create a new PostgreSQL database
2. Copy the connection string
3. Update `DATABASE_URL` in `.env`

## Verify Setup

1. Check health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```

2. Open Prisma Studio to view data:
   ```bash
   npm run prisma:studio
   ```

## Troubleshooting

### Prisma Client not generated
```bash
npm run prisma:generate
```

### Migration issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev --name init
```

### Port already in use
Change `PORT` in `.env` to a different port (e.g., 3002)

## Next Steps

- Connect frontend to backend API
- Set up authentication flow
- Test API endpoints with Postman or curl

