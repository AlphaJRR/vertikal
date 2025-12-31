# Cloudflare Pages Deployment Runbook

**Owner:** Joshua  
**Last Updated:** December 31, 2024  
**Repository:** `AlphaJRR/vertikal`  
**Branch:** `main`

---

## Overview

This runbook provides step-by-step instructions for deploying all Vertikal surfaces to Cloudflare Pages with Git integration. All deployments must be connected to GitHub `AlphaJRR/vertikal` `main` branch (NO Wrangler).

**Deployment Surfaces:**
1. Main site (`vertikalapp.com`)
2. Creators subdomain (`creators.vertikalapp.com`)
3. Investors subdomain (`investors.vertikalapp.com`)
4. Networks subdomain (`networks.vertikalapp.com`)
5. Beta subdomain (`beta.vertikalapp.com`)

---

## Prerequisites

- Cloudflare account with Pages access
- GitHub repository access: `AlphaJRR/vertikal`
- DNS access to `vertikalapp.com` domain
- All code committed and pushed to `main` branch

---

## Project Configuration Reference

| Project Name | Build Output Directory | Custom Domain | Purpose |
|-------------|------------------------|---------------|---------|
| `vertikalapp` | **(blank)** | `vertikalapp.com` | Main landing page |
| `creators-vertikalapp` | `public/creators` | `creators.vertikalapp.com` | Creators portal |
| `investors-vertikalapp` | `public/investors` | `investors.vertikalapp.com` | Investors portal |
| `networks-vertikalapp` | `public/networks` | `networks.vertikalapp.com` | Networks portal |
| `beta-vertikalapp` | `public/beta` | `beta.vertikalapp.com` | Beta access |

**Critical Settings (ALL Projects):**
- Framework preset: **None**
- Build command: **(blank)**
- Root directory: **(blank)**
- Production branch: **main**
- Git repository: **AlphaJRR/vertikal**

---

## Step-by-Step: Create Git-Connected Pages Project

### 1. Navigate to Cloudflare Pages

**Click Path:**
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account (if multiple)
3. Left sidebar → **Workers & Pages**
4. Click **Create application** button (top right)
5. Click **Pages** tab
6. Click **Connect to Git** button

---

### 2. Connect GitHub Repository

**Click Path:**
1. Select **GitHub** as Git provider
2. If not authorized, click **Authorize Cloudflare** → Authorize in GitHub popup
3. In repository selector, search for: **AlphaJRR/vertikal**
4. Select **AlphaJRR/vertikal** repository
5. Click **Begin setup**

---

### 3. Configure Build Settings

**For EACH project, use these EXACT settings:**

