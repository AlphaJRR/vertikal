# 🔒 Kill-Switch Checklist — Prevent Pages Regression

**Purpose:** Ensure Cloudflare Pages projects CANNOT regress to broken state

---

## Pre-Deployment Checks (MANDATORY)

### 1. Project Configuration Verification

```bash
# Check project exists
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/vertikalapp" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"

# Expected: 200 OK with project details
# If 404: Project doesn't exist → CREATE IT FIRST
```

### 2. Project Name Verification

**CRITICAL:** Project names MUST match exactly:

| Site | Cloudflare Project Name | Directory | Status |
|------|------------------------|-----------|--------|
| vertikalapp.com | `vertikalapp` | `./public` | ✅ |
| investors.vertikalapp.com | `investors-vertikalapp` | `./public/investors` | ✅ |
| creators.vertikalapp.com | `creators-vertikalapp` | `./public/creators` | ✅ |
| networks.vertikalapp.com | `networks-vertikalapp` | `./public/networks` | ✅ |

**❌ FAIL IF:**
- Project name has typos
- Project name has wrong case
- Project name has extra spaces
- Directory path doesn't match

### 3. Mode Verification

**CRITICAL:** Projects MUST be in Mode B (No Git connection)

**Check in Cloudflare Dashboard:**
- Go to: Pages → [Project Name]
- Look for: "No Git connection" or "Connected to Git: None"
- ✅ CORRECT: "No Git connection"
- ❌ WRONG: "Connected to Git: github.com/..."

**If Git connection exists:**
1. Go to: Pages → [Project] → Settings → Builds & deployments
2. Click: "Disconnect Git repository"
3. Confirm disconnection

### 4. API Token Verification

```bash
# Test token permissions
curl -X GET \
  "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"

# Expected: 200 OK with token details
# Check: "status" = "active"
# Check: Permissions include "Cloudflare Pages:Edit"
```

**Required Permissions:**
- ✅ Cloudflare Pages: Edit
- ✅ Cloudflare Pages: Deploy
- ✅ Account: Read

### 5. Directory Verification

```bash
# Verify all directories exist
test -d ./public && echo "✅ public" || echo "❌ public MISSING"
test -d ./public/investors && echo "✅ investors" || echo "❌ investors MISSING"
test -d ./public/creators && echo "✅ creators" || echo "❌ creators MISSING"
test -d ./public/networks && echo "✅ networks" || echo "❌ networks MISSING"
```

**❌ FAIL IF:**
- Any directory missing
- Directory is empty
- Directory path is wrong

---

## Deployment Contract Enforcement

### Rule 1: Project Name Must Match Exactly

```bash
# In workflow, verify before deploy:
PROJECT_NAME="vertikalapp"
CLOUDFLARE_PROJECT=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}" \
  -H "Authorization: Bearer ${API_TOKEN}" | jq -r '.result.name')

if [ "$CLOUDFLARE_PROJECT" != "$PROJECT_NAME" ]; then
  echo "❌ PROJECT NAME MISMATCH: Expected $PROJECT_NAME, got $CLOUDFLARE_PROJECT"
  exit 1
fi
```

### Rule 2: Directory Must Exist

```bash
# In workflow, verify before deploy:
if [ ! -d "$DIRECTORY" ]; then
  echo "❌ DIRECTORY MISSING: $DIRECTORY"
  exit 1
fi
```

### Rule 3: Use Wrangler CLI (Not Git)

**✅ CORRECT:**
```bash
wrangler pages deploy ./public --project-name=vertikalapp
```

**❌ WRONG:**
```bash
# Don't use cloudflare/pages-action if projects have no Git connection
# Don't use git push triggers
# Don't use build commands that assume Git
```

---

## Post-Deployment Verification

### 1. Verify Deployment Success

```bash
# Check deployment status
wrangler pages deployment list --project-name=vertikalapp

# Expected: Latest deployment shows "active"
```

### 2. Verify Site Accessibility

```bash
# Test each site
curl -I https://vertikalapp.com
curl -I https://investors.vertikalapp.com
curl -I https://creators.vertikalapp.com
curl -I https://networks.vertikalapp.com

# Expected: HTTP 200 OK
```

### 3. Verify Custom Domain

```bash
# Check domain is attached
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/vertikalapp/domains" \
  -H "Authorization: Bearer ${API_TOKEN}"

# Expected: Domain listed
```

---

## Regression Prevention Rules

### ❌ NEVER DO THESE:

1. **Never connect Git to Pages projects**
   - If accidentally connected, disconnect immediately
   - Mode B requires NO Git connection

2. **Never change project names**
   - Project names are canonical
   - Changing breaks all workflows

3. **Never use wrong directory paths**
   - Paths must match exactly
   - `./public` ≠ `./public/`

4. **Never deploy without verification**
   - Always verify project exists first
   - Always verify directory exists first
   - Always verify API token works first

5. **Never use Git-based deployment for Mode B**
   - Don't use `cloudflare/pages-action` if projects have no Git
   - Use Wrangler CLI directly instead

---

## Emergency Rollback

If deployment fails:

```bash
# 1. List recent deployments
wrangler pages deployment list --project-name=vertikalapp

# 2. Rollback to previous deployment
wrangler pages deployment rollback --project-name=vertikalapp --deployment-id=<ID>

# 3. Verify rollback
curl -I https://vertikalapp.com
```

---

## Status Check Script

```bash
#!/bin/bash
# Run this before every deployment

echo "🔍 Pre-Deployment Verification"
echo "================================"

# Check projects exist
for project in vertikalapp investors-vertikalapp creators-vertikalapp networks-vertikalapp; do
  if curl -s -X GET \
    "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${project}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq -e '.success' > /dev/null; then
    echo "✅ $project: Exists"
  else
    echo "❌ $project: MISSING"
    exit 1
  fi
done

# Check directories exist
for dir in ./public ./public/investors ./public/creators ./public/networks; do
  if [ -d "$dir" ]; then
    echo "✅ $dir: Exists"
  else
    echo "❌ $dir: MISSING"
    exit 1
  fi
done

echo "✅ All checks passed - Ready to deploy"
```

---

**Status:** ✅ Kill-switch active  
**Mode:** B (API/Wrangler-only)  
**Enforcement:** Mandatory pre-deployment checks

