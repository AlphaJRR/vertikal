# 🚀 Cloudflare Pages Project Setup

## Quick Setup Script

Run this to check/create the `vertikalapp` project:

```bash
# Set credentials (if not already in GitHub Secrets)
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export CLOUDFLARE_API_TOKEN="your_api_token"

# Run the script
./check-and-create-cloudflare-project.sh
```

---

## Manual Setup (If Script Fails)

### Step 1: Create Project in Cloudflare Dashboard

1. Go to: **https://dash.cloudflare.com** → **Pages**
2. Click **"Create a project"**
3. Select **"Upload assets"** (for first-time setup)
4. **Project name:** `vertikalapp` (exact match, lowercase)
5. **Upload:** Drag the `public/` folder from your repo
6. Click **"Deploy site"**

### Step 2: Attach Custom Domain

1. In the project dashboard, go to **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter: `vertikalapp.com`
4. Follow DNS setup instructions (if needed)

### Step 3: Verify Deployment

After project is created, the GitHub Actions workflow will work:

```bash
./deploy-and-verify.sh
```

---

## Project Configuration

**Required Settings:**
- **Project name:** `vertikalapp` (exact)
- **Production branch:** `main`
- **Build command:** (leave blank - static site)
- **Build output directory:** `public` (if using Git)
- **Custom domain:** `vertikalapp.com`

---

## Verification

After setup, verify:
- ✅ Project exists in Cloudflare Dashboard
- ✅ Custom domain attached
- ✅ GitHub Actions can deploy (check workflow logs)
- ✅ Site loads at https://vertikalapp.com

---

**Status:** Ready to create project  
**Action:** Run script or create manually in dashboard

