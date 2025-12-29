# 🔍 Cloudflare ↔ GitHub Alignment Check

**Purpose:** Verify that Cloudflare Pages production deployments match your GitHub repository state.

**Current Reality Check:**
- ✅ `vertikalapp.com` is serving **NEW "VERTICAL CINEMA" layout** (not old PDF layout)
- ✅ `investors.vertikalapp.com` is serving correct tiers + forms
- ✅ `creators.vertikalapp.com` is serving Founding 50 UI
- ⚠️ **Mismatch detected:** "Restore old PDF layout" commit is NOT what's live

**This means:**
- Cloudflare may be deploying from a different commit/branch
- Cloudflare may be wired to a different repo
- GitHub Actions workflow may not have run successfully yet

---

## ✅ VERIFICATION STEPS

### **For Each Pages Project:**

#### **1. vertikalapp**

**Steps:**
1. Go to: Cloudflare Dashboard → **Pages** → Click **vertikalapp**
2. Go to **Deployments** tab
3. Click the latest deployment marked **Production**
4. Record these three values:

**Source / Repo:**
- [ ] Shows: `GitHub – AlphaJRR/vertikal`
- [ ] If different, note: `_________________`

**Branch:**
- [ ] Shows: `main`
- [ ] If different, note: `_________________`

**Commit SHA:**
- [ ] Cloudflare SHA: `_________________` (first 7 chars)
- [ ] GitHub latest SHA: `_________________` (from `https://github.com/AlphaJRR/vertikal/commits/main`)
- [ ] **Match?** YES / NO

---

#### **2. investors-vertikalapp**

**Steps:**
1. Go to: Cloudflare Dashboard → **Pages** → Click **investors-vertikalapp**
2. Go to **Deployments** tab
3. Click the latest deployment marked **Production**
4. Record:

**Source / Repo:**
- [ ] Shows: `GitHub – AlphaJRR/vertikal`
- [ ] If different: `_________________`

**Branch:**
- [ ] Shows: `main`
- [ ] If different: `_________________`

**Commit SHA:**
- [ ] Cloudflare SHA: `_________________`
- [ ] GitHub latest SHA: `_________________`
- [ ] **Match?** YES / NO

---

#### **3. creators-vertikalapp**

**Steps:**
1. Go to: Cloudflare Dashboard → **Pages** → Click **creators-vertikalapp**
2. Go to **Deployments** tab
3. Click the latest deployment marked **Production**
4. Record:

**Source / Repo:**
- [ ] Shows: `GitHub – AlphaJRR/vertikal`
- [ ] If different: `_________________`

**Branch:**
- [ ] Shows: `main`
- [ ] If different: `_________________`

**Commit SHA:**
- [ ] Cloudflare SHA: `_________________`
- [ ] GitHub latest SHA: `_________________`
- [ ] **Match?** YES / NO

---

#### **4. networks-vertikalapp**

**Steps:**
1. Go to: Cloudflare Dashboard → **Pages** → Click **networks-vertikalapp**
2. Go to **Deployments** tab
3. Click the latest deployment marked **Production**
4. Record:

**Source / Repo:**
- [ ] Shows: `GitHub – AlphaJRR/vertikal`
- [ ] If different: `_________________`

**Branch:**
- [ ] Shows: `main`
- [ ] If different: `_________________`

**Commit SHA:**
- [ ] Cloudflare SHA: `_________________`
- [ ] GitHub latest SHA: `_________________`
- [ ] **Match?** YES / NO

---

## 🔧 IF MISMATCH DETECTED

### **Scenario A: Different Repo**
- **Fix:** Reconnect Cloudflare Pages project to correct repo
- **Steps:**
  1. Cloudflare Pages → Project → Settings → **Builds & deployments**
  2. Click **"Connect to Git"**
  3. Select: `AlphaJRR/vertikal`
  4. Select branch: `main`
  5. Save

### **Scenario B: Different Branch**
- **Fix:** Change production branch in Cloudflare
- **Steps:**
  1. Cloudflare Pages → Project → Settings → **Builds & deployments**
  2. Set **Production branch** to `main`
  3. Save

### **Scenario C: Different Commit (Same Branch)**
- **Cause:** Cloudflare auto-deploy may not have triggered
- **Fix:** 
  1. Verify GitHub Actions workflow ran successfully
  2. Check: https://github.com/AlphaJRR/vertikal/actions
  3. If workflow failed, check secrets (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)
  4. Manually trigger deployment: Cloudflare Pages → Deployments → **Retry deployment**

### **Scenario D: Manual Upload (Not Git-Connected)**
- **Cause:** Pages project was created with "Upload assets" instead of Git
- **Fix:**
  1. Cloudflare Pages → Project → Settings → **Builds & deployments**
  2. Click **"Connect to Git"**
  3. Connect to `AlphaJRR/vertikal` → `main`
  4. Future deployments will come from GitHub Actions

---

## ✅ ALIGNMENT CHECKLIST

After verification, confirm:

- [ ] All 4 projects show correct repo: `GitHub – AlphaJRR/vertikal`
- [ ] All 4 projects show correct branch: `main`
- [ ] All 4 projects show commit SHA matching GitHub `main` HEAD
- [ ] GitHub Actions workflow has run successfully
- [ ] All 4 deployments completed without errors

---

## 🎯 NEXT STEPS AFTER ALIGNMENT

Once aligned:

1. **Push updated workflow** (with Step 1: build caching)
2. **Monitor GitHub Actions** → Verify all 4 jobs succeed
3. **Verify live sites** match expected content
4. **Proceed to Step 2:** Monorepo detection (deploy only what changed)

---

## 📝 NOTES

**Current GitHub HEAD:**
- Latest commit: `754dca5` — "chore: Add all pending changes and documentation"
- Branch: `main`
- Repo: `https://github.com/AlphaJRR/vertikal.git`

**Expected Live Content:**
- `vertikalapp.com` should show OLD PDF layout ("STOP ROTATING YOUR PHONE")
- If it shows NEW layout, Cloudflare is not deploying from current `main`

---

**Status:** ⏳ **VERIFICATION REQUIRED**  
**Action:** Complete checklist above → Report findings → Fix mismatches → Proceed

