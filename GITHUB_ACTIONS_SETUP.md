# 🚀 GitHub Actions — Cloudflare Pages Deployment Setup

**Status:** ✅ Workflow file created  
**Location:** `.github/workflows/deploy-cloudflare.yml`

---

## ✅ WORKFLOW CONFIGURED

The workflow will automatically deploy all 4 sites to Cloudflare Pages on every push:

1. **vertikalapp** → `./public`
2. **investors-vertikalapp** → `./public/investors`
3. **creators-vertikalapp** → `./public/creators`
4. **networks-vertikalapp** → `./public/networks`

**Triggers:**
- Push to any branch
- Pull requests
- Manual dispatch (workflow_dispatch)

---

## 🔐 REQUIRED GITHUB SECRETS

**Before pushing, you MUST add these secrets to GitHub:**

### **1. CLOUDFLARE_ACCOUNT_ID**

**How to get it:**
1. Go to: https://dash.cloudflare.com/
2. Click **"Workers & Pages"** → **"Overview"**
3. Your **Account ID** is shown in the right sidebar (or in URL: `https://dash.cloudflare.com/[ACCOUNT_ID]/workers`)

**Add to GitHub:**
1. Go to: `https://github.com/AlphaJRR/vertikal/settings/secrets/actions`
2. Click **"New repository secret"**
3. Name: `CLOUDFLARE_ACCOUNT_ID`
4. Value: Paste your Account ID
5. Click **"Add secret"**

---

### **2. CLOUDFLARE_API_TOKEN**

**How to create it:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Click **"Create Custom Token"**
4. **Token name:** `GitHub Actions - Vertikal Deploy`
5. **Permissions:**
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Zone** → **Zone** → **Read** (if using custom domains)
6. **Account Resources:** Include → Select your account
7. Click **"Continue to summary"** → **"Create Token"**
8. **Copy the token** (you won't see it again)

**Add to GitHub:**
1. Go to: `https://github.com/AlphaJRR/vertikal/settings/secrets/actions`
2. Click **"New repository secret"**
3. Name: `CLOUDFLARE_API_TOKEN`
4. Value: Paste the token
5. Click **"Add secret"**

---

### **3. SLACK_WEBHOOK_URL (Optional)**

**If you want Slack notifications:**

1. Go to: https://api.slack.com/apps
2. Create app → **"Incoming Webhooks"**
3. Activate Incoming Webhooks
4. Add webhook to workspace → Copy webhook URL

**Add to GitHub:**
1. Go to: `https://github.com/AlphaJRR/vertikal/settings/secrets/actions`
2. Click **"New repository secret"**
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Paste webhook URL
5. Click **"Add secret"**

**Note:** If not set, Slack notifications will be skipped (workflow still works).

---

## ✅ VERIFY SETUP

**After adding secrets, verify:**

1. **Check secrets exist:**
   - Go to: `https://github.com/AlphaJRR/vertikal/settings/secrets/actions`
   - You should see:
     - ✅ `CLOUDFLARE_ACCOUNT_ID`
     - ✅ `CLOUDFLARE_API_TOKEN`
     - ⚪ `SLACK_WEBHOOK_URL` (optional)

2. **Check workflow file:**
   - Go to: `https://github.com/AlphaJRR/vertikal/actions`
   - You should see: **"Deploy to Cloudflare Pages"** workflow

---

## 🚀 FIRST DEPLOYMENT

**Once secrets are set:**

1. **Push the workflow file:**
   ```bash
   cd /Users/alphavisualartists/Vertikal-App
   git add .github/workflows/deploy-cloudflare.yml
   git commit -m "feat: Add GitHub Actions workflow for Cloudflare Pages deployment"
   git push -u origin main
   ```

2. **Monitor deployment:**
   - Go to: `https://github.com/AlphaJRR/vertikal/actions`
   - Click the latest workflow run
   - Watch all 4 jobs deploy sequentially

3. **Verify sites:**
   - `vertikalapp.com` → Should deploy from `./public`
   - `investors.vertikalapp.com` → Should deploy from `./public/investors`
   - `creators.vertikalapp.com` → Should deploy from `./public/creators`
   - `networks.vertikalapp.com` → Should deploy from `./public/networks`

---

## 📋 WORKFLOW BEHAVIOR

**On Push to `main`:**
- All 4 sites deploy to **Production**
- Deployments are sequential (one after another)
- Slack notification sent (if configured)

**On Push to other branches:**
- All 4 sites deploy as **Preview** deployments
- Each branch gets its own preview URLs

**On Pull Request:**
- Preview deployments created
- Can be reviewed before merging

**Manual Trigger:**
- Go to: Actions → "Deploy to Cloudflare Pages" → "Run workflow"
- Select branch → Click "Run workflow"

---

## 🔧 TROUBLESHOOTING

### **Error: "CLOUDFLARE_ACCOUNT_ID not set"**
- **Fix:** Add the secret to GitHub (see above)

### **Error: "CLOUDFLARE_API_TOKEN not set"**
- **Fix:** Add the secret to GitHub (see above)

### **Error: "Project not found"**
- **Fix:** Ensure Cloudflare Pages projects exist:
  - `vertikalapp`
  - `investors-vertikalapp`
  - `creators-vertikalapp`
  - `networks-vertikalapp`

### **Error: "Directory does not exist"**
- **Fix:** Verify directory structure:
  ```bash
  ls -la public/
  ls -la public/investors/
  ls -la public/creators/
  ls -la public/networks/
  ```

---

## ✅ NEXT STEPS

1. **Add GitHub secrets** (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)
2. **Commit and push** the workflow file
3. **Monitor first deployment** in GitHub Actions
4. **Verify all 4 sites** are live

---

**Status:** ✅ **WORKFLOW READY**  
**Next:** Add secrets → Push → Deploy automatically

