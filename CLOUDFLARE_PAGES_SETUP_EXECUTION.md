# CLOUDFLARE PAGES SETUP — EXECUTION GUIDE

**Date:** 2024-12-30  
**Status:** Ready for Cloudflare Dashboard execution

---

## A) GIT VERIFICATION RESULTS

**Repository State:**
- Status: Clean working tree
- Branch: main
- Remote: git@github.com:AlphaJRR/vertikal.git
- Latest commit: Verified and pushed

**All surfaces confirmed present:**
- ✅ public/index.html
- ✅ public/creators/index.html
- ✅ public/investors/index.html
- ✅ public/networks/index.html
- ✅ public/beta/index.html

**Asset paths verified:**
- ✅ All use absolute `/assets/` paths (correct for subfolders)

---

## B) CLOUDFLARE PAGES PROJECT SETTINGS

### Project 1: `vertikalapp`
- **Repository:** AlphaJRR/vertikal
- **Branch:** main
- **Framework preset:** None
- **Build command:** *(blank)*
- **Root directory:** *(blank)*
- **Output directory:** `public`
- **Custom domain:** vertikalapp.com

### Project 2: `creators-vertikalapp`
- **Repository:** AlphaJRR/vertikal
- **Branch:** main
- **Framework preset:** None
- **Build command:** *(blank)*
- **Root directory:** *(blank)*
- **Output directory:** `public/creators`
- **Custom domain:** creators.vertikalapp.com

### Project 3: `investors-vertikalapp`
- **Repository:** AlphaJRR/vertikal
- **Branch:** main
- **Framework preset:** None
- **Build command:** *(blank)*
- **Root directory:** *(blank)*
- **Output directory:** `public/investors`
- **Custom domain:** investors.vertikalapp.com

### Project 4: `networks-vertikalapp`
- **Repository:** AlphaJRR/vertikal
- **Branch:** main
- **Framework preset:** None
- **Build command:** *(blank)*
- **Root directory:** *(blank)*
- **Output directory:** `public/networks`
- **Custom domain:** networks.vertikalapp.com

### Project 5: `beta-vertikalapp`
- **Repository:** AlphaJRR/vertikal
- **Branch:** main
- **Framework preset:** None
- **Build command:** *(blank)*
- **Root directory:** *(blank)*
- **Output directory:** `public/beta`
- **Custom domain:** beta.vertikalapp.com

---

## C) CUSTOM DOMAINS STATUS

**Status:** [Requires Cloudflare Dashboard verification]

**Expected mappings:**
- vertikalapp.com → vertikalapp project
- creators.vertikalapp.com → creators-vertikalapp project
- investors.vertikalapp.com → investors-vertikalapp project
- networks.vertikalapp.com → networks-vertikalapp project
- beta.vertikalapp.com → beta-vertikalapp project

**If domain shows "already in use":**
1. Go to old project → Custom domains → Remove domain
2. Go to new Git-connected project → Custom domains → Add domain
3. Verify DNS shows correct CNAME to new `.pages.dev` domain

---

## D) NEXT ACTION

**Execute in Cloudflare Dashboard:**
1. Create/recreate 5 Git-connected Pages projects (see B above)
2. Configure output directories per project
3. Add custom domains per project
4. Verify deployments show "Success" status
5. Test each domain loads correctly

**Verification checklist:**
- [ ] All 5 projects show "Connected to Git" badge
- [ ] All custom domains show "Active" status
- [ ] Latest deployments show "Success"
- [ ] All sites load with correct content and CSS
- [ ] Navigation links work (no 404s)

---

**END OF GUIDE**

