# 🚀 Cloudflare Pages Setup — Complete Guide

**Date:** December 29, 2024  
**Goal:** Make GitHub the ONLY deploy source, connect Cloudflare Pages, remove Netlify dependency

---

## ✅ STEP 1 — VERIFY REPO STRUCTURE

**Current Structure (Should Match):**
```
public/                    → vertikalapp.com
public/investors/          → investors.vertikalapp.com
public/creators/           → creators.vertikalapp.com
public/networks/           → networks.vertikalapp.com
```

**Future Additions:**
```
public/demo/               → demo.vertikalapp.com
public/beta/               → beta.vertikalapp.com
public/cto/                → cto.vertikalapp.com
public/kel/                → kel.vertikalapp.com
```

**Rule:** Never deploy from Downloads again. Everything ships from repo's `main` branch.

---

## ✅ STEP 2 — CONNECT CLOUDFLARE PAGES TO GITHUB

**For Each Subdomain, Create a Pages Project:**

### **Main Site (vertikalapp.com)**

1. **Cloudflare Dashboard → Pages → Create a project**
2. **Connect to Git → Select:** `AlphaJRR/vertikal`
3. **Configure:**
   - **Project name:** `vertikalapp`
   - **Production branch:** `main`
   - **Framework preset:** `None` (pure HTML/CSS/JS)
   - **Build command:** (leave blank)
   - **Build output directory:** `public`

### **Investors Site (investors.vertikalapp.com)**

1. **Cloudflare Dashboard → Pages → Create a project**
2. **Connect to Git → Select:** `AlphaJRR/vertikal`
3. **Configure:**
   - **Project name:** `investors-vertikalapp`
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** (leave blank)
   - **Build output directory:** `public/investors`

### **Creators Site (creators.vertikalapp.com)**

1. **Cloudflare Dashboard → Pages → Create a project**
2. **Connect to Git → Select:** `AlphaJRR/vertikal`
3. **Configure:**
   - **Project name:** `creators-vertikalapp`
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** (leave blank)
   - **Build output directory:** `public/creators`

### **Networks Site (networks.vertikalapp.com)**

1. **Cloudflare Dashboard → Pages → Create a project**
2. **Connect to Git → Select:** `AlphaJRR/vertikal`
3. **Configure:**
   - **Project name:** `networks-vertikalapp`
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** (leave blank)
   - **Build output directory:** `public/networks`

**✅ This makes Cloudflare rebuild automatically every time you push to `main`.**

---

## ✅ STEP 3 — ATTACH CUSTOM DOMAINS

**For Each Pages Project:**

### **Main Site:**
- Cloudflare Pages → `vertikalapp` → Custom domains → Add:
  - `vertikalapp.com`
  - `www.vertikalapp.com` (optional)

### **Investors Site:**
- Cloudflare Pages → `investors-vertikalapp` → Custom domains → Add:
  - `investors.vertikalapp.com`

### **Creators Site:**
- Cloudflare Pages → `creators-vertikalapp` → Custom domains → Add:
  - `creators.vertikalapp.com`

### **Networks Site:**
- Cloudflare Pages → `networks-vertikalapp` → Custom domains → Add:
  - `networks.vertikalapp.com`

**Note:** Cloudflare will create/validate DNS records automatically if your domain is on Cloudflare.

---

## ✅ STEP 4 — FIX GIT PUSH AUTHENTICATION

**Current Remote:** Check output of `git remote -v`

### **OPTION A: HTTPS Remote (https://github.com/...)**

**Fix with Personal Access Token:**

