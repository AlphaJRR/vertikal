# 🔒 FINAL LOCKDOWN: CLOUDFLARE PAGES × GITHUB ACTIONS

**Status:** ✅ LOCKED  
**Date:** December 29, 2024  
**Protocol:** Non-negotiable completion sequence

---

## GOAL

End state:
- Every Pages project deploys **only** via GitHub Actions
- No Workers confusion
- No Git-connected ambiguity
- No "looks deployed but isn't"
- One source of truth, one path to prod

---

## STEP 1 — ELIMINATE ALL AMBIGUITY ✅

### 1.1 Git Connections
- ✅ All Pages projects show "No Git connection"
- ✅ **DO NOT** connect Git to Pages. Ever.
- ✅ Cloudflare Pages = API target only

### 1.2 Workers Confusion
- ✅ No `wrangler.toml` with `main =`
- ✅ No `src/index.ts` or `worker.ts`
- ✅ No Worker entry files

---

## STEP 2 — BUILD OUTPUT CONTRACT ✅

**Standard:** All builds output to `dist/`

**Contract:**
- Build must create `dist/` directory
- If `dist/` doesn't exist → deployment fails
- No guessing, no alternatives

---

## STEP 3 — GOLDEN WORKFLOW ✅

**File:** `.github/workflows/cloudflare-pages.yml`

**Features:**
- Single workflow for all sites
- Hard-mapped project names
- Build verification
- Wrangler CLI deployment only

---

## STEP 4 — PROJECT NAME MAPPING (LAW) ✅

| Site Input  | Pages Project Name      |
|-------------|-------------------------|
| vertikalapp | `vertikalapp`           |
| investors   | `investors-vertikalapp` |
| creators    | `creators-vertikalapp`  |
| networks    | `networks-vertikalapp`  |
| demo        | `demo-vertikal`         |

**Enforcement:** If project name doesn't match exactly → deployment fails on purpose.

---

## STEP 5 — SECRETS (FAIL CLOSED) ✅

**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN` (Pages: Edit + Deploy)
- `CLOUDFLARE_ACCOUNT_ID`

**Behavior:**
- Missing token = job fails
- Wrong token = job fails
- No silent "success"

---

## STEP 6 — EXECUTION SEQUENCE

1. ✅ Push workflow to GitHub
2. GitHub → Actions → **Run workflow**
3. Choose site: `vertikalapp`
4. Watch logs until:
   - Build completes
   - `dist verified`
   - `wrangler pages deploy` uploads files
5. Open Pages URL
6. Hard refresh

**Success Criteria:**
- ✅ Workflow runs clean
- ✅ Pages site renders correct UI
- ✅ Deploy log shows file upload counts
- ✅ URL matches expected content

---

## VERIFICATION SCRIPT

Run before deployment:
```bash
./verify-deployment.sh
```

Checks:
- ✅ Secrets set
- ✅ Build output exists (`dist/`)
- ✅ Projects exist in Cloudflare
- ✅ Wrangler available

---

## WHY THIS ENDS THE LOOP

- ❌ No Workers path exists
- ❌ No Git-connected Pages ambiguity
- ❌ No dynamic project name logic
- ❌ No build output guessing
- ❌ No "it deployed but didn't" state

**This is infrastructure discipline, not hope.**

---

**Status:** ✅ PROTOCOL LOCKED  
**Next:** Execute workflow and verify

