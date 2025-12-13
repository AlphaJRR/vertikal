# 🚀 PRODUCTION DEPLOYMENT COMMANDS

**Version:** v1.0.0-RELEASE  
**Date:** December 13, 2024  
**Status:** Ready for Execution

---

## 📋 EXECUTION SEQUENCE

### **Step 1: Database Migration (CLAUDE + GEMI)**

```bash
# Navigate to backend directory
cd backend

# Verify Production DATABASE_URL is set
echo $DATABASE_URL
# Should output: postgresql://...@db.xxx.supabase.co:5432/postgres

# Run migration
npx prisma migrate deploy --schema=../prisma/schema.prisma

# Verify migration success
npx prisma studio --schema=../prisma/schema.prisma
# Check: User table has role, username, bio fields
# Check: Profile table has displayName, avatarUrl fields
```

**Expected Output:**
```
✅ Migration applied successfully
✅ Database schema synced
```

---

### **Step 2: Storage Verification (CLAUDE)**

**Manual Steps in Supabase Dashboard:**

1. Go to **Storage** → **Buckets**
2. Verify `avatars` bucket exists
3. Verify bucket is **Public** ✅
4. Go to **Storage** → **Policies**
5. Verify policies allow:
   - ✅ Public read access
   - ✅ Authenticated uploads

**Verification Command:**
```bash
# Test storage access (requires Supabase client)
# This will be tested during app runtime
```

---

### **Step 3: Backend Deployment (CURSOR)**

```bash
# Navigate to backend directory
cd backend

# Verify production environment variables
cat .env | grep -E "DATABASE_URL|JWT_SECRET|NODE_ENV|PORT"

# Build backend
npm run build

# Verify build output
ls -la dist/

# Deploy to production server
# Option A: PM2
pm2 start dist/index.js --name vertikal-api --env production

# Option B: Docker
docker build -t vertikal-api .
docker run -d -p 4000:4000 --name vertikal-api --env-file .env vertikal-api

# Option C: Railway/Vercel
# Follow platform-specific deployment instructions
```

**Health Check:**
```bash
# Check logs for:
# ✅ "Connected to Supabase"
# ✅ "Server listening on 4000"
# ✅ "📡 VERTIKAL Backend live at http://localhost:4000"

# Test health endpoint
curl https://api.vertikal.com/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

### **Step 4: Client Build (COPILOT)**

```bash
# Verify EAS configuration
cat eas.json

# Build for production
eas build --profile production --platform all

# Monitor build progress
# Expected outputs:
# - iOS: .ipa file
# - Android: .aab file

# Submit to stores (after build completes)
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

---

### **Step 5: Monitoring Setup (JIM)**

```bash
# Configure Sentry alerts
# Dashboard: https://sentry.io/organizations/vertikal/

# Alert Rules:
# - Error Rate > 0.1% → Page team
# - API Latency > 500ms → Investigate
# - Crash Rate > 0.1% → Hotfix

# Monitor key metrics:
# - Error rate (target: < 0.5%)
# - API latency (target: < 500ms p95)
# - Crash rate (target: < 0.1%)
# - Uptime (target: > 99.9%)
```

---

## 🔒 SECURITY CHECKLIST

### **Pre-Deployment:**
- [ ] Production `DATABASE_URL` verified
- [ ] Production `JWT_SECRET` set (strong, unique)
- [ ] Production `SENTRY_DSN` configured
- [ ] Supabase Storage bucket created (`avatars`, public)
- [ ] Storage policies configured
- [ ] Environment variables secured (not in git)

### **Post-Deployment:**
- [ ] Health endpoint responding
- [ ] Database connection stable
- [ ] Storage uploads working
- [ ] Error tracking active
- [ ] Performance monitoring active

---

## 🚨 ROLLBACK PROCEDURE

### **If Error Rate > 0.1% OR Latency > 500ms:**

```bash
# 1. Stop current deployment
pm2 stop vertikal-api
# OR
docker stop vertikal-api

# 2. Revert to previous version
git checkout <previous-tag>
# OR restore from backup

# 3. Redeploy previous version
pm2 restart vertikal-api
# OR
docker restart vertikal-api

# 4. Verify rollback
curl https://api.vertikal.com/health

# 5. Notify team
# Status: "Rolled back to vX.X.X - Reason: [error details]"
```

---

## 📊 SUCCESS CRITERIA

### **Deployment Successful If:**
- ✅ Database migration completed without errors
- ✅ Health endpoint returns 200
- ✅ Error rate < 0.1%
- ✅ API latency < 500ms (p95)
- ✅ Storage uploads working
- ✅ Client builds completed successfully

### **Go/No-Go Decision:**
- **GO:** All criteria met → Proceed to traffic switch
- **NO-GO:** Any criteria failed → Rollback immediately

---

**Generated:** December 13, 2024  
**Status:** Ready for Execution

