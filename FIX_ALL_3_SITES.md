# ⚔️ FIX ALL 3 SITES — ONE CHECKLIST

**Problem:** 3 sites deployed with wrong artifacts (1 file instead of many)  
**Sites:** creators, investors, beta  
**Fix Time:** 10 minutes  
**Status:** 🔴 BROKEN

---

## 🔴 BROKEN SITES (CONFIRMED)

1. **creators.vertikalapp.com** - Wrong artifact (1 file)
2. **investors.vertikalapp.com** - Wrong artifact (1 file)  
3. **beta.vertikalapp.com** - Wrong artifact (1 file)

**Root Cause:** All deployed with wrong build output (1 file instead of full bundle)

---

## ✅ ONE CHECKLIST — FIX ALL 3

### STEP 1: Set Credentials (30 seconds)

```bash
export CLOUDFLARE_API_TOKEN="your_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
```

---

### STEP 2: Fix Creators (2 minutes)

```bash
# Prepare dist
rm -rf dist-creators
mkdir -p dist-creators
cp -r public/creators/* dist-creators/

# Handle colon filename
if [ -f "public/creators/creators:index.html" ]; then
    cp public/creators/creators:index.html dist-creators/index.html
fi

# Verify file count (should be 3+ files)
find dist-creators -type f | wc -l

# Deploy
npx wrangler pages deploy dist-creators \
  --project-name=creators-vertikalapp \
  --branch=production
```

**Verify:** Cloudflare Dashboard → creators-vertikalapp → "Assets uploaded: 3+ files"

---

### STEP 3: Fix Investors (2 minutes)

```bash
# Prepare dist
rm -rf dist-investors
mkdir -p dist-investors
cp -r public/investors/* dist-investors/

# Verify file count (should be 3+ files)
find dist-investors -type f | wc -l

# Deploy
npx wrangler pages deploy dist-investors \
  --project-name=investors-vertikalapp \
  --branch=production
```

**Verify:** Cloudflare Dashboard → investors-vertikalapp → "Assets uploaded: 3+ files"

---

### STEP 4: Fix Beta (2 minutes)

```bash
# Prepare dist
rm -rf dist-beta
mkdir -p dist-beta
cp -r public/beta/* dist-beta/

# Handle colon filename if exists
if [ -f "public/beta/beta:index.html" ]; then
    cp public/beta/beta:index.html dist-beta/index.html
fi

# Verify file count (should be 3+ files)
find dist-beta -type f | wc -l

# Deploy
npx wrangler pages deploy dist-beta \
  --project-name=beta-vertikalapp \
  --branch=production
```

**Verify:** Cloudflare Dashboard → beta-vertikalapp → "Assets uploaded: 3+ files"

---

### STEP 5: Verify All (3 minutes)

1. **Check Cloudflare Dashboard** for each project:
   - ✅ "Assets uploaded: 3+ files" (NOT 1)
   - ✅ Latest deployment timestamp is recent

2. **Purge cache** for all 3 sites:
   - creators.vertikalapp.com/*
   - investors.vertikalapp.com/*
   - beta.vertikalapp.com/*

3. **Test in incognito:**
   - https://creators.vertikalapp.com
   - https://investors.vertikalapp.com
   - https://beta.vertikalapp.com

---

## 🚨 CRITICAL RULE

> **Never trust "Success" — trust "Assets uploaded".**

If Cloudflare shows "1 file uploaded" → deployment is wrong  
If Cloudflare shows "3+ files uploaded" → deployment is correct

---

## ✅ SUCCESS CRITERIA

After fix:
- ✅ All 3 sites show "Assets uploaded: 3+ files"
- ✅ Sites load correctly
- ✅ Logos are correct
- ✅ Content is complete
- ✅ No missing assets

---

**Status:** Ready for execution  
**Time Required:** 10 minutes  
**Priority:** P0 — CRITICAL

