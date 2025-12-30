# ⚡ EVAN QUICK START CHECKLIST

**One-page reference for immediate setup**

---

## 🔐 ACCESS REQUIRED

- [ ] **GitHub:** Added as Admin to `AlphaJRR/vertikal`
- [ ] **Cloudflare:** Added to account, access to all 5 Pages projects
- [ ] **Supabase:** Added as team member, Admin access
- [ ] **Expo:** Added to `vertikalapp` organization

---

## 🚀 FIRST TIME SETUP

```bash
# 1. Clone repo
git clone https://github.com/AlphaJRR/vertikal.git
cd vertikal

# 2. Install dependencies
npm install

# 3. Create .env file (ask for template)
cp .env.example .env
# Edit .env with actual values

# 4. Verify access
# - GitHub: https://github.com/AlphaJRR/vertikal
# - Cloudflare: https://dash.cloudflare.com
# - Supabase: https://supabase.com/dashboard
# - Expo: https://expo.dev/accounts/vertikalapp
```

---

## 📋 DEPLOYMENT WORKFLOW

### **Automatic (Recommended)**
```bash
# 1. Make changes
git add -A
git commit -m "Your changes"
git push origin main

# 2. GitHub Actions auto-deploys (2-5 min)
# Monitor: https://github.com/AlphaJRR/vertikal/actions
```

### **Manual (If Auto Fails)**
```bash
# Install Wrangler
npm install -g wrangler

# Set token
export CLOUDFLARE_API_TOKEN="your-token"

# Deploy
cd public
wrangler pages deploy . --project-name=vertikalapp
```

---

## ✅ VERIFICATION CHECKLIST

After every deployment:

- [ ] GitHub Actions: All 5 jobs succeeded
- [ ] Cloudflare: Shows "3+ files uploaded" (not "1 file")
- [ ] Custom domains: Show "Active" status
- [ ] Live sites: Test in incognito mode
- [ ] Badge segregation: Correct badges on each page

**Test URLs:**
- `https://vertikalapp.com`
- `https://creators.vertikalapp.com`
- `https://investors.vertikalapp.com`
- `https://networks.vertikalapp.com`
- `https://beta.vertikalapp.com`

---

## 🐛 QUICK FIXES

**"1 file uploaded" issue:**
→ Manually upload via Cloudflare Dashboard

**404 on custom domain:**
→ Check DNS, verify domain is "Active"

**GitHub Actions fails:**
→ Verify secrets: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`

**Wrong badges showing:**
→ Check `COMMANDER_GOVERNANCE_PROMPT.md` rules

---

## 📚 KEY DOCUMENTS

- **Full Handover:** `TECH_HANDOVER_EVAN.md`
- **Brand Rules:** `COMMANDER_GOVERNANCE_PROMPT.md`
- **Pre-Deploy:** `DEPLOY_KILL_SWITCH.md`
- **Status:** `COMPLETE_FINAL.md`

---

## 🆘 EMERGENCY CONTACTS

- **GitHub Actions:** https://github.com/AlphaJRR/vertikal/actions
- **Cloudflare Support:** https://support.cloudflare.com
- **Supabase Support:** https://supabase.com/docs/support

---

**Remember:** Always run pre-deploy checklist before pushing!

