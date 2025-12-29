#!/usr/bin/env bash
set -euo pipefail

# Config (can be overridden by env)
GITHUB_USER="${GITHUB_USER:-AlphaJRR}"
GITHUB_REPO="${GITHUB_REPO:-AlphaJRR/vertikal}"
BRANCH="${BRANCH:-main}"
GITHUB_PAT="${GITHUB_PAT:-}"
WORKFLOW_FILE="${WORKFLOW_FILE:-cloudflare-advanced-deploy.yml}"
TARGETS="${TARGETS:-https://vertikalapp.com https://investors.vertikalapp.com https://creators.vertikalapp.com https://networks.vertikalapp.com}"
DISPATCH_REF="${BRANCH}"
DISPATCH_INPUTS='{"target":"all","mode":"canary","branch":"'"${BRANCH}"'"}'

if [ -z "$GITHUB_PAT" ]; then
  echo "ERROR: GITHUB_PAT is not set. Export it and re-run."
  exit 2
fi

echo "1) Pushing local commits to origin/${BRANCH}..."
# Use HTTPS push with PAT embedded in URL for non-interactive push
git remote set-url origin "https://$GITHUB_USER:$GITHUB_PAT@github.com/$GITHUB_USER/$(basename $GITHUB_REPO).git"
git fetch origin "$BRANCH" || true
git push origin "$BRANCH"
echo "Push complete."

echo
echo "2) Triggering workflow dispatch: $WORKFLOW_FILE (mode=canary, target=all, branch=$BRANCH)"
DISPATCH_URL="https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches"
curl -sS -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  "${DISPATCH_URL}" \
  -d '{"ref":"'"${DISPATCH_REF}"'","inputs":{"target":"all","mode":"canary","branch":"'"${BRANCH}"'"}}'

echo "Workflow dispatch requested. Waiting for a workflow run to appear..."

# Wait for the workflow run to start and capture run id
RUN_ID=""
ATTEMPTS=0
MAX_ATTEMPTS=40
SLEEP_SECONDS=5

while [ -z "$RUN_ID" ] && [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
  ((ATTEMPTS++))
  # List recent runs for this workflow and find the most recent run for the branch
  RUN_INFO=$(curl -sS -H "Authorization: Bearer ${GITHUB_PAT}" \
    "https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=5")
  RUN_ID=$(echo "$RUN_INFO" | jq -r --arg BR "$BRANCH" '.workflow_runs[] | select(.head_branch==$BR) | .id' | head -n1 || true)
  if [ -z "$RUN_ID" ] || [ "$RUN_ID" = "null" ]; then
    RUN_ID=""
    sleep $SLEEP_SECONDS
  fi
done

if [ -z "$RUN_ID" ]; then
  echo "ERROR: Could not find a workflow run for $WORKFLOW_FILE on branch $BRANCH after waiting."
  exit 3
fi

echo "Found workflow run id: $RUN_ID"
RUN_URL="https://github.com/${GITHUB_REPO}/actions/runs/${RUN_ID}"
echo "View run: $RUN_URL"

# Poll run status until completed
echo
echo "3) Polling workflow run status..."
STATUS=""
CONCLUSION=""
while true; do
  sleep 6
  RUN_JSON=$(curl -sS -H "Authorization: Bearer ${GITHUB_PAT}" "https://api.github.com/repos/${GITHUB_REPO}/actions/runs/${RUN_ID}")
  STATUS=$(echo "$RUN_JSON" | jq -r '.status')
  CONCLUSION=$(echo "$RUN_JSON" | jq -r '.conclusion')
  echo "Status: $STATUS  Conclusion: $CONCLUSION"
  if [ "$STATUS" = "completed" ]; then
    break
  fi
done

if [ "$CONCLUSION" != "success" ]; then
  echo "WARNING: Workflow completed with conclusion: $CONCLUSION"
  echo "Open the run to inspect logs: $RUN_URL"
else
  echo "Workflow completed successfully."
fi

# Run quick smoke checks
echo
echo "4) Running smoke checks against targets..."
PASS=0
FAIL=0
for url in $TARGETS; do
  echo -n "Checking $url ... "
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 400 ]; then
    echo "OK ($HTTP_STATUS)"
    ((PASS++))
  else
    echo "FAIL ($HTTP_STATUS)"
    ((FAIL++))
  fi
done

echo
echo "Smoke check summary: Passed: $PASS  Failed: $FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo "One or more targets failed. Inspect the sites and the workflow logs: $RUN_URL"
  exit 4
fi

echo
echo "Deployment and verification complete. If you want to promote canary to green or flip load balancer, run the LB payloads next."
exit 0

