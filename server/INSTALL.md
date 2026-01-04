# Installation Guide

## Prerequisites

### 1. Install Node.js 18+

**macOS (using Homebrew):**
```bash
brew install node
```

**Or download from:**
- https://nodejs.org/
- Choose the LTS version (18.x or higher)

**Verify installation:**
```bash
node -v  # Should show v18.x.x or higher
npm -v   # Should show 9.x.x or higher
```

### 2. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or use Docker:**
```bash
docker run --name vertikal-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=vertikal \
  -p 5432:5432 \
  -d postgres:15
```

**Or use a cloud database:**
- Supabase (free tier available)
- Neon (free tier available)
- Railway
- Render

## Quick Setup

### Option 1: Using the install script

```bash
cd server
chmod +x install.sh
./install.sh
```

### Option 2: Manual setup

```bash
cd server

# 1. Install dependencies
npm install

# 2. Set up environment
cp env.example .env
# Edit .env with your DATABASE_URL

# 3. Generate Prisma Client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Seed database
npm run prisma:seed
```

## Environment Setup

Edit `server/.env`:

```env
# Required: PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/vertikal?schema=public"

# For local PostgreSQL (default):
# DATABASE_URL="postgresql://postgres:password@localhost:5432/vertikal?schema=public"

# For Docker:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/vertikal?schema=public"

# For Supabase:
# DATABASE_URL="postgresql://user:password@db.xxxxx.supabase.co:5432/postgres"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS (frontend URL)
CORS_ORIGIN="http://localhost:5173"
```

## Create Database

If using local PostgreSQL:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vertikal;

# Exit
\q
```

## Run Server

```bash
cd server
npm run dev
```

Server will start on `http://localhost:3001`

## Verify Setup

1. **Check health endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Open Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Or use Homebrew: `brew install node`

### "DATABASE_URL is required"
- Make sure `.env` file exists
- Check that `DATABASE_URL` is set correctly

### "Can't reach database server"
- Verify PostgreSQL is running: `brew services list` (macOS)
- Check connection string in `.env`
- Test connection: `psql $DATABASE_URL`

### Migration errors
- Make sure database exists
- Check DATABASE_URL format
- Try: `npx prisma migrate reset` (WARNING: deletes data)

## Next Steps

After setup is complete:
1. ✅ Backend API is ready
2. Connect frontend to backend
3. Test API endpoints
4. Deploy to production

