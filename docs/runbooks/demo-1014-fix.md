# Cloudflare Error 1014 Fix: demo.vertikalapp.com

**Error:** Cloudflare Error 1014 (CNAME Cross-User)  
**Domain:** `demo.vertikalapp.com`  
**Date:** December 31, 2024

---

## Root Cause Diagnosis

Error 1014 occurs when:
1. DNS record points to Pages project in different Cloudflare account
2. Domain attached to multiple Pages projects
3. Manual Pages project cannot connect to Git (must recreate)

---

## Diagnostic Steps

### A) Check Pages Project Canonical Hostname

**Click Path:**
1. Cloudflare Dashboard → Workers & Pages
2. Open project **"demo"**
3. Go to **Deployments** tab
4. Click latest deployment
5. **Record:** Canonical pages.dev hostname (e.g., `demo-1ji.pages.dev`)

**Expected:** Should see hostname like `demo-{random}.pages.dev`

---

### B) Verify DNS Record (Single Source of Truth)

**Click Path:**
1. Cloudflare Dashboard → **DNS** → Select zone `vertikalapp.com`
2. Search for record: `demo`
3. **Verify:**
   - Exactly ONE CNAME record exists
   - Points to: `<canonical pages.dev>` (from step A)
   - Status: Proxied (orange cloud) or DNS only (gray cloud)

**If multiple records exist:** Delete duplicates, keep only one pointing to canonical hostname

---

### C) Check Domain Attachment (No Duplicates)

**Click Path:**
1. Cloudflare Dashboard → Workers & Pages
2. **For EACH project** in account:
   - Open project → **Custom domains** tab
   - Search for: `demo.vertikalapp.com`
   - **If found:** Note which project(s) have it attached

**Expected:** `demo.vertikalapp.com` should be attached to ONLY the "demo" project

**If found elsewhere:**
- Remove from other project(s): Custom domains → Remove domain
- Keep only on intended "demo" project

---

### D) Proxy Test (Account Mismatch Detection)

**Click Path:**
1. Cloudflare Dashboard → DNS → `vertikalapp.com`
2. Find `demo` CNAME record
3. Click edit → Change proxy status:
   - **Test 1:** Set to **DNS only** (gray cloud) → Save
   - Wait 30 seconds
   - Test: `curl -I https://demo.vertikalapp.com`
   - **If DNS-only works:** Account mismatch confirmed (proceed to Branch 3)
   - **If DNS-only fails:** Different issue (check Branch 1 or 2)

**Test 2:** Set back to **Proxied** (orange cloud) → Save

---

## Fix Paths

### Branch 1: Domain Attached Elsewhere

**If:** `demo.vertikalapp.com` found in multiple Pages projects

**Fix:**
1. Cloudflare Dashboard → Workers & Pages
2. For each project that has `demo.vertikalapp.com` attached (except "demo"):
   - Open project → Custom domains → Remove `demo.vertikalapp.com`
3. Verify only "demo" project has it:
   - Open "demo" project → Custom domains → Should show `demo.vertikalapp.com` as Active
4. Retest: `curl -I https://demo.vertikalapp.com`

---

### Branch 2: Manual Project Cannot Connect to Git

**If:** "demo" project shows "No Git connection" or "Manual" deployments

**Fix:**
1. **Create NEW Git-Connected Project:**
   - Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git
   - Repository: `AlphaJRR/vertikal`
   - Branch: `main`
   - Project name: `demo-vertikalapp` (or `demo-new`)
   - Framework preset: **None**
   - Build command: **(blank)**
   - Root directory: **(blank)**
   - **Build output directory:** `public/demo` ⚠️ **CRITICAL**
   - Click **Save and Deploy**

2. **Wait for deployment** (check Deployments tab → should show Git commit hash)

3. **Migrate Custom Domain:**
   - Open OLD "demo" project → Custom domains → Remove `demo.vertikalapp.com`
   - Open NEW "demo-vertikalapp" project → Custom domains → Set up custom domain
   - Enter: `demo.vertikalapp.com`
   - Click **Activate** → Wait for Active status

4. **Delete Old Project:**
   - Open OLD "demo" project → Settings → Delete project → Confirm

5. **Retest:**
   - `curl -I https://demo.vertikalapp.com` → Should return `HTTP/2 200`
   - Verify Git connection: Deployments tab → Should show GitHub icon + commit hash

---

### Branch 3: Account Mismatch

**If:** DNS-only works but Proxied fails, OR DNS zone and Pages project in different accounts

**Evidence Required:**
- DNS zone `vertikalapp.com` account: _______________
- Pages project "demo" account: _______________
- Are they the same? YES / NO

**Fix:**
1. **Identify correct account** (the one that owns `vertikalapp.com` DNS zone)
2. **Recreate Pages project in SAME account:**
   - Switch to account that owns DNS zone
   - Follow Branch 2 steps to create Git-connected project
   - Attach `demo.vertikalapp.com` custom domain
3. **If project exists in wrong account:**
   - Delete project from wrong account (or leave it, but don't use its domain)
   - Create new project in correct account

---

## Verification Checklist

After fix, verify:

- [ ] **DNS State:**
  - Exactly ONE CNAME: `demo` → `<canonical pages.dev>`
  - Status: Proxied (orange cloud)

- [ ] **Pages Project:**
  - Project name: `demo-vertikalapp` (or `demo` if recreated)
  - Custom domain: `demo.vertikalapp.com` → Status: **Active**
  - Deployments tab → Source shows **Git** icon (not "Manual")
  - Latest deployment shows commit hash from `main` branch

- [ ] **HTTP Tests:**
  ```bash
  curl -I https://demo.vertikalapp.com
  # Expected: HTTP/2 200
  
  curl -I https://<canonical-pages-dev-hostname>
  # Expected: HTTP/2 200
  ```

- [ ] **Content Verification:**
  - Visit `https://demo.vertikalapp.com` in browser
  - Should load `public/demo/index.html` content
  - No Error 1014

---

## Patch Note

**Added to runbook:** "You cannot retrofit Git onto a manual Pages project — you must recreate via Connect to Git and migrate domains."

---

**Status:** FIX REQUIRED  
**Next Action:** Follow diagnostic steps A-D, then apply fix based on evidence.

