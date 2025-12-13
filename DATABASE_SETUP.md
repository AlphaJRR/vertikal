# 🗄️ Database Setup Guide

## Quick Setup Options

### Option 1: Docker PostgreSQL (Recommended for Local Dev)

```bash
# Start PostgreSQL container
docker run --name vertikal-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vertikal \
  -p 5432:5432 \
  -d postgres:15

# Update backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vertikal?schema=public"
```

### Option 2: Cloud PostgreSQL (Free Tier)

**Neon (Recommended):**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update `backend/.env`:
```bash
DATABASE_URL="postgresql://user:password@host.neon.tech/vertikal?sslmode=require"
```

**Supabase:**
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update `backend/.env`

### Option 3: Local PostgreSQL

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb vertikal

# Update backend/.env
DATABASE_URL="postgresql://$(whoami)@localhost:5432/vertikal?schema=public"
```

---

## After Database Setup

```bash
cd backend

# Push schema
npm run db:push

# Seed data (creates 200 users)
npm run seed

# Verify
curl http://localhost:4000/api/users | jq 'length'
# Expected: 200
```

---

## Troubleshooting

**Connection refused:**
- Check PostgreSQL is running
- Verify port 5432 is not blocked
- Check DATABASE_URL format

**Enum errors:**
- PostgreSQL required (SQLite doesn't support enums)
- Use one of the options above

