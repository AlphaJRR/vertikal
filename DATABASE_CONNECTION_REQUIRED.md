# 🗄️ Database Connection Required

**Status:** ⚠️ **BLOCKER - Database Not Connected**

---

## Current Error

```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Impact:**
- Cannot run `prisma db push`
- Cannot seed database
- Backend API cannot fetch data
- Mobile app cannot connect to backend

---

## Quick Setup Options

### Option 1: Neon.tech Cloud PostgreSQL (Recommended - 2 minutes)

1. **Sign up:** https://neon.tech (free tier available)
2. **Create project:** Name it "vertikal"
3. **Copy connection string** from dashboard
4. **Update `backend/.env`:**
   ```bash
   DATABASE_URL="postgresql://user:password@host.neon.tech/vertikal?sslmode=require"
   ```
5. **Run commands:**
   ```bash
   cd backend
   npx prisma db push --schema=../prisma/schema.prisma --accept-data-loss
   npm run seed
   ```

---

### Option 2: Docker PostgreSQL (5 minutes)

**Prerequisites:** Docker Desktop installed

```bash
# Start PostgreSQL container
docker run --name vertikal-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vertikal \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps | grep vertikal-postgres

# Update backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vertikal?schema=public"

# Run commands
cd backend
npx prisma db push --schema=../prisma/schema.prisma --accept-data-loss
npm run seed
```

---

### Option 3: Local PostgreSQL (10 minutes)

**macOS:**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb vertikal

# Update backend/.env
DATABASE_URL="postgresql://$(whoami)@localhost:5432/vertikal?schema=public"

# Run commands
cd backend
npx prisma db push --schema=../prisma/schema.prisma --accept-data-loss
npm run seed
```

**Linux:**
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb vertikal

# Update backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vertikal?schema=public"

# Run commands
cd backend
npx prisma db push --schema=../prisma/schema.prisma --accept-data-loss
npm run seed
```

---

## After Database is Connected

### Step 1: Push Schema
```bash
cd backend
npx prisma db push --schema=../prisma/schema.prisma --accept-data-loss
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Pushed schema to database
```

### Step 2: Seed Database
```bash
npm run seed
```

**Expected Output:**
```
🌱 Starting Seed...
Created VIP: Black Awesomeness
Created VIP: Alpha Visuals
Created VIP: Joshua Argue
Created VIP: Kel Mitchell
Created VIP: J.R.R. Roberts
✅ Army of 200 Created in Database.
```

### Step 3: Verify
```bash
# Check user count (should be 200)
curl http://localhost:4000/api/users | jq 'length'

# Or use Prisma Studio
npm run db:studio
```

---

## Troubleshooting

### "Can't reach database server"
- Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check DATABASE_URL in `backend/.env`
- Verify port 5432 is not blocked by firewall

### "Environment variable not found: DATABASE_URL"
- Ensure `backend/.env` file exists
- Check `.env` file has `DATABASE_URL` set
- Run commands from `backend/` directory

### "Connection refused"
- PostgreSQL service not started
- Wrong port in DATABASE_URL
- Database doesn't exist (create it first)

---

## Next Steps After Database Setup

1. ✅ Push schema: `npx prisma db push --accept-data-loss`
2. ✅ Seed database: `npm run seed`
3. ✅ Start backend: `npm run dev`
4. ✅ Test API: `curl http://localhost:4000/api/users`
5. ✅ Test mobile app connection

---

**Status:** Waiting for database connection  
**Priority:** CRITICAL (blocks all testing)

