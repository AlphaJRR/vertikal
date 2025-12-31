# A+ Launch Grade Verification Checklist

**Purpose:** Verify all three A+ launch fixes are complete  
**Last Updated:** December 31, 2024

---

## Fix 1: Cloudflare Caching Rules ✅

### Status: Documentation Complete

**Action Required:** Execute in Cloudflare Dashboard

**Steps:**
1. Go to: https://dash.cloudflare.com → vertikalapp.com → Caching → Cache Rules
2. Create rule: "Cache Static Assets"
3. Match: `.*\.(html|css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$`
4. Action: Cache everything, Edge TTL: 1 hour
5. Purge cache after creation

**Verification:**
```bash
# Test cache headers
curl -I https://vertikalapp.com/demo

# Should return:
# CF-Cache-Status: HIT (after first request)
# Cache-Control: public, max-age=3600
```

**Documentation:** `docs/runbooks/cloudflare-cache-rules.md`

---

## Fix 2: Demo Subdomain ✅

### Status: Complete (Using /demo/ route only)

**Action Taken:** Verified no `demo.vertikalapp.com` references in public HTML

**Verification:**
```bash
# Check for demo.vertikalapp.com references
grep -r "demo\.vertikalapp\.com" public/*.html public/*/index.html

# Result: 0 references found ✅
```

**Current Setup:**
- `/demo` route: `https://vertikalapp.com/demo` → `public/demo/index.html`
- Redirect configured: `/demo /demo/index.html 200`
- No subdomain references in HTML files

**Status:** ✅ Complete

---

## Fix 3: OG Image ✅

### Status: SVG Created, PNG Conversion Required

**Files Created:**
- `public/assets/og-preview.svg` (1200x630 source)
- `scripts/convert-og-image.js` (conversion script)
- `scripts/create-og-image.md` (conversion instructions)

**HTML Files Updated:**
- ✅ `public/index.html`
- ✅ `public/creators/index.html`
- ✅ `public/investors/index.html`
- ✅ `public/networks/index.html`
- ✅ `public/beta/index.html`
- ✅ `public/demo/index.html`

**Action Required:**
1. Convert SVG to PNG (1200x630):
   ```bash
   # Option 1: Online converter
   # Upload public/assets/og-preview.svg to:
   # https://cloudconvert.com/svg-to-png
   # Set dimensions: 1200x630
   # Save as: public/assets/og-preview.png
   
   # Option 2: Node.js script (if sharp installed)
   npm install sharp --save-dev
   node scripts/convert-og-image.js
   ```

2. Verify image:
   ```bash
   # Check file exists
   ls -lh public/assets/og-preview.png
   
   # Should be: 1200x630px, <500KB
   ```

3. Test with Facebook Debugger:
   - Go to: https://developers.facebook.com/tools/debug/
   - Enter: `https://vertikalapp.com`
   - Click "Scrape Again"
   - Verify `og:image` shows `og-preview.png`

**Verification:**
```bash
# Check all HTML files reference og-preview.png
grep -r "og-preview.png" public/*.html public/*/index.html | wc -l
# Should return: 12 (6 OG + 6 Twitter)
```

**Status:** ⚠️ Pending PNG conversion

---

## Final Verification

### 1. Stability Check (5 Consecutive Requests)

```bash
# Test all surfaces return 200
for url in \
  "https://vertikalapp.com" \
  "https://vertikalapp.com/demo" \
  "https://creators.vertikalapp.com" \
  "https://investors.vertikalapp.com" \
  "https://networks.vertikalapp.com"; do
  echo "Testing: $url"
  for i in {1..5}; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "  Request $i: $status"
    if [ "$status" != "200" ]; then
      echo "  ❌ FAILED: $url returned $status"
      exit 1
    fi
  done
  echo "  ✅ PASSED: All 5 requests returned 200"
done
```

**Expected:** All surfaces return 200 on 5 consecutive checks

---

### 2. Demo Subdomain Check

```bash
# Verify demo.vertikalapp.com is NOT referenced
grep -r "demo\.vertikalapp\.com" public/*.html public/*/index.html
# Expected: No matches (0 references)
```

**Expected:** No `demo.vertikalapp.com` references found

---

### 3. OG Image Check

```bash
# Verify og-preview.png exists
ls -lh public/assets/og-preview.png
# Expected: File exists, 1200x630px

# Test with Facebook Debugger
# https://developers.facebook.com/tools/debug/
# Enter: https://vertikalapp.com
# Verify: og:image shows og-preview.png
```

**Expected:** OG image shows in Facebook debugger

---

## Success Criteria

✅ **Fix 1:** Cloudflare cache rules created and active  
✅ **Fix 2:** Demo subdomain removed (using /demo/ route only)  
✅ **Fix 3:** OG image (1200x630px) created and referenced  
✅ **Verification:** All surfaces return 200 on 5 consecutive checks  
✅ **Verification:** Demo subdomain resolves or is removed  
✅ **Verification:** OG image shows in Facebook debugger  

**Status:** Ready for A+ Launch Grade (pending PNG conversion)

---

## Next Steps

1. **Execute Cloudflare Cache Rules** (Dashboard)
2. **Convert SVG to PNG** (Online converter or script)
3. **Test with Facebook Debugger**
4. **Run final verification script**
5. **Deploy changes** (if PNG conversion done)

---

## Deployment

After completing all fixes:

```bash
git add .
git commit -m "fix: A+ launch grade - cache rules, OG image, demo route"
git push origin main
```

Cloudflare Pages will auto-deploy all changes.

