# 🚀 Quick Database Setup

## Current Status
- ✅ Schema configured for PostgreSQL
- ✅ backend/.env created with placeholder DATABASE_URL
- ⏳ Need active PostgreSQL connection

## Fastest Option: Cloud PostgreSQL (2 minutes)

### Neon.tech (Recommended)
1. Go to https://neon.tech
2. Sign up (free)
3. Create project "vertikal"
4. Copy connection string
5. Update `backend/.env`:
   ```
   DATABASE_URL="postgresql://user:password@host.neon.tech/vertikal?sslmode=require"
   ```

### Then Run:
```bash
cd backend
npm run db:push
npm run seed
curl http://localhost:4000/api/users | jq 'length'
# Expected: 200
```

---

## Alternative: Docker PostgreSQL

```bash
# Install Docker Desktop if needed: https://www.docker.com/products/docker-desktop

# Start PostgreSQL
docker run --name vertikal-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vertikal \
  -p 5432:5432 \
  -d postgres:15

# Update backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vertikal?schema=public"

# Then run migrations
cd backend
npm run db:push
npm run seed
```

---

## After Database is Ready

```bash
# Step 1: Push schema
cd backend
npm run db:push

# Step 2: Seed data (200 users)
npm run seed

# Step 3: Verify
curl http://localhost:4000/api/users | jq 'length'
# Expected output: 200

# Step 4: Test mobile app
# App should now load creators from API
```
