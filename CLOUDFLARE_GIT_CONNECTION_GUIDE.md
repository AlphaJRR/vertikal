# 🔒 CLOUDFLARE PAGES GIT CONNECTION GUIDE

**Objective:** Connect all Cloudflare Pages projects to Git for Git-only deployments

---

## 🎯 STEP 1: CONNECT creators-vertikalapp TO GIT

### A) Open the Project
1. Cloudflare Dashboard → **Workers & Pages**
2. Click **creators-vertikalapp**

### B) Find the Git Connection Control

**Look in one of these locations:**

**Option 1 (Most Common):**
- **Settings** tab → **Builds & deployments** → Look for **"Connect to Git"** button

**Option 2:**
- **Deployments** tab → Look for **"Connect Git"** or **"Set up Git integration"** button

**Option 3 (Wrangler-created projects):**
- If you DON'T see "Connect to Git" anywhere → Skip to **Section 2** (Create new Git-connected project)

### C) If You DO See "Connect to Git"

1. Click **"Connect to Git"**
2. Choose **GitHub**
3. Authorize Cloudflare (if prompted)
4. Select repository: **AlphaJRR/vertikal**
5. Branch: **main**
6. Framework preset: **None**
7. Build command: **(leave blank)**
8. **Build output directory:** `public/creators`
9. Click **Save**

### D) Verify Git-Driven Deployment

- Go to **Deployments** tab
- You should now see **source = GitHub** (not "direct upload / API / wrangler-only")
- Latest deployment should show commit hash and GitHub link

---

## 🔄 STEP 2: IF NO "CONNECT TO GIT" BUTTON EXISTS

**This means the project was created via Wrangler and can't be converted.**

### A) Create New Git-Connected Project

1. **Workers & Pages** → **Pages** → **Create a project**
2. Click **"Connect to Git"**
3. Choose **GitHub** → Select **AlphaJRR/vertikal**
4. Branch: **main**
5. Framework: **None**
6. Build command: **(blank)**
7. **Output directory:** `public/creators`
8. Project name: **creators-vertikalapp** (or **creators-vertikalapp-new** if name conflict)
9. Click **Create**

### B) Move Custom Domain to New Project

1. Open **OLD creators project** → **Custom domains** tab
2. Find **creators.vertikalapp.com**
3. Click **Remove** (or **Delete**)
4. Open **NEW creators project** → **Custom domains** tab
5. Click **"Add a custom domain"**
6. Enter: **creators.vertikalapp.com**
7. Wait until it shows **"Active"** status

✅ **Domain is now locked to Git-driven deployment**

---

## 📋 REPEAT FOR ALL PROJECTS

### Project Mapping:

| Project Name | Build Output Directory | Custom Domain |
|--------------|----------------------|---------------|
| `vertikalapp` | `public/` | `vertikalapp.com` |
| `creators-vertikalapp` | `public/creators/` | `creators.vertikalapp.com` |
| `investors-vertikalapp` | `public/investors/` | `investors.vertikalapp.com` |
| `networks-vertikalapp` | `public/networks/` | `networks.vertikalapp.com` |
| `beta-vertikalapp` | `public/beta/` | `beta.vertikalapp.com` |
| `demo-vertikalapp` | `public/demo/` | `demo.vertikalapp.com` |

### For Each Project:

**Follow Steps A-D above, using the correct:**
- Project name
- Build output directory (from table above)
- Custom domain (from table above)

---

## ✅ VERIFICATION CHECKLIST

After connecting each project to Git:

- [ ] **Deployments tab** shows source = **GitHub**
- [ ] Latest deployment shows **commit hash** and **GitHub link**
- [ ] **Custom domain** is attached and shows **"Active"**
- [ ] **Settings → Builds & deployments** shows:
  - Production branch: **main**
  - Build output directory: **(correct path from table)**
  - Root directory: **(leave empty)**

---

## 🚨 TROUBLESHOOTING

### If "Connect to Git" Button Doesn't Appear:

**Solution:** Create new Git-connected project and move domain (Step 2 above)

### If Domain Won't Attach:

**Check:**
1. DNS record exists and points to correct `*.pages.dev` hostname
2. SSL/TLS mode is **Full (strict)**
3. Wait 2-3 minutes for DNS propagation

### If Deployments Fail:

**Check:**
1. GitHub repository is accessible
2. Build output directory path is correct
3. Branch name is **main** (not `master`)
4. GitHub Actions workflow is configured correctly

---

## 📊 CURRENT STATUS

**Projects to Connect:**
- [ ] `creators-vertikalapp` → `public/creators/`
- [ ] `investors-vertikalapp` → `public/investors/`
- [ ] `networks-vertikalapp` → `public/networks/`
- [ ] `beta-vertikalapp` → `public/beta/`
- [ ] `vertikalapp` → `public/`
- [ ] `demo-vertikalapp` → `public/demo/`

---

## 🎯 QUICK CHECK BEFORE STARTING

**Question:** Do you see a **"Connect to Git"** button inside `creators-vertikalapp` → **Settings** → **Builds & deployments**?

- **Yes** → Follow **Step 1C** (Connect existing project)
- **No** → Follow **Step 2** (Create new Git-connected project)

---

**Status:** Ready to execute Git connection for all projects.