#### Project 1: vertikalapp (Main Site)
- **Project name:** `vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None** (or leave blank)
- **Build command:** (leave blank)
- **Build output directory:** (leave blank - serves from root)
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### Project 2: creators-vertikalapp (Creators Subdomain)
- **Project name:** `creators-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/creators` ⚠️ **CRITICAL**
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### Project 3: investors-vertikalapp (Investors Subdomain)
- **Project name:** `investors-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/investors` ⚠️ **CRITICAL**
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### Project 4: networks-vertikalapp (Networks Subdomain)
- **Project name:** `networks-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/networks` ⚠️ **CRITICAL**
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### Project 5: beta-vertikalapp (Beta Subdomain)
- **Project name:** `beta-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/beta` ⚠️ **CRITICAL**
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

---

### 4. Handle Existing Projects

**If project name already exists:**

**Option A: Delete and Recreate (Recommended)**
1. Go to existing project → **Settings** → Scroll to bottom
2. Click **Delete project** → Confirm deletion
3. Follow steps 1-3 above to create new Git-connected project

**Option B: Rename and Recreate**
1. Go to existing project → **Settings** → **Project name**
2. Rename to `{project-name}-old` (e.g., `vertikalapp-old`)
3. Detach custom domains (Settings → Custom domains → Remove each domain)
4. Create new project with correct name (steps 1-3)
5. Attach domains to new project (see step 5)
6. Delete old project after verification

---

### 5. Attach Custom Domains

**For EACH project:**

**Click Path:**
1. Open project → **Custom domains** tab
2. Click **Set up a custom domain** button
3. Enter domain:
   - **vertikalapp** → `vertikalapp.com` (and `www.vertikalapp.com` if needed)
   - **creators-vertikalapp** → `creators.vertikalapp.com`
   - **investors-vertikalapp** → `investors.vertikalapp.com`
   - **networks-vertikalapp** → `networks.vertikalapp.com`
   - **beta-vertikalapp** → `beta.vertikalapp.com`
4. Cloudflare will check DNS:
   - If CNAME exists: Click **Activate** (should be automatic)
   - If CNAME missing: Follow DNS setup instructions
5. Wait for **Active** status (green checkmark)

**DNS Requirements:**
- CNAME record: `{subdomain}` → `{project-name}.pages.dev` (e.g., `creators` → `creators-vertikalapp.pages.dev`)
- DNS status: **DNS only** or **Proxied** (both work)
- Propagation: Usually instant if DNS is already in Cloudflare

---

### 6. Verify Git Connection

**For EACH project:**

**Click Path:**
1. Open project → **Deployments** tab
2. Check latest deployment:
   - Should show **Git commit hash** (e.g., `3c36b21`)
   - Should show **Branch:** `main`
   - Should show **Status:** Green checkmark (Success)
3. Click deployment → Should show commit message
4. Verify **Source:** Shows GitHub icon + commit hash

**If deployment shows "Manual" or no Git info:**
- Project is NOT Git-connected → Delete and recreate (steps 1-3)

---

### 7. Verify Build Output

**Check that each project serves correct files:**

**Main site (vertikalapp):**
- Should serve `public/index.html` at root
- Should serve `public/_redirects` at root

**Subdomain projects:**
- **creators-vertikalapp** → Should serve `public/creators/index.html` as root
- **investors-vertikalapp** → Should serve `public/investors/index.html` as root
- **networks-vertikalapp** → Should serve `public/networks/index.html` as root
- **beta-vertikalapp** → Should serve `public/beta/index.html` as root

**How to verify:**
1. Go to project → **Deployments** → Click latest deployment
2. Click **View deployment** → Should show correct HTML content
3. Or visit custom domain → View source → Should match expected HTML

---

## Verification Checklist

### Git Connection
- [ ] All 5 projects show Git commit hash in Deployments tab
- [ ] Latest deployment shows current commit hash
- [ ] Deployment source shows GitHub icon (not "Manual")
- [ ] Branch shows: `main`

### HTTP Status Checks (Run in incognito)
```bash
curl -I https://vertikalapp.com | grep HTTP
curl -I https://creators.vertikalapp.com | grep HTTP
curl -I https://investors.vertikalapp.com | grep HTTP
curl -I https://networks.vertikalapp.com | grep HTTP
curl -I https://beta.vertikalapp.com | grep HTTP
```
- [ ] All return `HTTP/2 200` (or single redirect then 200)
- [ ] No `403`, `503`, or `404` errors

### Content Verification
- [ ] CSS loads (no broken styles)
- [ ] Images load (`/assets/` paths work)
- [ ] Navigation buttons respond
- [ ] No 404 assets in browser console
- [ ] Titles match expected values

### Redirect Verification
- [ ] `/demo` returns `HTTP/2 200` (no redirect loop)
- [ ] `/demo/` returns `HTTP/2 200` (no redirect loop)
- [ ] Subdomain redirects work: `/creators/*` → `creators.vertikalapp.com/*`

### Cache Issues (if content mismatch)
- [ ] Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- [ ] Purge Cloudflare cache: Dashboard → Caching → Purge Everything
- [ ] Wait 1-2 minutes for propagation

---

## Troubleshooting

### "No Git connection" in project settings
**Solution:** Delete project and recreate with Git connection (steps 1-3)

### Build fails
- **Check:** Build output directory is correct (blank for main, `public/{subdomain}` for subdomains)
- **Check:** No build command needed (leave blank)
- **Check:** Framework preset is "None"

### Domain not activating
- **Check:** DNS CNAME exists and points to Pages subdomain
- **Check:** DNS is in Cloudflare (not external)
- **Wait:** 1-2 minutes for propagation

### Wrong files served
- **Check:** Build output directory matches surface path exactly
- **Check:** `_redirects` file exists in `public/` (for main site only)

### Redirect loop on `/demo`
- **Check:** `public/_redirects` contains both `/demo` and `/demo/` rules
- **Check:** No conflicting redirect rules in Cloudflare Dashboard
- **Solution:** Ensure `_redirects` file is deployed with correct rules

---

## Quick Reference

### Project Settings Summary

| Project Name | Output Directory | Custom Domain |
|-------------|------------------|---------------|
| vertikalapp | (blank) | vertikalapp.com |
| creators-vertikalapp | public/creators | creators.vertikalapp.com |
| investors-vertikalapp | public/investors | investors.vertikalapp.com |
| networks-vertikalapp | public/networks | networks.vertikalapp.com |
| beta-vertikalapp | public/beta | beta.vertikalapp.com |

### Expected File Structure

```
public/
├── index.html              # Main site (served by vertikalapp)
├── _redirects             # Main site redirects
├── creators/
│   └── index.html         # Creators portal
├── investors/
│   └── index.html         # Investors portal
├── networks/
│   └── index.html         # Networks portal
└── beta/
    └── index.html         # Beta portal
```

---

## Maintenance

### Updating Deployments
- All deployments are automatic via Git push to `main` branch
- No manual deployment needed
- Each push triggers new deployment for all 5 projects

### Monitoring
- Check Cloudflare Dashboard → Workers & Pages → Each project → Deployments
- Monitor deployment status and build logs
- Verify Git commit hash matches latest push

---

## Common Issues

### Error 1014: CNAME Cross-User

**Symptom:** Custom domain returns Cloudflare Error 1014 even though domain shows "Active" in Pages project.

**Root Causes:**
1. Domain attached to multiple Pages projects
2. Manual Pages project cannot connect to Git (must recreate)
3. DNS zone and Pages project in different Cloudflare accounts

**Fix:** See `docs/runbooks/demo-1014-fix.md` for detailed diagnostic and fix steps.

**Critical Note:** You cannot retrofit Git onto a manual Pages project — you must recreate via Connect to Git and migrate domains.

---

## Related Documentation

- Repository: `AlphaJRR/vertikal`
- Branch: `main`
- Deployment Report: `DEPLOYMENT_LOCKDOWN_REPORT.md`
- Error 1014 Fix Guide: `docs/runbooks/demo-1014-fix.md`

---

**Last Updated:** December 31, 2024  
**Maintained By:** Joshua

