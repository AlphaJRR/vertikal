# CLOUDFLARE PAGES + GIT SETUP (ZERO GUESSING)

**Date:** 2024-12-30  
**Status:** ✅ EXACT SETTINGS PROVIDED  
**Method:** Cloudflare Pages + Git (No Wrangler)

---

## STEP 0: WORKFLOW STATUS

**Current workflow:** `.github/workflows/deploy-cloudflare.yml`

**Status:** ✅ **KEEP THIS** - Uses `cloudflare/pages-action` (correct for Pages)

**Action:** No changes needed. This workflow is correct for Git-driven Pages deployments.

---

## STEP 1: FOLDER STRUCTURE (VERIFIED)

**Output of `find . -maxdepth 5 -name "index.html"`:**

```
./public/index.html                    ← Main site
./public/creators/index.html           ← Creators site
./public/investors/index.html          ← Investors site
./public/networks/index.html           ← Networks site
./public/beta/index.html               ← Beta site
```

**Structure:** ✅ Single `public/` directory with subfolders per site

---

## STEP 2: EXACT CLOUDFLARE PAGES SETTINGS

### Project A: `vertikalapp` → `vertikalapp.com`

**Cloudflare Dashboard → Workers & Pages → Pages → Create Project → Connect to Git**

**Repository:** `AlphaJRR/vertikal`  
**Production branch:** `main`

**Build settings:**
- **Framework preset:** `None` (Static HTML)
- **Build command:** *(leave blank)*
- **Root directory:** `public`
- **Build output directory:** `.`

**Custom domains:**
- `vertikalapp.com`
- `www.vertikalapp.com` (optional)

---

### Project B: `creators-vertikalapp` → `creators.vertikalapp.com`

**Connect to Git:**
- **Repository:** `AlphaJRR/vertikal`
- **Production branch:** `main`

**Build settings:**
- **Framework preset:** `None` (Static HTML)
- **Build command:** *(leave blank)*
- **Root directory:** `public/creators`
- **Build output directory:** `.`

**Custom domains:**
- `creators.vertikalapp.com`

---

### Project C: `investors-vertikalapp` → `investors.vertikalapp.com`

**Connect to Git:**
- **Repository:** `AlphaJRR/vertikal`
- **Production branch:** `main`

**Build settings:**
- **Framework preset:** `None` (Static HTML)
- **Build command:** *(leave blank)*
- **Root directory:** `public/investors`
- **Build output directory:** `.`

**Custom domains:**
- `investors.vertikalapp.com`

---

### Project D: `networks-vertikalapp` → `networks.vertikalapp.com`

**Connect to Git:**
- **Repository:** `AlphaJRR/vertikal`
- **Production branch:** `main`

**Build settings:**
- **Framework preset:** `None` (Static HTML)
- **Build command:** *(leave blank)*
- **Root directory:** `public/networks`
- **Build output directory:** `.`

**Custom domains:**
- `networks.vertikalapp.com`

---

### Project E: `beta-vertikalapp` → `beta.vertikalapp.com`

**Connect to Git:**
- **Repository:** `AlphaJRR/vertikal`
- **Production branch:** `main`

**Build settings:**
- **Framework preset:** `None` (Static HTML)
- **Build command:** *(leave blank)*
- **Root directory:** `public/beta`
- **Build output directory:** `.`

**Custom domains:**
- `beta.vertikalapp.com`

---

## STEP 3: DNS SETUP

**When you add Custom Domains in Pages, Cloudflare will offer to auto-create DNS records. Accept this.**

**If doing manually, pattern is:**

| Subdomain | Type | Target |
|-----------|------|--------|
| `@` (apex) | CNAME | `vertikalapp.pages.dev` (Proxied ✅) |
| `www` | CNAME | `vertikalapp.pages.dev` (Proxied ✅) |
| `creators` | CNAME | `creators-vertikalapp.pages.dev` (Proxied ✅) |
| `investors` | CNAME | `investors-vertikalapp.pages.dev` (Proxied ✅) |
| `networks` | CNAME | `networks-vertikalapp.pages.dev` (Proxied ✅) |
| `beta` | CNAME | `beta-vertikalapp.pages.dev` (Proxied ✅) |

