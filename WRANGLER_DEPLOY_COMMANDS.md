# 🎯 Canonical Wrangler Deploy Commands (Mode B)

**Purpose:** Direct Wrangler CLI commands for Cloudflare Pages projects with NO Git connection (Mode B)

---

## Prerequisites

```bash
# Install Wrangler
npm install -g wrangler@latest

# Set credentials
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export CLOUDFLARE_API_TOKEN="your_api_token"
```

---

## Canonical Deploy Commands

### 1. vertikalapp.com

```bash
wrangler pages deploy ./public \
  --project-name=vertikalapp \
  --branch=production \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="Deploy vertikalapp"
```

### 2. investors.vertikalapp.com

```bash
wrangler pages deploy ./public/investors \
  --project-name=investors-vertikalapp \
  --branch=production \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="Deploy investors"
```

### 3. creators.vertikalapp.com

```bash
wrangler pages deploy ./public/creators \
  --project-name=creators-vertikalapp \
  --branch=production \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="Deploy creators"
```

### 4. networks.vertikalapp.com

```bash
wrangler pages deploy ./public/networks \
  --project-name=networks-vertikalapp \
  --branch=production \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="Deploy networks"
```

### 5. demo.vertikalapp.com (if exists)

```bash
wrangler pages deploy ./public/demo \
  --project-name=demo-vertikal \
  --branch=production \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="Deploy demo"
```

---

## Critical Invariants (MUST Match 1:1)

### Project Names (Cloudflare Dashboard)
- `vertikalapp`
- `investors-vertikalapp`
- `creators-vertikalapp`
- `networks-vertikalapp`
- `demo-vertikal`

### Directory Paths (Local)
- `./public` → vertikalapp
- `./public/investors` → investors-vertikalapp
- `./public/creators` → creators-vertikalapp
- `./public/networks` → networks-vertikalapp
- `./public/demo` → demo-vertikal

### Branch Names
- Use `production` for main deployments
- Use branch name from GitHub for previews

---

## Verification Checklist

Before deploying, verify:

- [ ] Project exists in Cloudflare Dashboard
- [ ] Project shows "No Git connection" (Mode B)
- [ ] Project name matches exactly (case-sensitive)
- [ ] Directory path exists locally
- [ ] `CLOUDFLARE_API_TOKEN` has "Pages: Edit" permission
- [ ] `CLOUDFLARE_ACCOUNT_ID` is correct

---

## Troubleshooting

### Error: "Project not found"
- Verify project name matches exactly (case-sensitive)
- Check project exists in Cloudflare Dashboard
- Verify API token has access to account

### Error: "Directory not found"
- Verify directory path is correct
- Check directory exists before deploying
- Use absolute paths if relative paths fail

### Error: "Unauthorized"
- Check `CLOUDFLARE_API_TOKEN` is set
- Verify token has "Pages: Edit" permission
- Check token hasn't expired

---

**Status:** ✅ Ready to use  
**Mode:** B (API/Wrangler-only)

