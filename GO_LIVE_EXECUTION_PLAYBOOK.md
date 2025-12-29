# 🚀 GO LIVE — Complete Execution Playbook

**Date:** December 29, 2024  
**Goal:** Deploy all 4 sites to production using canary → blue/green deployment strategy

---

## 📋 STEP 1: PREPARE CREDENTIALS (One-Time Setup)

Set these environment variables or have them ready:

```bash
# GitHub
export GITHUB_USERNAME="AlphaJRR"
export GITHUB_REPO="AlphaJRR/vertikal"
export BRANCH="main"
export GITHUB_PAT="YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"

# Cloudflare
export CLOUDFLARE_ACCOUNT_ID="YOUR_CLOUDFLARE_ACCOUNT_ID"
export CLOUDFLARE_API_TOKEN="YOUR_CLOUDFLARE_API_TOKEN"
export ZONE_ID="YOUR_CLOUDFLARE_ZONE_ID"
export LB_ID="YOUR_LOAD_BALANCER_ID"

# Load Balancer Pools (if using blue/green)
export POOL_ID_PROD="YOUR_PROD_POOL_ID"
export POOL_ID_CANARY="YOUR_CANARY_POOL_ID"
export POOL_ID_BLUE="YOUR_BLUE_POOL_ID"
export POOL_ID_GREEN="YOUR_GREEN_POOL_ID"

# Optional
export SLACK_WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL"
```

**Where to find:**
- **GitHub PAT:** https://github.com/settings/tokens (create with `repo` and `workflow` scopes)
- **Cloudflare Account ID:** Dashboard → Right sidebar or URL
- **Cloudflare API Token:** https://dash.cloudflare.com/profile/api-tokens (create with `Pages:Edit` and `Load Balancer:Edit`)
- **Zone ID:** Cloudflare Dashboard → Domain → Overview → API section
- **Load Balancer ID:** Cloudflare Dashboard → Traffic → Load Balancers → Click LB → API section
- **Pool IDs:** Cloudflare Dashboard → Traffic → Load Balancers → Pools → Click pool → API section

---

## 🚀 STEP 2: PUSH COMMITS TO GITHUB

### **Option A: GitHub Desktop (Recommended)**

1. Open **GitHub Desktop**
2. Select `vertikal` repository
3. Click **"Push origin"** button
4. Enter GitHub credentials
5. ✅ Wait for push to complete

**Verify:** Go to https://github.com/AlphaJRR/vertikal/commits/main and confirm latest commit is present.

---

### **Option B: Terminal with PAT**

```bash
cd /Users/alphavisualartists/Vertikal-App

# Set variables
export GITHUB_USER="AlphaJRR"
export GITHUB_REPO="vertikal"
export BRANCH="main"

# Push (will prompt for credentials)
git checkout $BRANCH
git push origin $BRANCH
```

**When prompted:**
- **Username:** `AlphaJRR`
- **Password:** Paste your GitHub PAT token

**One-liner alternative (less secure):**
```bash
git push https://${GITHUB_USER}:${GITHUB_PAT}@github.com/${GITHUB_REPO}.git ${BRANCH}
```

**Verify push:**
```bash
git fetch origin
git log origin/main..HEAD --oneline
# Should return: No commits (all pushed)
```

---

## 🎯 STEP 3: DEPLOY TO CANARY (Controlled Rollout)

### **Method A: GitHub Actions UI (Recommended)**

1. Go to: https://github.com/AlphaJRR/vertikal/actions
2. Click **"Advanced Cloudflare Deploy (Canary + Blue/Green)"** workflow
3. Click **"Run workflow"** (top-right dropdown)
4. Set inputs:
   - **target:** `all`
   - **mode:** `canary`
   - **branch:** `main`
5. Click **"Run workflow"** button
6. Monitor the workflow run

**What happens:**
- Deploys all 4 sites to `*-canary` Pages projects:
  - `vertikalapp-canary`
  - `investors-vertikalapp-canary`
  - `creators-vertikalapp-canary`
  - `networks-vertikalapp-canary`

