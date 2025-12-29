# 🚀 Deploy and Verify Script — Setup Guide

## Quick Start

### 1. Set Environment Variables

**⚠️ IMPORTANT: Do NOT paste secrets into chat. Set them locally:**

```bash
export GITHUB_USER="AlphaJRR"
export GITHUB_REPO="AlphaJRR/vertikal"
export BRANCH="main"
export GITHUB_PAT="YOUR_GITHUB_PAT"        # PAT with repo + workflow scopes
export WORKFLOW_FILE="cloudflare-advanced-deploy.yml"
# Optional: verification targets (defaults shown)
export TARGETS="https://vertikalapp.com https://investors.vertikalapp.com https://creators.vertikalapp.com https://networks.vertikalapp.com"
```

### 2. Run the Script

```bash
bash deploy-and-verify.sh
```

Or make it executable and run directly:

```bash
chmod +x deploy-and-verify.sh
./deploy-and-verify.sh
```

---

## What the Script Does

1. **Push** local `main` branch to GitHub using PAT
2. **Trigger** Advanced Cloudflare Deploy workflow via GitHub Actions dispatch
3. **Poll** workflow run until completion (success or failure)
4. **Verify** all four sites with smoke checks and report results

---

## Prerequisites

- `curl` (usually pre-installed)
- `jq` (install: `brew install jq` on Mac)
- `git` (usually pre-installed)
- GitHub PAT with `repo` and `workflow` scopes

---

## GitHub PAT Setup

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Vertikal Deploy Script`
4. Scopes: Check `repo` and `workflow`
5. Generate and copy the token
6. Set as environment variable: `export GITHUB_PAT="your_token_here"`

---

## Script Output

The script will:
- Show push progress
- Display workflow run ID and URL
- Poll status every 6 seconds
- Run smoke checks on all 4 sites
- Report pass/fail summary

---

## Rollback Instructions

### Quick Revert

```bash
git revert --no-edit HEAD
git push origin main
```

### Restore Remote URL (after script runs)

The script temporarily sets the remote URL to include PAT. Restore it:

```bash
git remote set-url origin git@github.com:AlphaJRR/vertikal.git
```

Or keep HTTPS:

```bash
git remote set-url origin https://github.com/AlphaJRR/vertikal.git
```

---

## Troubleshooting

### Error: `jq: command not found`
```bash
brew install jq
```

### Error: `GITHUB_PAT is not set`
```bash
export GITHUB_PAT="your_token_here"
```

### Error: `Could not find a workflow run`
- Check workflow file name matches: `cloudflare-advanced-deploy.yml`
- Verify PAT has `workflow` scope
- Check branch name matches: `main`

### Workflow fails
- Open the run URL printed by the script
- Inspect failing step logs
- Fix issues before reverting

---

## Next Steps

After successful deployment:
- Monitor sites manually
- Promote canary to green (if using load balancer)
- Run additional verification tests

---

**Status:** ✅ Script ready to use  
**Action:** Set `GITHUB_PAT` and run `./deploy-and-verify.sh`

