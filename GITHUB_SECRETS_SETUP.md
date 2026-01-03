# GitHub Secrets Setup for Cloudflare Pages Deployment

## Error
```
Error: Input required and not supplied: apiToken
```

## Cause
The GitHub Actions workflow requires Cloudflare API credentials that are not set in the repository secrets.

## Solution

### Step 1: Get Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template OR create custom token with:
   - **Permissions:** `Cloudflare Pages:Edit`
   - **Account Resources:** Include your account
4. Click **"Continue to summary"** → **"Create Token"**
5. **Copy the token immediately** (you won't see it again)

### Step 2: Get Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account (right sidebar)
3. Copy the **Account ID** (32-character hex string)

### Step 3: Add Secrets to GitHub

1. Go to: `https://github.com/AlphaJRR/vertikal/settings/secrets/actions`
2. Click **"New repository secret"**
3. Add these two secrets:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: (paste your API token from Step 1)

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: (paste your Account ID from Step 2)

4. Click **"Add secret"** for each

### Step 4: Re-run Failed Workflow

1. Go to: `https://github.com/AlphaJRR/vertikal/actions`
2. Find the failed workflow run
3. Click **"Re-run jobs"** → **"Re-run all jobs"**

---

## Verification

After adding secrets and re-running:
- ✅ All 4 deployment jobs should succeed
- ✅ Live verification should pass
- ✅ Sites should deploy to Cloudflare Pages

---

## Quick Links

- **GitHub Secrets:** https://github.com/AlphaJRR/vertikal/settings/secrets/actions
- **Cloudflare API Tokens:** https://dash.cloudflare.com/profile/api-tokens
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **GitHub Actions:** https://github.com/AlphaJRR/vertikal/actions

