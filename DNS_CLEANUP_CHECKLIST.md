# 🔥 DNS CLEANUP — QUICK CHECKLIST

**Time Required:** 5 minutes  
**Priority:** P0 — CRITICAL BLOCKER

---

## ✅ EXECUTION CHECKLIST

### Step 1: Open Cloudflare Dashboard
- [ ] Go to https://dash.cloudflare.com
- [ ] Select `vertikalapp.com` zone
- [ ] Navigate to **DNS** → **Records**

### Step 2: DELETE These Records (Entire Records)
- [ ] `beta` CNAME → `beta-cfx.pages.dev`
- [ ] `cmo` CNAME → `cmo-strategy.pages.dev`
- [ ] `cto` CNAME → `cto-deck.pages.dev`
- [ ] `demo` CNAME → `demovertikalapp.netlify.app` ⚠️ **NETLIFY - ESPECIALLY TOXIC**
- [ ] `kelmitchell` CNAME → `kelmitchell-vertical.pages.dev`

**Action:** Click each record → **Delete** (entire record, not edit)

### Step 3: VERIFY These Records Remain (DO NOT DELETE)
- [ ] `@` (root) CNAME → `vertikalapp.pages.dev`
- [ ] `investors` CNAME → `investors-vertikalapp.pages.dev`
- [ ] `creators` CNAME → `creators-vertikalapp.pages.dev`
- [ ] `networks` CNAME → `networks-vertikalapp.pages.dev`
- [ ] Email records (MX/TXT) — **Leave alone**

### Step 4: Wait for Propagation
- [ ] Wait **2-5 minutes** (Cloudflare DNS is fast)

### Step 5: Hard Refresh & Verify
- [ ] Hard refresh: ⌘ + Shift + R (Mac) or Ctrl + Shift + R (Windows)
- [ ] Visit https://vertikalapp.com → ✅ Loads correctly
- [ ] Visit https://investors.vertikalapp.com → ✅ Loads correctly
- [ ] Visit https://creators.vertikalapp.com → ✅ Loads correctly
- [ ] Visit https://networks.vertikalapp.com → ✅ Loads correctly

### Step 6: Verification Checklist (Each Site)
- [ ] Loads correct site (not demo/Netlify)
- [ ] Shows correct UI
- [ ] No redirects
- [ ] No Netlify artifacts
- [ ] No demo content
- [ ] SSL certificate valid

---

## 🎯 FINAL DNS STATE (Should Look Like This)

```
Type    Name        Content                          Proxy
CNAME   @           vertikalapp.pages.dev            ✅ Proxied
CNAME   investors   investors-vertikalapp.pages.dev  ✅ Proxied
CNAME   creators    creators-vertikalapp.pages.dev   ✅ Proxied
CNAME   networks    networks-vertikalapp.pages.dev   ✅ Proxied
MX      @           (iCloud email)                    ❌ DNS only
TXT     @           (DKIM/SPF)                      ❌ DNS only
```

**That's it. Nothing else.**

---

## ⚠️ WHY THIS FIXES IT

**Before (Broken):**
- Mixed hosting providers (Pages + Netlify)
- DNS routing conflicts
- Unpredictable traffic routing
- TLS/cache issues

**After (Fixed):**
- ✅ All traffic → Cloudflare Pages only
- ✅ No routing conflicts
- ✅ System cannot misroute
- ✅ Clean, predictable routing

---

## 🚨 IF SOMETHING BREAKS

1. **Check DNS propagation:** https://www.whatsmydns.net/#CNAME/vertikalapp.com
2. **Verify Pages projects:** Cloudflare Dashboard → Pages → Projects
3. **Check custom domains:** Each Pages project → Custom domains tab

---

**Status:** Ready for execution  
**Documentation:** See `DNS_CLEANUP_CRITICAL.md` for detailed explanation