**Wait:** Monitor until all 4 matrix jobs complete successfully (green checkmarks).

---

### **Method B: GitHub API (CLI)**

```bash
# Trigger workflow via GitHub API
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/cloudflare-advanced-deploy.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "target": "all",
      "mode": "canary",
      "branch": "main"
    }
  }'

echo "✅ Canary deployment triggered"
```

**Monitor:**
```bash
# Check workflow status
curl -H "Authorization: Bearer ${GITHUB_PAT}" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/runs?per_page=1 | jq '.workflow_runs[0].status'
```

---

## 🔄 STEP 4: SHIFT TRAFFIC TO CANARY (Gradual Rollout)

### **Option A: Cloudflare Dashboard (Easiest)**

1. Go to: Cloudflare Dashboard → Traffic → Load Balancers
2. Click your Load Balancer for `vertikalapp.com`
3. Click **"Edit"**
4. Adjust pool weights:
   - **Production pool:** 90% (or 95%)
   - **Canary pool:** 10% (or 5%)
5. Click **"Save"**

**Monitor:** Check Cloudflare Analytics and canary Pages deployment logs for 5-15 minutes.

---

### **Option B: Cloudflare API (Automated)**

```bash
# Set canary to 10% traffic (prod 90%)
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_PROD}'", "'${POOL_ID_CANARY}'"],
    "fallback_pool": "'${POOL_ID_PROD}'",
    "proxied": true,
    "steering_policy": "off",
    "default_pools_weights": [
      {"pool_id":"'${POOL_ID_PROD}'","weight":90},
      {"pool_id":"'${POOL_ID_CANARY}'","weight":10}
    ]
  }'

echo "✅ Traffic shifted: Prod 90%, Canary 10%"
```

**Note:** If your Load Balancer uses a different schema, check Cloudflare Dashboard → Load Balancers → Edit → inspect the current configuration and adjust the curl payload accordingly.

**Verify weights:**
```bash
curl -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" | jq '.result.default_pools_weights'
```

---

## 🟢 STEP 5: PROMOTE CANARY → GREEN (Blue/Green Deployment)

### **A. Deploy to Green**

**GitHub Actions UI:**
1. Go to: https://github.com/AlphaJRR/vertikal/actions
2. Click **"Advanced Cloudflare Deploy (Canary + Blue/Green)"**
3. Click **"Run workflow"**
4. Set inputs:
   - **target:** `all`
   - **mode:** `green`
   - **branch:** `main`
5. Click **"Run workflow"**

**Or via API:**
```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/cloudflare-advanced-deploy.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "target": "all",
      "mode": "green",
      "branch": "main"
    }
  }'

echo "✅ Green deployment triggered"
```

**Wait:** Monitor until all 4 jobs complete successfully.

---

### **B. Validate Green (Smoke Tests)**

```bash
# Basic HTTP checks
echo "Checking green deployments..."
curl -I https://vertikalapp-green.pages.dev 2>&1 | head -1
curl -I https://investors-vertikalapp-green.pages.dev 2>&1 | head -1
curl -I https://creators-vertikalapp-green.pages.dev 2>&1 | head -1
curl -I https://networks-vertikalapp-green.pages.dev 2>&1 | head -1

# Content check (example)
curl -s https://vertikalapp-green.pages.dev | grep -i "VERTICAL CINEMA" && echo "✅ Main content found" || echo "⚠️ Content check failed"
```

**Manual checks:**
- Visit each `*-green.pages.dev` URL
- Verify pages load correctly
- Test key flows (forms, links)

---

### **C. Flip Load Balancer to Green (100% Traffic)**

**Cloudflare Dashboard:**
1. Go to: Cloudflare Dashboard → Traffic → Load Balancers
2. Click your Load Balancer
3. Click **"Edit"**
4. Set pool weights:
   - **Green pool:** 100%
   - **Other pools:** 0%
5. Click **"Save"**

