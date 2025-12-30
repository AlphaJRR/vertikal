# 🔧 TECH HANDOVER DOCUMENT — EVAN

**Date:** December 29, 2024  
**Status:** Complete Tech Transfer  
**Handover From:** [Your Name]  
**Handover To:** Evan

---

## 📋 TABLE OF CONTENTS

1. [Repository Overview](#repository-overview)
2. [Access Credentials Required](#access-credentials-required)
3. [Environment Variables](#environment-variables)
4. [Deployment Infrastructure](#deployment-infrastructure)
5. [Key Files & Directories](#key-files--directories)
6. [Build Processes](#build-processes)
7. [Monitoring & Verification](#monitoring--verification)
8. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
9. [Quick Reference Commands](#quick-reference-commands)
10. [Important Contacts & Resources](#important-contacts--resources)

---

## 📦 REPOSITORY OVERVIEW

### **Repository Details**
- **GitHub:** `https://github.com/AlphaJRR/vertikal`
- **Local Path:** `/Users/alphavisualartists/Vertikal-App`
- **Main Branch:** `main`
- **Tech Stack:** React Native (Expo), TypeScript, Supabase, Cloudflare Pages

### **Project Structure**
```
Vertikal-App/
├── public/                      # Static landing pages (Cloudflare Pages)
│   ├── index.html              # Main landing (vertikalapp.com)
│   ├── creators/index.html     # Creators page
│   ├── investors/index.html     # Investors page
│   ├── networks/index.html     # Networks page
│   └── beta/index.html         # Beta access page
├── .github/workflows/          # GitHub Actions CI/CD
│   └── deploy-cloudflare.yml   # Auto-deployment workflow
├── supabase/                   # Supabase Edge Functions
│   └── functions/signup/       # Secure signup function
├── backend/                    # Node.js backend (if exists)
├── components/                 # React Native components
├── screens/                    # App screens
├── services/                   # API services
├── prisma/                     # Database schema
└── package.json                # Dependencies
```

---

## 🔐 ACCESS CREDENTIALS REQUIRED

### **1. GitHub Access**
- **Repository:** `AlphaJRR/vertikal`
- **Access Level:** Admin (for secrets management)
- **Required Permissions:**
  - Read/Write repository
  - Manage GitHub Actions
  - Manage secrets

**Action Required:** Add Evan as collaborator with Admin access

### **2. Cloudflare Access**
- **Dashboard:** `https://dash.cloudflare.com`
- **Account ID:** Stored in GitHub Secrets (`CLOUDFLARE_ACCOUNT_ID`)
- **API Token:** Stored in GitHub Secrets (`CLOUDFLARE_API_TOKEN`)

**Projects Deployed:**
1. `vertikalapp` → `vertikalapp.com`
2. `investors-vertikalapp` → `investors.vertikalapp.com`
3. `creators-vertikalapp` → `creators.vertikalapp.com`
4. `networks-vertikalapp` → `networks.vertikalapp.com`
5. `beta-vertikalapp` → `beta.vertikalapp.com`

**Action Required:** 
- Add Evan to Cloudflare account
- Grant access to all Pages projects
- Share API token (or regenerate new one)

### **3. Supabase Access**
- **Project URL:** `https://vuwawtzhhcarckybdgbd.supabase.co`
- **Dashboard:** `https://supabase.com/dashboard/project/vuwawtzhhcarckybdgbd`
- **Publishable Key:** `sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y`
- **Service Role Key:** (Stored in Supabase Dashboard → Settings → API)

**Action Required:**
- Add Evan as team member in Supabase
- Grant Admin access
- Share service role key securely

### **4. Expo/EAS Access**
- **Project ID:** `de55a2bd-e36f-4ebd-b775-07527d498c21`
- **Owner:** `vertikalapp`
- **Dashboard:** `https://expo.dev/accounts/vertikalapp/projects/vertikal-mobile`

**Action Required:**
- Add Evan to Expo organization
- Grant build/deploy permissions

---

## 🔑 ENVIRONMENT VARIABLES

### **GitHub Secrets** (Required for CI/CD)
These are stored in: `GitHub Repo → Settings → Secrets and variables → Actions`

| Secret Name | Purpose | Where Used |
|------------|---------|------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier | GitHub Actions workflow |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API authentication | GitHub Actions workflow |
| `SLACK_WEBHOOK_URL` | Deployment notifications | GitHub Actions (optional) |

**Action Required:** Share these secrets with Evan OR regenerate and add new ones

### **Supabase Environment Variables**
For Edge Functions (stored in Supabase Dashboard):

| Variable | Purpose | Location |
|----------|---------|----------|
| `SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Edge Functions → Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin access key | Supabase Dashboard → Settings → API |
| `ZAPIER_WEBHOOK_URL` | Signup webhook | Supabase Dashboard → Edge Functions → Settings |

**Action Required:** Verify these are set in Supabase Dashboard

### **Local Development (.env)**
Create `.env` file in project root:
```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://vuwawtzhhcarckybdgbd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y

# API
EXPO_PUBLIC_API_URL=http://localhost:4000

# Sentry (if configured)
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn-here

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

**Action Required:** Create `.env.example` template (without actual keys)

---

## 🚀 DEPLOYMENT INFRASTRUCTURE

### **Automated Deployment (GitHub Actions)**
**Workflow File:** `.github/workflows/deploy-cloudflare.yml`

**How It Works:**
1. Push to `main` branch triggers workflow
2. Monorepo detection: Only deploys changed projects
3. Deploys to Cloudflare Pages automatically
4. Sends Slack notification (if configured)

**Deployment Order:**
1. `vertikalapp` (main site)
2. `investors-vertikalapp`
3. `creators-vertikalapp`
4. `networks-vertikalapp`
5. `beta-vertikalapp`

**Manual Trigger:**
```bash
# Via GitHub UI:
# Actions → Deploy to Cloudflare Pages → Run workflow

# Via GitHub CLI:
gh workflow run deploy-cloudflare.yml
```

### **Manual Deployment (Cloudflare Pages)**
If GitHub Actions fails, deploy manually:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Set API token
export CLOUDFLARE_API_TOKEN="your-token-here"

# Deploy main site
cd public
wrangler pages deploy . --project-name=vertikalapp

# Deploy creators
cd creators
wrangler pages deploy . --project-name=creators-vertikalapp

# Deploy investors
cd ../investors
wrangler pages deploy . --project-name=investors-vertikalapp

# Deploy networks
cd ../networks
wrangler pages deploy . --project-name=networks-vertikalapp

# Deploy beta
cd ../beta
wrangler pages deploy . --project-name=beta-vertikalapp
```

### **Supabase Edge Function Deployment**
**Function:** `supabase/functions/signup/index.ts`

**Deploy Command:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref vuwawtzhhcarckybdgbd

# Deploy function
supabase functions deploy signup
```

**Environment Variables (Set in Supabase Dashboard):**
- Go to: `Edge Functions → signup → Settings → Secrets`
- Add: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ZAPIER_WEBHOOK_URL`

---

## 📁 KEY FILES & DIRECTORIES

### **Critical Files**
| File | Purpose | Notes |
|------|---------|-------|
| `package.json` | Dependencies & scripts | Contains build scripts |
| `.github/workflows/deploy-cloudflare.yml` | CI/CD pipeline | Auto-deploys on push |
| `public/index.html` | Main landing page | vertikalapp.com |
| `public/creators/index.html` | Creators page | Gold + Blue badges only |
| `public/investors/index.html` | Investors page | Green badge only |
| `public/networks/index.html` | Networks page | Titanium badge only |
| `supabase/functions/signup/index.ts` | Secure signup function | Handles Founding 50 cap |
| `COMMANDER_GOVERNANCE_PROMPT.md` | Brand guidelines | Badge segregation rules |

### **Important Directories**
- `public/` - Static HTML files (Cloudflare Pages)
- `supabase/functions/` - Edge Functions (serverless)
- `.github/workflows/` - CI/CD automation
- `components/` - React Native components
- `screens/` - App screens
- `services/` - API integration code
- `prisma/` - Database schema

### **Documentation Files**
- `README.md` - Project overview
- `COMPLETE_FINAL.md` - Deployment status
- `TECH_HANDOVER_EVAN.md` - This document
- `COMMANDER_GOVERNANCE_PROMPT.md` - Brand rules
- `DEPLOY_KILL_SWITCH.md` - Pre-deploy checklist

---

## 🔨 BUILD PROCESSES

### **React Native App (Expo)**
```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Build for iOS
npm run ios
# or
eas build --platform ios

# Build for Android
npm run android
# or
eas build --platform android
```

### **Static Landing Pages**
```bash
# Build creators page (if needed)
npm run build:creators

# This creates: dist/creators/ directory
```

### **Database Migrations (Prisma)**
```bash
# Navigate to backend (if exists)
cd backend

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## 📊 MONITORING & VERIFICATION

### **GitHub Actions Status**
**URL:** `https://github.com/AlphaJRR/vertikal/actions`

**What to Check:**
- ✅ All 5 deployment jobs succeeded
- ✅ No failed steps
- ✅ Deployment times (should be < 5 min each)

### **Cloudflare Pages Status**
**Dashboard:** `https://dash.cloudflare.com` → Pages

**Verification Checklist:**
- [ ] All 5 projects show "Active" status
- [ ] Latest deployment shows "3+ files uploaded" (NOT "1 file")
- [ ] Custom domains show "Active" (not "Pending")
- [ ] SSL certificates provisioned

### **Live Site Verification**
Test all sites in **incognito mode**:

| Site | URL | Expected Content |
|------|-----|------------------|
| Main | `https://vertikalapp.com` | "CINEMA ISN'T DYING. IT'S ROTATING." |
| Creators | `https://creators.vertikalapp.com` | Gold + Blue badges only |
| Investors | `https://investors.vertikalapp.com` | Green badge only |
| Networks | `https://networks.vertikalapp.com` | Titanium badge only |
| Beta | `https://beta.vertikalapp.com` | Beta access page |

**Verification Script:**
```bash
# Run test script
./test-all-pages.sh

# Or manually check
curl -I https://vertikalapp.com
curl -I https://creators.vertikalapp.com
curl -I https://investors.vertikalapp.com
curl -I https://networks.vertikalapp.com
curl -I https://beta.vertikalapp.com
```

### **Supabase Monitoring**
**Dashboard:** `https://supabase.com/dashboard/project/vuwawtzhhcarckybdgbd`

**What to Monitor:**
- Database connection status
- Edge Function logs (`Edge Functions → signup → Logs`)
- Auth users count (should be ≤ 50 for Founding 50)
- Storage bucket status

---

## 🐛 COMMON ISSUES & TROUBLESHOOTING

### **Issue: "1 file uploaded" in Cloudflare**
**Symptom:** Deployment shows only 1 file, site shows wrong content

**Fix:**
1. Check GitHub Actions logs
2. Verify `public/` directory structure
3. Manually upload via Cloudflare Dashboard:
   - Go to Pages → Project → Deployments → Upload assets
   - Upload entire `public/` folder (or specific subfolder)

### **Issue: 404 on Custom Domain**
**Symptom:** Site returns 404, but deployment succeeded

**Fix:**
1. Check Cloudflare Dashboard → Pages → Custom domains
2. Verify domain is "Active" (not "Pending")
3. Check DNS records:
   ```bash
   dig vertikalapp.com
   dig creators.vertikalapp.com
   ```
4. Purge Cloudflare cache:
   - Dashboard → Caching → Purge Everything

### **Issue: GitHub Actions Fails**
**Symptom:** Workflow fails with authentication error

**Fix:**
1. Verify secrets are set:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
2. Check token permissions (needs `Cloudflare Pages:Edit`)
3. Regenerate token if needed:
   - Cloudflare Dashboard → My Profile → API Tokens

### **Issue: Badge Segregation Wrong**
**Symptom:** Wrong badges showing on pages

**Fix:**
1. Check `COMMANDER_GOVERNANCE_PROMPT.md` for rules
2. Verify HTML files:
   - Creators: Only Gold + Blue
   - Networks: Only Titanium
   - Investors: Only Green
3. Run pre-deploy checklist: `DEPLOY_KILL_SWITCH.md`

### **Issue: Supabase Edge Function Fails**
**Symptom:** Signup returns error

**Fix:**
1. Check Edge Function logs:
   - Supabase Dashboard → Edge Functions → signup → Logs
2. Verify environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ZAPIER_WEBHOOK_URL`
3. Test locally:
   ```bash
   supabase functions serve signup
   ```

### **Issue: DNS Conflicts**
**Symptom:** Site routes to wrong server (Netlify vs Cloudflare)

**Fix:**
1. Check DNS records in Cloudflare Dashboard
2. Delete conflicting records:
   - Remove any `CNAME` pointing to Netlify
   - Keep only Cloudflare Pages records
3. Run verification script:
   ```bash
   ./verify-dns-cleanup.sh
   ```

---

## ⚡ QUICK REFERENCE COMMANDS

### **Git Operations**
```bash
# Check status
git status

# Pull latest
git pull origin main

# Commit changes
git add -A
git commit -m "Your message"
git push origin main

# Check deployment status
git log --oneline -5
```

### **Deployment Commands**
```bash
# Trigger GitHub Actions manually
gh workflow run deploy-cloudflare.yml

# Deploy via Wrangler (manual)
wrangler pages deploy public --project-name=vertikalapp

# Deploy Supabase Edge Function
supabase functions deploy signup
```

### **Verification Commands**
```bash
# Test all pages
./test-all-pages.sh

# Verify DNS
./verify-dns-cleanup.sh

# Check Cloudflare status
curl -I https://vertikalapp.com
```

### **Development Commands**
```bash
# Start Expo dev server
npm start

# Clear cache
npx expo start -c

# Install dependencies
npm install

# Build creators page
npm run build:creators
```

---

## 📞 IMPORTANT CONTACTS & RESOURCES

### **Documentation**
- **Project README:** `README.md`
- **Deployment Guide:** `COMPLETE_FINAL.md`
- **Brand Guidelines:** `COMMANDER_GOVERNANCE_PROMPT.md`
- **Pre-Deploy Checklist:** `DEPLOY_KILL_SWITCH.md`

### **External Resources**
- **GitHub Repo:** `https://github.com/AlphaJRR/vertikal`
- **Cloudflare Dashboard:** `https://dash.cloudflare.com`
- **Supabase Dashboard:** `https://supabase.com/dashboard`
- **Expo Dashboard:** `https://expo.dev/accounts/vertikalapp`
- **GitHub Actions:** `https://github.com/AlphaJRR/vertikal/actions`

### **Support Channels**
- **Cloudflare Support:** `https://support.cloudflare.com`
- **Supabase Support:** `https://supabase.com/docs/support`
- **Expo Support:** `https://docs.expo.dev`

### **Key Scripts**
- `test-all-pages.sh` - Test all landing pages
- `verify-dns-cleanup.sh` - Verify DNS configuration
- `fix-all-3-sites.sh` - Fix deployment artifacts
- `execute-deploy-all.sh` - Manual deployment trigger

---

## ✅ HANDOVER CHECKLIST

### **Before Handover**
- [ ] Evan has GitHub access (Admin)
- [ ] Evan has Cloudflare access
- [ ] Evan has Supabase access
- [ ] Evan has Expo/EAS access
- [ ] All secrets shared securely
- [ ] Documentation reviewed together
- [ ] Test deployment completed together

### **After Handover**
- [ ] Evan can access all dashboards
- [ ] Evan can trigger deployments
- [ ] Evan can view logs and monitor
- [ ] Evan understands badge segregation rules
- [ ] Evan knows troubleshooting steps

---

## 🎯 NEXT STEPS FOR EVAN

1. **Immediate:**
   - [ ] Clone repository: `git clone https://github.com/AlphaJRR/vertikal.git`
   - [ ] Install dependencies: `npm install`
   - [ ] Set up `.env` file (use `.env.example` as template)
   - [ ] Verify access to all dashboards

2. **Within 24 Hours:**
   - [ ] Review all documentation files
   - [ ] Test deployment process (create test branch)
   - [ ] Familiarize with GitHub Actions workflow
   - [ ] Test Supabase Edge Function deployment

3. **Within 1 Week:**
   - [ ] Complete first independent deployment
   - [ ] Set up monitoring alerts
   - [ ] Review and update documentation as needed
   - [ ] Establish communication protocol for issues

---

## 📝 NOTES

- **Badge Segregation:** Strictly enforced. See `COMMANDER_GOVERNANCE_PROMPT.md`
- **Deployment Kill-Switch:** Always run pre-deploy checklist before pushing
- **DNS:** All domains must point to Cloudflare Pages (not Netlify)
- **Founding 50 Cap:** Enforced in Supabase Edge Function (hard cap at 50 users)

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2024  
**Status:** ✅ Complete

**Questions?** Refer to documentation files or contact [Your Name] for clarification.

