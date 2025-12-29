# ✅ SUPABASE EDGE FUNCTION SETUP — PRODUCTION-SAFE SIGNUP

**Status:** Ready to Deploy  
**Security:** Server-side secrets only  
**Architecture:** Cloudflare Pages + Supabase Edge Functions

---

## 🎯 WHAT WAS DONE

### 1. **Security Fix — Removed Exposed Supabase Key**
- ❌ **REMOVED:** Supabase anon key from frontend signup
- ✅ **REPLACED:** Server-side Edge Function endpoint
- ✅ **RESULT:** No secrets in HTML

### 2. **Edge Function Created**
- **Location:** `supabase/functions/signup/index.ts`
- **Features:**
  - Founding 50 hard cap (50 users max)
  - Unique referral code generation
  - Server-side validation
  - Zapier integration
  - CORS enabled

### 3. **Frontend Updated**
- **File:** `public/creators/index.html`
- **Changes:**
  - Signup now calls Edge Function
  - No Supabase client for signup
  - Dashboard redirects fixed
  - Login still uses Supabase client (acceptable)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Set Environment Variables in Supabase

Go to: **Supabase Dashboard → Edge Functions → Settings**

Set these environment variables:

```
SUPABASE_URL=https://vuwawtzhhcarckybdgbd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ZAPIER_WEBHOOK_URL=<your-zapier-webhook-url>
```

**How to get Service Role Key:**
1. Supabase Dashboard → Settings → API
2. Copy "service_role" key (NOT anon key)
3. Keep it secret — never expose in frontend

### Step 2: Deploy Edge Function

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref vuwawtzhhcarckybdgbd

# Deploy the function
supabase functions deploy signup
```

### Step 3: Update Supabase Auth Configuration

**Go to:** Supabase Dashboard → Auth → URL Configuration

**Set Site URL:**
```
https://creators.vertikalapp.com
```

**Add Redirect URLs:**
```
https://creators.vertikalapp.com/dashboard
https://vertikalapp.com
https://investors.vertikalapp.com
```

**Go to:** Auth → Settings

- ✅ Email confirmation REQUIRED
- ✅ Rate limit ON
- ❌ Anonymous signups OFF

### Step 4: Deploy Frontend

The frontend is already updated. Deploy via:

```bash
# Push to GitHub (triggers Cloudflare Pages)
git add public/creators/index.html supabase/
git commit -m "feat: Secure signup via Edge Function"
git push origin main
```

Or manually upload to Cloudflare Pages.

---

## 🔒 SECURITY IMPROVEMENTS

| Before | After |
|--------|-------|
| ❌ Supabase key exposed in HTML | ✅ Server-side only |
| ❌ Client-side referral generation | ✅ Server-side unique codes |
| ❌ No hard cap enforcement | ✅ Founding 50 cap enforced |
| ❌ Zapier can fail silently | ✅ Zapier logging with error handling |

---

## 📋 VERIFICATION CHECKLIST

After deployment:

- [ ] Edge Function deployed successfully
- [ ] Environment variables set in Supabase
- [ ] Test signup flow works
- [ ] Referral code appears in success screen
- [ ] Zapier receives signup webhook
- [ ] Email confirmation sent
- [ ] Dashboard redirect works
- [ ] Founding 50 cap enforced (test with 51st signup)

---

## 🧪 TESTING

### Test Signup Flow

1. Go to: `https://creators.vertikalapp.com`
2. Fill out signup form
3. Submit
4. Verify:
   - Success screen shows referral code
   - Email confirmation sent
   - Zapier webhook received
   - User created in Supabase

### Test Founding 50 Cap

1. Create 50 test accounts
2. Attempt 51st signup
3. Should receive: "Founding 50 is full" error

---

## 📝 NOTES

- **Login still uses Supabase client** — This is acceptable as login doesn't create users
- **Dashboard redirects** — All updated to full URLs
- **Zapier integration** — Fails gracefully if Zapier is down
- **CORS enabled** — Edge Function accepts requests from creators.vertikalapp.com

---

## 🚨 TROUBLESHOOTING

### Edge Function returns 404
- Check function is deployed: `supabase functions list`
- Verify function name matches: `signup`

### Signup fails with CORS error
- Check CORS headers in Edge Function
- Verify request origin matches allowed origins

### Zapier not receiving webhooks
- Check `ZAPIER_WEBHOOK_URL` env var is set
- Test webhook URL manually with curl
- Check Zapier Zap is active

### Founding 50 cap not working
- Verify user count query in Edge Function
- Check Supabase auth.users table count

---

**Generated:** $(date)  
**Status:** ✅ Ready for Deployment