**Or via API:**
```bash
# Flip to green (100%)
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_GREEN}'"],
    "fallback_pool": "'${POOL_ID_GREEN}'",
    "proxied": true
  }'

echo "✅ Traffic flipped to Green (100%)"
```

---

## ✅ STEP 6: VERIFY ALL SITES ARE LIVE

### **Automated Verification Script**

```bash
#!/bin/bash

echo "=== VERIFYING LIVE SITES ==="
echo ""

sites=(
  "https://vertikalapp.com"
  "https://investors.vertikalapp.com"
  "https://creators.vertikalapp.com"
  "https://networks.vertikalapp.com"
)

for site in "${sites[@]}"; do
  echo "Checking: $site"
  
  # HTTP status check
  status=$(curl -s -o /dev/null -w "%{http_code}" "$site")
  
  if [ "$status" = "200" ]; then
    echo "  ✅ HTTP 200 OK"
    
    # SSL check
    ssl=$(echo | openssl s_client -connect $(echo $site | sed 's|https://||'):443 -servername $(echo $site | sed 's|https://||') 2>/dev/null | grep "Verify return code" | awk '{print $4}')
    if [ "$ssl" = "0" ]; then
      echo "  ✅ SSL certificate valid"
    else
      echo "  ⚠️ SSL check failed"
    fi
  else
    echo "  ❌ HTTP $status"
  fi
  
  echo ""
done

echo "=== VERIFICATION COMPLETE ==="
```

**Save as:** `verify-sites.sh`  
**Run:** `chmod +x verify-sites.sh && ./verify-sites.sh`

---

### **Manual Verification Checklist**

- [ ] `https://vertikalapp.com` loads correctly
- [ ] `https://investors.vertikalapp.com` loads correctly
- [ ] `https://creators.vertikalapp.com` loads correctly
- [ ] `https://networks.vertikalapp.com` loads correctly
- [ ] SSL lock icon shows on all sites
- [ ] Forms submit correctly
- [ ] Links route correctly
- [ ] No console errors
- [ ] Content matches expected

---

## 🔙 STEP 7: ROLLBACK COMMANDS (If Needed)

### **Rollback Canary (Set to 0%)**

```bash
# Rollback canary - return to 100% production
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_PROD}'"],
    "fallback_pool": "'${POOL_ID_PROD}'",
    "proxied": true
  }'

echo "✅ Rolled back to Production (100%)"
```

---

### **Rollback Green → Blue**

```bash
# Flip back to blue
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_BLUE}'"],
    "fallback_pool": "'${POOL_ID_BLUE}'",
    "proxied": true
  }'

echo "✅ Rolled back to Blue"
```

---

### **Rollback to Previous Deployment**

If you need to deploy a previous commit:

```bash
# Deploy previous commit to production
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/cloudflare-advanced-deploy.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "target": "all",
      "mode": "production",
      "branch": "main"
    }
  }'

echo "✅ Previous deployment triggered"
```

---

## 🚀 STEP 8: COMPLETE "DO IT ALL" SEQUENCE

**Copy and paste this complete sequence:**

