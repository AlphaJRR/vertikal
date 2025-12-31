# VERTIKAL Route Remediation Checklist

**Date:** December 30, 2024  
**Status:** ✅ VERIFICATION CHECKLIST  
**Purpose:** Ensure all DNS routes and Cloudflare Pages custom domains are correctly configured

---

## 1. DNS CONFIGURATION

### DNS Records Table

| Type | Name | Content | Proxy Status | Purpose |
|------|------|---------|--------------|---------|
| CNAME | @ | vertikalapp.pages.dev | ✅ Proxied | Main domain |
| CNAME | creators | creators-vertikalapp.pages.dev | ✅ Proxied | Creators subdomain |
| CNAME | investors | investors-vertikalapp.pages.dev | ✅ Proxied | Investors subdomain |
| CNAME | networks | networks-vertikalapp.pages.dev | ✅ Proxied | Networks subdomain |
| CNAME | beta | beta-vertikalapp.pages.dev | ✅ Proxied | Beta subdomain |
| CNAME | demo | demo-vertikalapp.pages.dev | ✅ Proxied | Demo subdomain |

**Verification Steps:**
1. Go to: Cloudflare Dashboard → DNS → Records
2. Verify each CNAME record exists with exact Name and Content values above
3. Verify all records show "Proxied" status (orange cloud icon)
4. Verify no conflicting A or CNAME records exist

---

### www.vertikalapp.com

**Expected Behavior:** One of the following configurations must be implemented:

#### Option A: CNAME Record (Recommended)
- **Type:** CNAME
- **Name:** www
- **Content:** vertikalapp.com
- **Proxy Status:** ✅ Proxied
- **Result:** www.vertikalapp.com resolves to vertikalapp.com

#### Option B: Cloudflare Redirect Rule (Alternative)
- **Rule Type:** Redirect
- **Source URL:** `www.vertikalapp.com/*`
- **Destination URL:** `https://vertikalapp.com/$1`
- **Status Code:** 301 (Permanent Redirect)
- **Result:** www.vertikalapp.com redirects to vertikalapp.com

**Verification Steps:**
- [ ] If Option A: Verify CNAME record exists in DNS table
- [ ] If Option B: Verify redirect rule exists in Rules → Redirects
- [ ] Test: `curl -I https://www.vertikalapp.com` → Should return 200 (Option A) or 301 (Option B)
- [ ] Test: Browser visit to `https://www.vertikalapp.com` → Should load or redirect correctly

---

## 2. CLOUDFLARE PAGES CUSTOM DOMAIN VERIFICATION

### investors.vertikalapp.com

**Pages Project:** `investors-vertikalapp`

**Verification Steps:**
1. Go to: Cloudflare Dashboard → Workers & Pages → `investors-vertikalapp`
2. Click: **Custom domains** tab
3. Verify: `investors.vertikalapp.com` is listed
4. Verify: Status shows **Active** (green checkmark)
5. Verify: SSL/TLS status shows "Full (strict)"
6. Verify: DNS record shows `CNAME investors → investors-vertikalapp.pages.dev` (Proxied)

**Pass Criteria:**
- [ ] Custom domains tab accessible
- [ ] Domain `investors.vertikalapp.com` listed
- [ ] Status = Active (green)
- [ ] SSL/TLS = Full (strict)
- [ ] DNS CNAME verified in DNS records

---

### networks.vertikalapp.com

**Pages Project:** `networks-vertikalapp`

**Verification Steps:**
1. Go to: Cloudflare Dashboard → Workers & Pages → `networks-vertikalapp`
2. Click: **Custom domains** tab
3. Verify: `networks.vertikalapp.com` is listed
4. Verify: Status shows **Active** (green checkmark)
5. Verify: SSL/TLS status shows "Full (strict)"
6. Verify: DNS record shows `CNAME networks → networks-vertikalapp.pages.dev` (Proxied)

**Pass Criteria:**
- [ ] Custom domains tab accessible
- [ ] Domain `networks.vertikalapp.com` listed
- [ ] Status = Active (green)
- [ ] SSL/TLS = Full (strict)
- [ ] DNS CNAME verified in DNS records

---

### Additional Custom Domain Verifications

#### vertikalapp.com
- [ ] Pages Project: `vertikalapp`
- [ ] Custom domains tab: `vertikalapp.com` listed
- [ ] Status = Active (green)

#### creators.vertikalapp.com
- [ ] Pages Project: `creators-vertikalapp`
- [ ] Custom domains tab: `creators.vertikalapp.com` listed
- [ ] Status = Active (green)

#### beta.vertikalapp.com
- [ ] Pages Project: `beta-vertikalapp`
- [ ] Custom domains tab: `beta.vertikalapp.com` listed
- [ ] Status = Active (green)

#### demo.vertikalapp.com
- [ ] Pages Project: `demo-vertikalapp` (if exists)
- [ ] Custom domains tab: `demo.vertikalapp.com` listed
- [ ] Status = Active (green)

---

## 3. DNS VERIFICATION COMMANDS

```bash
# Test all domains
curl -I https://vertikalapp.com
curl -I https://www.vertikalapp.com
curl -I https://creators.vertikalapp.com
curl -I https://investors.vertikalapp.com
curl -I https://networks.vertikalapp.com
curl -I https://beta.vertikalapp.com
curl -I https://demo.vertikalapp.com

# Expected: HTTP/2 200 for all (or 301 for www if redirect rule)
```

**Pass Criteria:**
- [ ] All domains return HTTP 200 (or 301 for www redirect)
- [ ] No 404 or connection errors
- [ ] SSL certificates valid (no certificate errors)

---

## 4. PASS CRITERIA SUMMARY

### DNS Configuration
- [ ] All 6 CNAME records exist (including demo with Name: demo)
- [ ] www.vertikalapp.com configured (CNAME or redirect rule)
- [ ] All records show "Proxied" status
- [ ] No conflicting DNS records

### Cloudflare Pages Custom Domains
- [ ] investors.vertikalapp.com → investors-vertikalapp project
  - [ ] Custom domains tab accessible
  - [ ] Domain listed
  - [ ] Status = Active (green)
- [ ] networks.vertikalapp.com → networks-vertikalapp project
  - [ ] Custom domains tab accessible
  - [ ] Domain listed
  - [ ] Status = Active (green)
- [ ] All other domains verified (vertikalapp.com, creators, beta, demo)

### Functional Verification
- [ ] All domains resolve correctly via curl
- [ ] All domains load correctly in browser
- [ ] SSL certificates valid
- [ ] No routing errors

---

## 5. TROUBLESHOOTING

### If DNS Record Missing:
1. Go to: Cloudflare Dashboard → DNS → Records
2. Click: "Add record"
3. Select: CNAME
4. Enter: Name and Content from table above
5. Enable: Proxy (orange cloud)
6. Click: Save

### If Custom Domain Not Active:
1. Go to: Cloudflare Dashboard → Workers & Pages → [Project Name]
2. Click: Custom domains tab
3. Click: "Set up a custom domain"
4. Enter: Domain name
5. Follow: DNS verification prompts
6. Wait: 2-3 minutes for DNS propagation
7. Verify: Status changes to Active

### If www Redirect Not Working:
- **Option A (CNAME):** Verify CNAME record exists: `www → vertikalapp.com` (Proxied)
- **Option B (Redirect Rule):** Verify redirect rule exists in Rules → Redirects
- Test: `curl -I https://www.vertikalapp.com` to see response

---

**Status:** ✅ **CHECKLIST COMPLETE**

**Last Updated:** December 30, 2024