1. **Create PAT:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token (classic)"**
   - Name: `Vertikal Push`
   - Scopes: Check `repo` (full control)
   - Click **"Generate token"**
   - **Copy the token** (you won't see it again)

2. **Configure Git Credential Helper:**
   ```bash
   cd /Users/alphavisualartists/Vertikal-App
   git config --global credential.helper osxkeychain
   ```

3. **Push (will prompt for credentials):**
   ```bash
   git push origin main
   ```
   - Username: `AlphaJRR`
   - Password: **Paste the token** (not your GitHub password)

4. **Verify:**
   ```bash
   git push origin main
   ```
   Should push without prompting (credentials saved in keychain)

---

### **OPTION B: SSH Remote (git@github.com:...)**

**Fix with SSH Key:**

1. **Check if SSH key exists:**
   ```bash
   ls -la ~/.ssh/id_rsa.pub
   ```

2. **If no key, generate:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter for default location
   # Press Enter for no passphrase (or set one)
   ```

3. **Add key to GitHub:**
   - Copy key: `cat ~/.ssh/id_rsa.pub`
   - Go to: https://github.com/settings/keys
   - Click **"New SSH key"**
   - Title: `Mac - Vertikal`
   - Paste key → Click **"Add SSH key"**

4. **Test connection:**
   ```bash
   ssh -T git@github.com
   ```
   Should say: "Hi AlphaJRR! You've successfully authenticated..."

5. **Push:**
   ```bash
   git push origin main
   ```
   Should work without prompting

---

### **OPTION C: GitHub Desktop (Fastest)**

1. **Open GitHub Desktop**
2. **Sign in** (if not already)
3. **Click "Push origin"** button
4. ✅ Done - All commits push automatically

**This is the fastest option if you just want to push now.**

---

## ✅ STEP 5 — VERIFY AUTO-DEPLOY IS WORKING

**After pushing to `main`:**

1. **Check Cloudflare Deployments:**
   - Cloudflare → Pages → `vertikalapp` → Deployments
   - Should see new deploy with latest commit message/time
   - Repeat for all 4 projects

2. **Verify Live Sites:**
   - `vertikalapp.com` → Should show latest changes
   - `investors.vertikalapp.com` → Should show latest changes
   - `creators.vertikalapp.com` → Should show latest changes
   - `networks.vertikalapp.com` → Should show latest changes

3. **Check SSL:**
   - All sites should show lock icon (SSL issued)
   - Cloudflare auto-provisions SSL certificates

---

## ✅ STEP 6 — DELETE NETLIFY (ONLY AFTER VERIFICATION)

**Delete Netlify once ALL are true:**

- ✅ Cloudflare custom domains are active
- ✅ SSL issued (lock icon on all sites)
- ✅ Pages deployments succeed
- ✅ You confirmed the main flows work
- ✅ All 4 sites are live and working

**Steps:**
1. Go to: https://app.netlify.com/teams/[your-team]/sites
2. For each site, click **"Site settings" → "General" → "Delete site"**
3. Confirm deletion

**Note:** Keep Netlify until Cloudflare is 100% verified working.

---

## ✅ STEP 7 — CLEAN UP DOWNLOADS FOLDER

**Stop the Downloads landfill:**

1. **Create archive folder:**
   ```bash
   mkdir -p ~/Projects/Vertikal-Deploy
   ```

2. **Move or delete old deployment zips:**
   ```bash
   # Move to archive
   mv ~/Downloads/*CLOUDFLARE*.zip ~/Projects/Vertikal-Deploy/ 2>/dev/null
   mv ~/Downloads/*vertikal*.zip ~/Projects/Vertikal-Deploy/ 2>/dev/null
   
   # Or delete if no longer needed
   rm ~/Downloads/*CLOUDFLARE*.zip 2>/dev/null
   rm ~/Downloads/*vertikal*.zip 2>/dev/null
   ```

3. **Verify:**
   ```bash
   ls ~/Downloads/*vertikal*.zip 2>/dev/null || echo "✅ No Vertikal zips in Downloads"
   ```

**Rule:** All deployments now come from GitHub. No more manual uploads.

---

## 📋 CHECKLIST

### **Setup:**
- [ ] Verify repo structure (`public/`, `public/investors/`, etc.)
- [ ] Create 4 Cloudflare Pages projects (connected to GitHub)
- [ ] Configure build output directories correctly
- [ ] Attach custom domains to each project
- [ ] Fix Git push authentication (PAT or SSH)
- [ ] Push to `main` and verify auto-deploy works
- [ ] Verify all 4 sites are live with SSL
- [ ] Delete Netlify sites (after verification)
- [ ] Clean up Downloads folder

### **Verification:**
- [ ] Cloudflare shows new deployments after each push
- [ ] All sites load correctly
- [ ] SSL certificates issued (lock icon)
- [ ] Forms submit correctly
- [ ] No broken links
- [ ] GitHub Actions workflow still works (if using)

---

## 🎯 SUCCESS CRITERIA

**Setup is complete when:**
- ✅ All 4 sites deploy automatically from GitHub `main`
- ✅ No manual uploads needed
- ✅ Cloudflare is the only hosting provider
- ✅ Git push works without authentication issues
- ✅ Downloads folder cleaned up

---

**Status:** ⏳ **READY TO EXECUTE**  
**Next:** Check `git remote -v` → Fix authentication → Push → Verify → Clean up