```bash
#!/bin/bash
# Complete Go Live Execution Script
# Replace all placeholders (YOUR_*) with actual values before running

set -e  # Exit on error

echo "🚀 GO LIVE EXECUTION STARTING..."
echo ""

# ===== STEP 1: SET CREDENTIALS =====
export GITHUB_USERNAME="AlphaJRR"
export GITHUB_REPO="AlphaJRR/vertikal"
export BRANCH="main"
export GITHUB_PAT="YOUR_GITHUB_PAT"
export CLOUDFLARE_API_TOKEN="YOUR_CLOUDFLARE_API_TOKEN"
export ZONE_ID="YOUR_ZONE_ID"
export LB_ID="YOUR_LB_ID"
export POOL_ID_PROD="YOUR_POOL_ID_PROD"
export POOL_ID_CANARY="YOUR_POOL_ID_CANARY"
export POOL_ID_GREEN="YOUR_POOL_ID_GREEN"

# ===== STEP 2: PUSH COMMITS =====
echo "📤 Pushing commits..."
cd /Users/alphavisualartists/Vertikal-App
git push https://${GITHUB_USERNAME}:${GITHUB_PAT}@github.com/${GITHUB_REPO}.git ${BRANCH}
echo "✅ Push complete"
echo ""

# ===== STEP 3: DEPLOY CANARY =====
echo "🎯 Deploying to canary..."
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/cloudflare-advanced-deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"target":"all","mode":"canary","branch":"main"}}'
echo "✅ Canary deployment triggered"
echo "Waiting 60 seconds for workflow to start..."
sleep 60

# ===== STEP 4: SHIFT TRAFFIC TO CANARY (10%) =====
echo "🔄 Shifting 10% traffic to canary..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_PROD}'", "'${POOL_ID_CANARY}'"],
    "fallback_pool": "'${POOL_ID_PROD}'",
    "proxied": true,
    "default_pools_weights": [
      {"pool_id":"'${POOL_ID_PROD}'","weight":90},
      {"pool_id":"'${POOL_ID_CANARY}'","weight":10}
    ]
  }'
echo "✅ Traffic shifted: Prod 90%, Canary 10%"
echo "Monitor canary for 5-15 minutes, then continue..."
echo ""

# ===== STEP 5: DEPLOY GREEN =====
echo "🟢 Deploying to green..."
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/cloudflare-advanced-deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"target":"all","mode":"green","branch":"main"}}'
echo "✅ Green deployment triggered"
echo "Waiting 60 seconds for workflow to start..."
sleep 60

# ===== STEP 6: FLIP TO GREEN (100%) =====
echo "🔄 Flipping traffic to green (100%)..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_GREEN}'"],
    "fallback_pool": "'${POOL_ID_GREEN}'",
    "proxied": true
  }'
echo "✅ Traffic flipped to Green (100%)"
echo ""

# ===== STEP 7: VERIFY =====
echo "✅ Verifying sites..."
sites=(
  "https://vertikalapp.com"
  "https://investors.vertikalapp.com"
  "https://creators.vertikalapp.com"
  "https://networks.vertikalapp.com"
)

for site in "${sites[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$site")
  if [ "$status" = "200" ]; then
    echo "  ✅ $site - HTTP 200"
  else
    echo "  ❌ $site - HTTP $status"
  fi
done

echo ""
echo "🎉 GO LIVE COMPLETE!"
echo "Monitor sites and verify functionality."
```

**Save as:** `go-live.sh`  
**Run:** `chmod +x go-live.sh && ./go-live.sh`

---

## 📋 FINAL VERIFICATION CHECKLIST

After completing all steps:

- [ ] All 4 sites accessible via HTTPS
- [ ] SSL certificates issued (lock icon)
- [ ] GitHub Actions workflows completed successfully
- [ ] Cloudflare Pages deployments show Success
- [ ] Load Balancer health checks are green
- [ ] Forms submit correctly
- [ ] Links route correctly
- [ ] No console errors
- [ ] Content matches expected
- [ ] Slack notification received (if configured)

---

## 🎯 QUICK REFERENCE

### **Deploy Canary:**
```bash
# GitHub Actions UI: target=all, mode=canary, branch=main
# Or API: See Step 3
```

### **Shift Traffic:**
```bash
# 10% canary: Prod 90%, Canary 10%
# See Step 4 curl command
```

### **Deploy Green:**
```bash
# GitHub Actions UI: target=all, mode=green, branch=main
# Or API: See Step 5A
```

### **Flip to Green:**
```bash
# 100% green: See Step 5C curl command
```

### **Rollback:**
```bash
# See Step 7 rollback commands
```

---

**Status:** ✅ **READY TO EXECUTE**  
**Time:** ~30 minutes total (including monitoring)  
**Method:** Follow steps 1-8 in order

**Everything is ready. Follow the steps above to go live with canary → blue/green deployment strategy.**

