# CLOUDFLARE PAGES GIT LOCKDOWN — EXACT UI INSTRUCTIONS

## PROJECTS TO CREATE/RECREATE:
1. **vertikalapp** (main site)
2. **creators-vertikalapp** (creators subdomain)
3. **investors-vertikalapp** (investors subdomain)
4. **networks-vertikalapp** (networks subdomain)
5. **beta-vertikalapp** (beta subdomain)

---

## STEP-BY-STEP: CREATE GIT-CONNECTED PAGES PROJECT

### **1. NAVIGATE TO CLOUDFLARE PAGES**

**Click Path:**
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account (if multiple)
3. Left sidebar → **Workers & Pages**
4. Click **Create application** button (top right)
5. Click **Pages** tab
6. Click **Connect to Git** button

---

### **2. CONNECT GITHUB REPOSITORY**

**Click Path:**
1. Select **GitHub** as Git provider
2. If not authorized, click **Authorize Cloudflare** → Authorize in GitHub popup
3. In repository selector, search for: **AlphaJRR/vertikal**
4. Select **AlphaJRR/vertikal** repository
5. Click **Begin setup**

---

### **3. CONFIGURE BUILD SETTINGS**

**For EACH project, use these EXACT settings:**

#### **Project 1: vertikalapp** (Main Site)
- **Project name:** `vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None** (or leave blank)
- **Build command:** (leave blank)
- **Build output directory:** (leave blank - serves from root)
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### **Project 2: creators-vertikalapp** (Creators Subdomain)
- **Project name:** `creators-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/creators` (IMPORTANT: This is the output directory)
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### **Project 3: investors-vertikalapp** (Investors Subdomain)
- **Project name:** `investors-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/investors` (IMPORTANT: This is the output directory)
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### **Project 4: networks-vertikalapp** (Networks Subdomain)
- **Project name:** `networks-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/networks` (IMPORTANT: This is the output directory)
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

#### **Project 5: beta-vertikalapp** (Beta Subdomain)
- **Project name:** `beta-vertikalapp`
- **Production branch:** `main`
- **Framework preset:** Select **None**
- **Build command:** (leave blank)
- **Build output directory:** `public/beta` (IMPORTANT: This is the output directory)
- **Root directory:** (leave blank)

**Click:** **Save and Deploy**

---

### **4. HANDLE EXISTING PROJECTS**

**If project name already exists:**

**Option A: Delete and Recreate (Recommended)**
1. Go to existing project → **Settings** → Scroll to bottom
2. Click **Delete project** → Confirm deletion
3. Follow steps 1-3 above to create new Git-connected project

**Option B: Rename and Recreate**
1. Go to existing project → **Settings** → **Project name**
2. Rename to `vertikalapp-old` (or similar)
3. Detach custom domains (Settings → Custom domains → Remove)
4. Create new project with correct name (steps 1-3)
5. Attach domains to new project (see step 5)
6. Delete old project after verification

---

### **5. ATTACH CUSTOM DOMAINS**

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
- CNAME record: `creators` → `creators-vertikalapp.pages.dev` (or similar)
- DNS status: **DNS only** or **Proxied** (both work)
- Propagation: Usually instant if DNS is already in Cloudflare

---

### **6. VERIFY GIT CONNECTION**

**For EACH project:**

**Click Path:**
1. Open project → **Deployments** tab
2. Check latest deployment:
   - Should show **Git commit hash** (e.g., `3c36b21`)
   - Should show **Branch:** `main`
   - Should show **Status:** Green checkmark (Success)
3. Click deployment → Should show commit message: `chore: deploy lockdown sync...`
4. Verify **Source:** Shows GitHub icon + commit hash

**If deployment shows "Manual" or no Git info:**
- Project is NOT Git-connected → Delete and recreate (steps 1-4)

---

### **7. VERIFY BUILD OUTPUT**

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

## TROUBLESHOOTING

### **"No Git connection" in project settings:**
- **Solution:** Delete project and recreate with Git connection (steps 1-3)

### **Build fails:**
- **Check:** Build output directory is correct (blank for main, `public/{subdomain}` for subdomains)
- **Check:** No build command needed (leave blank)
- **Check:** Framework preset is "None"

### **Domain not activating:**
- **Check:** DNS CNAME exists and points to Pages subdomain
- **Check:** DNS is in Cloudflare (not external)
- **Wait:** 1-2 minutes for propagation

### **Wrong files served:**
- **Check:** Build output directory matches surface path exactly
- **Check:** `_redirects` file exists in `public/` (for main site only)

---

## QUICK REFERENCE: PROJECT SETTINGS TABLE

| Project Name | Output Directory | Custom Domain |
|-------------|------------------|---------------|
| vertikalapp | (blank) | vertikalapp.com |
| creators-vertikalapp | public/creators | creators.vertikalapp.com |
| investors-vertikalapp | public/investors | investors.vertikalapp.com |
| networks-vertikalapp | public/networks | networks.vertikalapp.com |
| beta-vertikalapp | public/beta | beta.vertikalapp.com |

---

**END OF INSTRUCTIONS**

