# CLOUDFLARE PAGES GIT SETUP - CLICK-BY-CLICK SCRIPT

**Date:** 2024-12-30  
**Purpose:** Create NEW Git-connected Cloudflare Pages projects (replace direct upload)

---

## PREREQUISITES

1. Cloudflare Dashboard access: https://dash.cloudflare.com
2. GitHub repo: `AlphaJRR/vertikal`
3. Branch: `main`

---

## STEP-BY-STEP: CREATE 5 PAGES PROJECTS

### Project 1: `vertikalapp` → `vertikalapp.com`

1. **Go to:** https://dash.cloudflare.com
2. **Click:** Workers & Pages (left sidebar)
3. **Click:** Create application (top right)
4. **Click:** Pages tab
5. **Click:** Connect to Git
6. **Select:** GitHub
7. **Authorize** Cloudflare to access GitHub (if prompted)
8. **Select repository:** `AlphaJRR/vertikal`
9. **Click:** Begin setup
10. **Configure:**
    - **Project name:** `vertikalapp`
    - **Production branch:** `main`
    - **Framework preset:** `None` (or leave blank)
    - **Build command:** *(leave blank)*
    - **Build output directory:** `public`
    - **Root directory:** *(leave blank)*
11. **Click:** Save and Deploy
12. **Wait** for first deployment (30-60 seconds)
13. **Go to:** Custom domains tab
14. **Click:** Set up a custom domain
15. **Enter:** `vertikalapp.com`
16. **Click:** Continue
17. **Verify DNS:** Should show CNAME `@ → vertikalapp.pages.dev` (Proxied ✅)
18. **Click:** Activate domain
19. **Status:** Should show "Active" ✅

---

### Project 2: `creators-vertikalapp` → `creators.vertikalapp.com`

1. **Repeat steps 1-9** from Project 1
2. **Configure:**
    - **Project name:** `creators-vertikalapp`
    - **Production branch:** `main`
    - **Framework preset:** `None`
    - **Build command:** *(blank)*
    - **Build output directory:** `public/creators`
    - **Root directory:** *(blank)*
3. **Click:** Save and Deploy
4. **Custom domain:** `creators.vertikalapp.com`
5. **Verify DNS:** CNAME `creators → creators-vertikalapp.pages.dev` (Proxied ✅)

---

### Project 3: `investors-vertikalapp` → `investors.vertikalapp.com`

1. **Repeat steps 1-9** from Project 1
2. **Configure:**
    - **Project name:** `investors-vertikalapp`
    - **Production branch:** `main`
    - **Framework preset:** `None`
    - **Build command:** *(blank)*
    - **Build output directory:** `public/investors`
    - **Root directory:** *(blank)*
3. **Click:** Save and Deploy
4. **Custom domain:** `investors.vertikalapp.com`
5. **Verify DNS:** CNAME `investors → investors-vertikalapp.pages.dev` (Proxied ✅)

---

### Project 4: `networks-vertikalapp` → `networks.vertikalapp.com`

1. **Repeat steps 1-9** from Project 1
2. **Configure:**
    - **Project name:** `networks-vertikalapp`
    - **Production branch:** `main`
    - **Framework preset:** `None`
    - **Build command:** *(blank)*
    - **Build output directory:** `public/networks`
    - **Root directory:** *(blank)*
3. **Click:** Save and Deploy
4. **Custom domain:** `networks.vertikalapp.com`
5. **Verify DNS:** CNAME `networks → networks-vertikalapp.pages.dev` (Proxied ✅)

---

### Project 5: `beta-vertikalapp` → `beta.vertikalapp.com`

1. **Repeat steps 1-9** from Project 1
2. **Configure:**
    - **Project name:** `beta-vertikalapp`
    - **Production branch:** `main`
    - **Framework preset:** `None`
    - **Build command:** *(blank)*
    - **Build output directory:** `public/beta`
    - **Root directory:** *(blank)*
3. **Click:** Save and Deploy
4. **Custom domain:** `beta.vertikalapp.com`
5. **Verify DNS:** CNAME `beta → beta-vertikalapp.pages.dev` (Proxied ✅)

---

## CLEANUP: REMOVE OLD DIRECT-UPLOAD PROJECTS

**If old projects exist with direct upload (not Git-connected):**

1. **Go to:** Workers & Pages → Pages
2. **Find** old projects (if any):
   - Check for projects without "Connected to Git" badge
   - Or projects with different names
3. **For each old project:**
   - Click project name
   - Go to Settings → General
   - Scroll to bottom
   - Click "Delete project"
   - Confirm deletion
4. **Remove custom domains from old projects** (if not auto-removed):
   - Go to Custom domains tab
   - Remove domain
   - Domain will be available for new Git-connected project

---

## VERIFICATION CHECKLIST

After all 5 projects are created:

- [ ] All projects show "Connected to Git" badge
- [ ] All projects show latest commit hash
- [ ] All custom domains show "Active" status
- [ ] All deployments show green checkmarks
- [ ] Test each site in incognito browser:
  - [ ] https://vertikalapp.com
  - [ ] https://creators.vertikalapp.com
  - [ ] https://investors.vertikalapp.com
  - [ ] https://networks.vertikalapp.com
  - [ ] https://beta.vertikalapp.com

---

## TROUBLESHOOTING

### If "Connect to Git" button doesn't appear:
- Ensure you have Cloudflare Pages access
- Try refreshing the dashboard
- Check GitHub integration is authorized

### If deployment fails:
- Check Build logs in Deployments tab
- Verify output directory matches folder structure
- Ensure `index.html` exists in output directory

### If custom domain shows "Pending":
- Wait 2-5 minutes for DNS propagation
- Verify DNS records in Cloudflare DNS dashboard
- Check CNAME points to correct `.pages.dev` domain

---

## SUMMARY TABLE

| Project Name | Output Directory | Custom Domain | DNS Record |
|--------------|-----------------|---------------|------------|
| `vertikalapp` | `public` | `vertikalapp.com` | `@ → vertikalapp.pages.dev` |
| `creators-vertikalapp` | `public/creators` | `creators.vertikalapp.com` | `creators → creators-vertikalapp.pages.dev` |
| `investors-vertikalapp` | `public/investors` | `investors.vertikalapp.com` | `investors → investors-vertikalapp.pages.dev` |
| `networks-vertikalapp` | `public/networks` | `networks.vertikalapp.com` | `networks → networks-vertikalapp.pages.dev` |
| `beta-vertikalapp` | `public/beta` | `beta.vertikalapp.com` | `beta → beta-vertikalapp.pages.dev` |

**All projects:**
- Repository: `AlphaJRR/vertikal`
- Branch: `main`
- Framework: `None`
- Build command: *(blank)*

---

**END OF SCRIPT**

