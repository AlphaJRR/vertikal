# Cloudflare Cache Rules — A+ Launch Stability Fix

**Purpose:** Eliminate 503 errors by caching static assets at the edge  
**Last Updated:** December 31, 2024  
**Status:** Required for A+ Launch Grade

---

## Overview

Cloudflare Cache Rules allow you to cache static assets (HTML, CSS, JS, images) at the edge, reducing server load and eliminating 503 errors during traffic spikes.

**Target:** Cache all static assets with 1-hour minimum Edge TTL

---

## Step-by-Step: Create Cache Rule

### 1. Navigate to Caching Settings

**Click Path:**
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Click **vertikalapp.com** domain (or select from domain list)
4. Left sidebar → **Caching** → **Cache Rules**
5. Click **Create rule** button

---

### 2. Configure Rule: "Cache Everything Static"

**Rule Name:**
```
Cache Static Assets
```

**When incoming requests match:**
- **Field:** `URI Path`
- **Operator:** `matches`
- **Value:** `.*\.(html|css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$`

**OR use multiple conditions (more explicit):**
- Condition 1: `URI Path` `ends with` `.html`
- Condition 2: `URI Path` `ends with` `.css` (OR)
- Condition 3: `URI Path` `ends with` `.js` (OR)
- Condition 4: `URI Path` `ends with` `.png` (OR)
- Condition 5: `URI Path` `ends with` `.jpg` (OR)
- Condition 6: `URI Path` `ends with` `.svg` (OR)
- Condition 7: `URI Path` `ends with` `.ico` (OR)
- Condition 8: `URI Path` `ends with` `.woff` (OR)
- Condition 9: `URI Path` `ends with` `.woff2`

---

### 3. Set Cache Action

**Then:**
- **Cache status:** `Cache everything`
- **Edge TTL:** `1 hour` (minimum)
- **Browser TTL:** `Respect existing headers` (or `1 hour`)

**Advanced Options:**
- **Cache by device type:** `Off` (or `On` if you want separate cache for mobile)
- **Cache key:** `Default` (or customize if needed)

---

### 4. Save and Deploy

1. Click **Deploy** button
2. Rule will be active immediately
3. Wait 30 seconds for propagation

---

### 5. Purge Cache (After Rule Creation)

**Click Path:**
1. **Caching** → **Purge Cache**
2. Select **Purge Everything**
3. Click **Purge Everything** button
4. Wait 30-60 seconds for purge to complete

**Alternative (Selective Purge):**
- **Purge by URL:** Enter specific URLs to purge
- **Purge by Host:** Select `vertikalapp.com` and subdomains
- **Purge by Tag:** Not applicable for static assets

---

## Verification

### 1. Test Cache Headers

```bash
# Test HTML file
curl -I https://vertikalapp.com/demo

# Should return:
# CF-Cache-Status: MISS (first request)
# CF-Cache-Status: HIT (subsequent requests)
# Cache-Control: public, max-age=3600
```

### 2. Check Edge TTL

```bash
# Check cache headers
curl -I https://vertikalapp.com/assets/css/styles.css

# Expected headers:
# CF-Cache-Status: HIT
# CF-RAY: [cache location]
# Cache-Control: public, max-age=3600
```

### 3. Monitor Cache Hit Rate

**Dashboard Path:**
1. **Analytics** → **Caching**
2. Check **Cache Hit Ratio** (should be >80% after 24 hours)
3. Monitor **Bandwidth Saved** metric

---

## Expected Results

**Before Cache Rules:**
- 503 errors during traffic spikes
- High origin server load
- Slow page loads

**After Cache Rules:**
- ✅ Static assets cached at edge (1 hour TTL)
- ✅ Reduced origin server load
- ✅ Faster page loads
- ✅ 503 errors eliminated
- ✅ Cache hit ratio >80%

---

## Troubleshooting

### Cache Not Working

1. **Check rule order:** More specific rules should be first
2. **Verify URL pattern:** Test regex at https://regex101.com
3. **Check cache status:** Use `curl -I` to see `CF-Cache-Status` header
4. **Purge cache:** May need to purge after rule changes

### Still Getting 503s

1. **Increase Edge TTL:** Try 2-4 hours for static assets
2. **Check origin server:** Ensure origin can handle uncached requests
3. **Review cache rules:** Ensure rules are matching correctly
4. **Check Cloudflare status:** https://www.cloudflarestatus.com

---

## Additional Optimization

### Cache HTML with Shorter TTL

Create a separate rule for HTML files:
- **Rule Name:** `Cache HTML`
- **Match:** `URI Path` `ends with` `.html`
- **Edge TTL:** `15 minutes` (shorter for content updates)
- **Browser TTL:** `5 minutes`

### Cache API Responses (if applicable)

- **Rule Name:** `Cache API`
- **Match:** `URI Path` `starts with` `/api/`
- **Edge TTL:** `5 minutes`
- **Cache status:** `Cache everything` (if API supports caching)

---

## Rule Priority

Cloudflare processes cache rules in order. Ensure:
1. **Most specific rules first** (e.g., HTML-specific)
2. **General rules last** (e.g., all static assets)
3. **No conflicting rules** (check for overlapping patterns)

---

## Maintenance

- **Weekly:** Review cache hit ratio
- **After deployments:** Purge cache for updated files
- **Monthly:** Review and optimize TTL values
- **After traffic spikes:** Check cache performance metrics

---

## Success Criteria

✅ Cache rule created and active  
✅ Edge TTL set to 1 hour minimum  
✅ Cache purged after rule creation  
✅ Static assets return `CF-Cache-Status: HIT`  
✅ Cache hit ratio >80% after 24 hours  
✅ No 503 errors during traffic spikes  

**Status:** Ready for A+ Launch Grade

