# 🚀 DEPLOY EDGE FUNCTION NOW — COPY-PASTE GUIDE

**Status:** Ready to Execute  
**Time:** ~5 minutes  
**Difficulty:** Easy

---

## ✅ PRE-FLIGHT CHECKLIST

- [ ] You have access to Supabase Dashboard
- [ ] You have your Service Role Key (Settings → API)
- [ ] You have your Zapier Webhook URL (if using Zapier)

---

## 🎯 METHOD 1: SUPABASE DASHBOARD (RECOMMENDED — 3 MINUTES)

### Step 1: Open Supabase Dashboard

```
https://supabase.com/dashboard/project/vuwawtzhhcarckybdgbd/functions
```

### Step 2: Create New Function

1. Click **"Create Function"** or **"New Function"**
2. Function Name: `signup`
3. Click **"Create Function"**

### Step 3: Copy-Paste Code

**Copy this entire code block:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const body = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // HARD CAP — FOUNDING 50
    const { count } = await supabase
      .from("auth.users")
      .select("*", { count: "exact", head: true });

    if (count && count >= 50) {
      return new Response(
        JSON.stringify({ error: "Founding 50 is full" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // UNIQUE REFERRAL CODE
    const referral = crypto.randomUUID().slice(0, 8).toUpperCase();

    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: false,
      user_metadata: {
        first_name: body.firstName,
        last_name: body.lastName,
        username: body.username,
        referral_code: referral,
        referred_by: body.referralCode || null,
        role: "creator",
      },
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // ZAPIER LOG
    const zapierUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    if (zapierUrl) {
      try {
        await fetch(zapierUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: body.email,
            user_id: data.user.id,
            role: "creator",
            referral_code: referral,
            source: "creators.vertikalapp.com",
          }),
        });
      } catch (zapierError) {
        // Log but don't fail signup if Zapier is down
        console.error("Zapier error:", zapierError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, referral }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
```

4. **Paste** into the code editor
5. Click **"Save"**

### Step 4: Set Environment Variables

1. Click **"Settings"** or **"Environment Variables"** tab
2. Click **"Add Variable"** for each:

**Variable 1:**
- Name: `SUPABASE_URL`
- Value: `https://vuwawtzhhcarckybdgbd.supabase.co`
- Click **"Save"**

**Variable 2:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `<paste-your-service-role-key-here>`
- **How to get:** Dashboard → Settings → API → Copy "service_role" key (NOT anon key)
- Click **"Save"**

**Variable 3 (Optional — if using Zapier):**
- Name: `ZAPIER_WEBHOOK_URL`
- Value: `<paste-your-zapier-webhook-url-here>`
- Click **"Save"**

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for deployment (usually 10-30 seconds)
3. You'll see: **"Function deployed successfully"**

### Step 6: Get Function URL

1. After deployment, copy the **Function URL**
2. It will look like: `https://vuwawtzhhcarckybdgbd.supabase.co/functions/v1/signup`
3. **Verify** this matches the URL in `public/creators/index.html`:
   ```javascript
   const EDGE_FUNCTION_URL = 'https://vuwawtzhhcarckybdgbd.supabase.co/functions/v1/signup';
   ```

---

## 🎯 METHOD 2: SUPABASE CLI (5 MINUTES)

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login

```bash
supabase login
```

(This opens browser for authentication)

### Step 3: Link Project

```bash
cd /Users/alphavisualartists/Vertikal-App
supabase link --project-ref vuwawtzhhcarckybdgbd
```

### Step 4: Set Environment Variables

```bash
# Set in Supabase Dashboard → Edge Functions → Settings
# OR use CLI:
supabase secrets set SUPABASE_URL=https://vuwawtzhhcarckybdgbd.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
supabase secrets set ZAPIER_WEBHOOK_URL=<your-zapier-webhook-url>
```

### Step 5: Deploy

```bash
supabase functions deploy signup
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

After deployment, verify:

- [ ] Function URL is accessible
- [ ] Test signup form works
- [ ] Referral code appears in success screen
- [ ] Email confirmation sent
- [ ] Zapier webhook received (if configured)
- [ ] Founding 50 cap enforced (test with 51st signup)

---

## 🧪 TEST THE FUNCTION

### Test via curl:

```bash
curl -X POST https://vuwawtzhhcarckybdgbd.supabase.co/functions/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "firstName": "Test",
    "lastName": "User",
    "username": "testuser"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "referral": "ABC12345"
}
```

---

## 🚨 TROUBLESHOOTING

### Function returns 404
- Check function name matches: `signup`
- Verify function is deployed: Dashboard → Edge Functions → See "signup" listed

### CORS Error
- Function already includes CORS headers
- Verify request origin matches allowed origins

### "Founding 50 is full" error
- This is correct behavior when 50+ users exist
- To test, temporarily change `count >= 50` to `count >= 100`

### Zapier not receiving webhooks
- Check `ZAPIER_WEBHOOK_URL` is set correctly
- Test webhook URL manually with curl
- Check Zapier Zap is active

---

## 📋 QUICK REFERENCE

**Function URL:**
```
https://vuwawtzhhcarckybdgbd.supabase.co/functions/v1/signup
```

**Required Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ZAPIER_WEBHOOK_URL` (optional)

**Function Location:**
```
supabase/functions/signup/index.ts
```

---

**Generated:** $(date)  
**Status:** ✅ Ready to Deploy

