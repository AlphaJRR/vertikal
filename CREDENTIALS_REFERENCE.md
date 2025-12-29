# 🔐 CREDENTIALS REFERENCE

**Status:** CONFIDENTIAL  
**Effective Date:** December 15, 2024  
**Security Level:** HIGH — Do not commit to public repositories

---

## ⚠️ SECURITY WARNING

**NEVER commit actual credentials to Git.**  
**Always use environment variables (`.env` files) in production.**  
**This document is for reference only — actual values should be stored securely.**

---

## SUPABASE (VERTIKAL)

### **Project Configuration**

**Project URL:**
```
https://vuwawtzhhcarckybdgbd.supabase.co
```

**Publishable Key (Anon Key):**
```
sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y
```

**Usage:**
- Frontend client initialization
- Public API access
- Row Level Security (RLS) policies apply

**Security Notes:**
- ✅ This is a publishable key (safe for client-side)
- ✅ RLS policies enforce access control
- ✅ Never expose service role key

---

## NETLIFY PROJECTS

### **Project Mappings**

| Project Name | Domain | Purpose |
|--------------|--------|---------|
| `creatorvertikal` | `creators.vertikalapp.com` | Creator-facing site |
| `publicvertikalapp` | `vertikalapp.com` | Main public site |
| `investorsvertikal` | `investors.vertikalapp.com` | Investor portal |
| `demovertikalapp` | `demo.vertikalapp.com` | Demo/staging site |

**Deployment Notes:**
- Each project has separate build settings
- Environment variables configured per project
- Deployments tracked independently

---

## 🔒 BEST PRACTICES

### **Environment Variables**

**Always use `.env` files:**
```bash
# .env.local (never commit)
SUPABASE_URL=https://vuwawtzhhcarckybdgbd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y
```

**Add to `.gitignore`:**
```
.env
.env.local
.env.*.local
```

### **Access Management**

1. ✅ Use publishable keys in frontend
2. ✅ Store service role keys server-side only
3. ✅ Rotate keys if exposed
4. ✅ Use RLS policies for data access
5. ✅ Monitor access logs regularly

---

## 📋 QUICK REFERENCE

### **Supabase Client Setup:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### **Netlify Deployment:**
- Each project deploys independently
- Check project-specific environment variables
- Verify domain configuration per project

---

## 🚨 SECURITY CHECKLIST

Before deploying or sharing:

- [ ] No credentials in code files
- [ ] All secrets in environment variables
- [ ] `.env` files in `.gitignore`
- [ ] RLS policies configured
- [ ] Access logs monitored
- [ ] Keys rotated if exposed

---

**Generated:** December 15, 2024  
**Status:** CONFIDENTIAL — Reference Only  
**Note:** Actual credentials should be stored in secure environment variables, not in this document.