**Note:** Cloudflare handles CNAME flattening for apex (`@`) records automatically.

---

## STEP 4: WHERE TO SEE BUILDS + DEPLOYMENTS

**Location:** Cloudflare Dashboard → **Workers & Pages → Pages → [project name] → Deployments**

**This tab shows:**
- ✅ Every Git push triggers a new deployment
- ✅ Build status (Success/Failure)
- ✅ Build logs
- ✅ Deployment URL
- ✅ Custom domain status

**This is your build history. No more guessing.**

---

## STEP 5: VERIFICATION (5-MINUTE TEST)

### After connecting Git to all 5 projects:

1. **Make a tiny change:**
   ```bash
   echo "<!-- Test deploy -->" >> public/index.html
   git add public/index.html
   git commit -m "Test: Verify Git-driven deployment"
   git push origin main
   ```

2. **Watch Deployments tab in each Pages project:**
   - Should show new deployment within 30-60 seconds
   - Status should be "Building" → "Success"
   - All 5 projects should deploy simultaneously

3. **Test in Incognito browser (after 2-3 minutes):**
   - ✅ https://vertikalapp.com
   - ✅ https://creators.vertikalapp.com
   - ✅ https://investors.vertikalapp.com
   - ✅ https://networks.vertikalapp.com
   - ✅ https://beta.vertikalapp.com

---

## CRITICAL SETTINGS SUMMARY

| Project | Root Directory | Output Directory | Custom Domain |
|---------|---------------|------------------|---------------|
| `vertikalapp` | `public` | `.` | `vertikalapp.com` |
| `creators-vertikalapp` | `public/creators` | `.` | `creators.vertikalapp.com` |
| `investors-vertikalapp` | `public/investors` | `.` | `investors.vertikalapp.com` |
| `networks-vertikalapp` | `public/networks` | `.` | `networks.vertikalapp.com` |
| `beta-vertikalapp` | `public/beta` | `.` | `beta.vertikalapp.com` |

**All projects:**
- Framework: `None`
- Build command: *(blank)*
- Branch: `main`
- Repository: `AlphaJRR/vertikal`

---

## TROUBLESHOOTING

### If "Root directory" field doesn't exist:

**Cloudflare Pages UI may show:**
- "Build output directory" only

**In this case:**
- Set **Build output directory** to: `public` (for main) or `public/creators` (for creators), etc.
- Leave Root directory blank or set to repository root

### If deployments fail:

1. Check **Deployments → [failed deployment] → Build logs**
2. Look for: "Directory not found" or "index.html not found"
3. Verify Root directory matches folder structure above

### If custom domain shows "Pending":

1. Check DNS records exist (Cloudflare should auto-create)
2. Wait 2-5 minutes for DNS propagation
3. Verify CNAME points to correct `.pages.dev` domain

---

## SUCCESS INDICATORS

✅ **Git Connected:**
- Pages project shows "Connected to GitHub"
- Repository: `AlphaJRR/vertikal`
- Branch: `main`

✅ **Deployment Working:**
- Every push to `main` triggers new deployment
- Deployments tab shows build history
- Status: Green checkmarks

✅ **Sites Live:**
- All 5 custom domains return HTTP 200
- Content loads correctly
- Assets (images, CSS) load

---

## NEXT STEPS

1. **Connect Git to all 5 Pages projects** (use settings above)
2. **Push a test commit** to verify deployments
3. **Monitor Deployments tab** for build history
4. **Verify all sites** in incognito browser

**No more Wrangler. No more guessing. Git-driven deployments only.**

---

**END OF GUIDE**

