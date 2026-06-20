# Supabase Email & Auth Configuration

Fix the two issues: broken confirmation links + Supabase-branded sender.

---

## 1. Fix the Site URL (stops the localhost redirect)

> Dashboard → Authentication → URL Configuration

| Setting | Value |
|---|---|
| **Site URL** | `https://alphavisualartists.com` |
| **Redirect URLs** (add all three) | `ava://**` |
| | `exp://192.168.*/**` (local dev) |
| | `https://alphavisualartists.com/**` |

This fixes the dead-link problem for any legacy password-reset or magic-link emails.
New accounts now use OTP codes (6 digits) exclusively — they have NO redirect link, so
this setting no longer blocks account creation at all.

---

## 2. Branded email sender via Resend (free tier, 100 emails/day)

### Step A — Create a Resend account
1. Go to https://resend.com → Sign up (free)
2. Add and verify your domain: `alphavisualartists.com`
3. In Resend → API Keys → Create API Key (name it "Supabase AVA")
4. Copy the key: `re_xxxxxxxxxxxxxxxx`

### Step B — Configure Supabase SMTP
> Dashboard → Project Settings → Auth → SMTP Settings → Enable custom SMTP

| Field | Value |
|---|---|
| **Host** | `smtp.resend.com` |
| **Port** | `465` |
| **Username** | `resend` |
| **Password** | *(your Resend API key: `re_xxxxxxxx`)* |
| **Sender name** | `Alpha Visual Artists` |
| **Sender email** | `noreply@alphavisualartists.com` |

### Step C — Verify
Send a test email from Supabase → Auth → Email Templates → "Send test email."
The email should arrive from `noreply@alphavisualartists.com` with sender name
"Alpha Visual Artists."

---

## 3. Custom email template (OTP code)

> Dashboard → Authentication → Email Templates → "Magic Link" → change to OTP style

Replace the default template body with something like:

```html
<h2 style="font-family:sans-serif;color:#0a0a0a">Alpha Visual Artists</h2>
<p style="font-family:sans-serif;font-size:16px">
  Your sign-in code is:
</p>
<p style="font-family:monospace;font-size:36px;font-weight:bold;letter-spacing:8px;color:#0a0a0a">
  {{ .Token }}
</p>
<p style="font-family:sans-serif;font-size:13px;color:#666">
  This code expires in 10 minutes. If you didn't request this, ignore this email.
</p>
```

---

## 4. Why account creation no longer uses confirmation links

The app now uses `signInWithOtp` + `verifyOtp` for ALL new account creation.
This sends a **6-digit code**, not a link. The user enters the code in the app —
no redirect URL, no mobile deep-link complexity. The "Site URL" setting is now
irrelevant for account creation.

Password sign-in still works for accounts that already have a password set.
Password *sign-up* has been removed from the app to eliminate this entire class of bug.

---

## Summary — what breaks without these changes

| Without fix | Symptom |
|---|---|
| Site URL = localhost | Password reset emails link to dead page |
| No custom SMTP | Emails come from `mail.app.supabase.io` (looks like spam) |
| No email template | Generic Supabase template, no AVA branding |

Account creation itself is now fixed in code (OTP path) and does NOT depend on
any of the above settings. The above settings improve password-reset UX and branding only.
