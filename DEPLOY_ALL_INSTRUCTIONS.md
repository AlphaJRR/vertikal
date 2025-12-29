# 🚀 DEPLOY ALL SUBDOMAINS — COMPLETE GUIDE

**Date:** December 29, 2024  
**Status:** ✅ **READY TO DEPLOY ALL SITES**

---

## 📦 DEPLOYMENT PACKAGES READY

### **1. Main Landing (vertikalapp.com)**
**Files:** `public/` folder contents
- `index.html` (OLD format restored)
- `assets/Vertikal_Logo_Master.png`
- `terms/index.html`
- `privacy/index.html`
- `_headers`
- `_redirects`

**Cloudflare Project:** `vertikalapp` (vertikalapp.pages.dev)

---

### **2. Investors Page (investors.vertikalapp.com)**
**Files:** `public/investors/` folder contents
- `index.html` (tier cards, core logo)
- `assets/investor-badge.png` (for hero section)

**Cloudflare Project:** `investors-vertikalapp` (investors-vertikalapp.pages.dev)

---

### **3. Creators Page (creators.vertikalapp.com)**
**Files:** `public/creators/` folder contents
- `index.html`
- `dashboard/index.html`
- `assets/Vertikal_Logo_Master.png`

**Cloudflare Project:** `creators-vertikalapp` (creators-vertikalapp.pages.dev)

---

### **4. Networks Page (networks.vertikalapp.com)**
**Files:** `public/networks/` folder contents
- `index.html`
- `success.html`

**Cloudflare Project:** `networks-vertikalapp` (networks-vertikalapp.pages.dev)

---

## 🚀 DEPLOYMENT STEPS (CLOUDFLARE PAGES)

### **STEP 1: Deploy Main Landing (vertikalapp.com)**

1. **Cloudflare Dashboard** → Workers & Pages → Pages → **vertikalapp**
2. **Deployments** → **Create deployment** → **Upload assets**
3. **Select folder:** `public/` (the entire public folder)
4. **Wait for:** "Production: Completed"
5. **Verify:** https://vertikalapp.com shows "STOP ROTATING YOUR PHONE"

---

### **STEP 2: Deploy Investors Page (investors.vertikalapp.com)**

1. **Cloudflare Dashboard** → Pages → **investors-vertikalapp**
2. **Deployments** → **Create deployment** → **Upload assets**
3. **Select folder:** `public/investors/` (only the investors folder contents)
4. **Wait for:** "Production: Completed"
5. **Verify:** https://investors.vertikalapp.com shows tier cards

---

### **STEP 3: Deploy Creators Page (creators.vertikalapp.com)**

1. **Cloudflare Dashboard** → Pages → **creators-vertikalapp**
2. **Deployments** → **Create deployment** → **Upload assets**
3. **Select folder:** `public/creators/` (only the creators folder contents)
4. **Wait for:** "Production: Completed"
5. **Verify:** https://creators.vertikalapp.com loads correctly

---

### **STEP 4: Deploy Networks Page (networks.vertikalapp.com)**

1. **Cloudflare Dashboard** → Pages → **networks-vertikalapp**
2. **Deployments** → **Create deployment** → **Upload assets**
3. **Select folder:** `public/networks/` (only the networks folder contents)
4. **Wait for:** "Production: Completed"
5. **Verify:** https://networks.vertikalapp.com loads correctly

---

## ⚙️ CLOUDFLARE PAGES SETTINGS (VERIFY FOR EACH PROJECT)

**For each Pages project, verify:**

| Setting | Value |
|---------|-------|
| **Root directory** | (leave blank OR set to folder name if using Git) |
| **Build command** | (blank / empty) |
| **Build output directory** | `.` (dot) |
| **Framework preset** | None (or Static) |

**Important:** If using Direct Upload, these settings don't matter — just upload the folder contents.

---

## ✅ POST-DEPLOY VERIFICATION CHECKLIST

### **Main Landing (vertikalapp.com)**
- [ ] Hero shows "STOP ROTATING YOUR PHONE"
- [ ] Logo is purple-blue gradient (NOT gold badge)
- [ ] "CLAIM YOUR SPOT" opens modal
- [ ] Viewer form works → Success screen
- [ ] Creator form works → Redirects to dashboard
- [ ] Terms link works (`/terms`)
- [ ] Privacy link works (`/privacy`)

### **Investors Page (investors.vertikalapp.com)**
- [ ] Header logo = Core Vertikal logo
- [ ] Badge appears in hero (allowed)
- [ ] Tier cards display (Founding/Strategic/Lead)
- [ ] Form submits → Magic link sent
- [ ] Success screen displays

### **Creators Page (creators.vertikalapp.com)**
- [ ] Page loads correctly
- [ ] Logo is correct
- [ ] Links work

### **Networks Page (networks.vertikalapp.com)**
- [ ] Page loads correctly
- [ ] Form works
- [ ] Success page works

---

## 🎯 QUICK DEPLOY (ALL AT ONCE)

**If you want to deploy everything in one go:**

1. **Open Cloudflare Dashboard** → Workers & Pages → Pages
2. **For each project** (vertikalapp, investors-vertikalapp, creators-vertikalapp, networks-vertikalapp):
   - Click project name
   - Deployments → Create deployment → Upload assets
   - Upload the corresponding folder from `public/`
   - Wait for completion
3. **Verify all sites** after deployments complete

**Total time:** ~10-15 minutes for all 4 sites

---

## 📋 FILE STRUCTURE REFERENCE

```
public/
├── index.html              → vertikalapp.com
├── assets/
│   └── Vertikal_Logo_Master.png
├── terms/
│   └── index.html
├── privacy/
│   └── index.html
├── _headers
├── _redirects
├── investors/
│   ├── index.html         → investors.vertikalapp.com
│   └── assets/
├── creators/
│   ├── index.html         → creators.vertikalapp.com
│   ├── dashboard/
│   │   └── index.html
│   └── assets/
└── networks/
    ├── index.html         → networks.vertikalapp.com
    └── success.html
```

---

## 🚨 TROUBLESHOOTING

### **If deployment fails:**
- Check Build command is blank
- Check Output directory is `.` (dot)
- Check Root directory matches folder structure

### **If wrong content shows:**
- Verify you uploaded the correct folder
- Check custom domain is attached to correct project
- Clear Cloudflare cache

### **If links break:**
- Verify Terms/Privacy folders exist
- Check `_redirects` file is uploaded
- Verify asset paths are correct

---

**Status:** ✅ **READY TO DEPLOY ALL**  
**Action:** Deploy each subdomain to its Cloudflare Pages project  
**Expected Time:** 10-15 minutes total

