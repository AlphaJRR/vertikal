#!/usr/bin/env bash
set -euo pipefail

# Load Balancer Payload Generator for Cloudflare
# Usage: ./generate-lb-payloads.sh [config-file]

CONFIG_FILE="${1:-cloudflare-lb-config.template}"
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "⚠️  CLOUDFLARE_API_TOKEN not set (will generate commands without auth)"
  echo ""
fi

if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Config file not found: $CONFIG_FILE"
  echo "Create it using the template format"
  exit 1
fi

# Source the config
source "$CONFIG_FILE"

# Function to generate curl command for updating pool weights
generate_weight_update() {
  local site=$1
  local lb_id=$2
  local pool_id_prod=$3
  local pool_id_canary=$4
  local prod_weight=$5
  local canary_weight=$6
  
  cat <<EOF

# ========================================
# Update Pool Weights: $site
# Production: ${prod_weight}% | Canary: ${canary_weight}%
# ========================================
curl -X PUT \\
  "https://api.cloudflare.com/client/v4/zones/\${ZONE_ID_${site^^}}/load_balancers/\${LB_ID_${site^^}}" \\
  -H "Authorization: Bearer \${CLOUDFLARE_API_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "default_pools": [
      {
        "id": "${pool_id_prod}",
        "weight": ${prod_weight}
      },
      {
        "id": "${pool_id_canary}",
        "weight": ${canary_weight}
      }
    ],
    "enabled": true
  }'

EOF
}

# Function to generate flip blue/green command
generate_flip_blue_green() {
  local site=$1
  local lb_id=$2
  local pool_id_blue=$3
  local pool_id_green=$4
  local target_pool=$5  # "blue" or "green"
  local target_weight=$6
  
  cat <<EOF

# ========================================
# Flip Blue/Green: $site → ${target_pool^^} (${target_weight}%)
# ========================================
curl -X PUT \\
  "https://api.cloudflare.com/client/v4/zones/\${ZONE_ID_${site^^}}/load_balancers/\${LB_ID_${site^^}}" \\
  -H "Authorization: Bearer \${CLOUDFLARE_API_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "default_pools": [
      {
        "id": "${pool_id_${target_pool}}",
        "weight": ${target_weight}
      }
    ],
    "enabled": true
  }'

EOF
}

# Function to generate rollback command
generate_rollback() {
  local site=$1
  local lb_id=$2
  local pool_id_prod=$3
  
  cat <<EOF

# ========================================
# Rollback to Production: $site
# ========================================
curl -X PUT \\
  "https://api.cloudflare.com/client/v4/zones/\${ZONE_ID_${site^^}}/load_balancers/\${LB_ID_${site^^}}" \\
  -H "Authorization: Bearer \${CLOUDFLARE_API_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "default_pools": [
      {
        "id": "${pool_id_prod}",
        "weight": 100
      }
    ],
    "enabled": true
  }'

EOF
}

echo "🚀 CLOUDFLARE LOAD BALANCER PAYLOADS"
echo "======================================"
echo ""
echo "Generated from: $CONFIG_FILE"
echo ""

# Check if config is filled
if [ -z "$ZONE_ID_VERTIKAL" ] || [ -z "$LB_ID_VERTIKAL" ]; then
  echo "⚠️  WARNING: Config file appears empty or incomplete"
  echo "Fill in the IDs in $CONFIG_FILE first"
  echo ""
fi

echo "# ========================================"
echo "# SET PROD/CANARY WEIGHTS (90/10)"
echo "# ========================================"

for site in "VERTIKAL" "INVESTORS" "CREATORS" "NETWORKS"; do
  zone_var="ZONE_ID_${site}"
  lb_var="LB_ID_${site}"
  prod_var="POOL_ID_PROD_${site}"
  canary_var="POOL_ID_CANARY_${site}"
  
  if [ -n "${!zone_var:-}" ] && [ -n "${!lb_var:-}" ]; then
    site_lower=$(echo "$site" | tr '[:upper:]' '[:lower:]')
    generate_weight_update "$site_lower" "${!lb_var}" "${!prod_var}" "${!canary_var}" 90 10
  fi
done

echo ""
echo "# ========================================"
echo "# PROMOTE CANARY TO GREEN (Deploy + Flip)"
echo "# ========================================"
echo "# Step 1: Deploy to green pool"
echo "# Step 2: Flip 100% to green (commands below)"
echo ""

for site in "VERTIKAL" "INVESTORS" "CREATORS" "NETWORKS"; do
  zone_var="ZONE_ID_${site}"
  lb_var="LB_ID_${site}"
  green_var="POOL_ID_GREEN_${site}"
  
  if [ -n "${!zone_var:-}" ] && [ -n "${!lb_var:-}" ]; then
    site_lower=$(echo "$site" | tr '[:upper:]' '[:lower:]')
    generate_flip_blue_green "$site_lower" "${!lb_var}" "dummy" "${!green_var}" "green" 100
  fi
done

echo ""
echo "# ========================================"
echo "# FLIP BLUE/GREEN → GREEN (100%)"
echo "# ========================================"

for site in "VERTIKAL" "INVESTORS" "CREATORS" "NETWORKS"; do
  zone_var="ZONE_ID_${site}"
  lb_var="LB_ID_${site}"
  blue_var="POOL_ID_BLUE_${site}"
  green_var="POOL_ID_GREEN_${site}"
  
  if [ -n "${!zone_var:-}" ] && [ -n "${!lb_var:-}" ]; then
    site_lower=$(echo "$site" | tr '[:upper:]' '[:lower:]')
    generate_flip_blue_green "$site_lower" "${!lb_var}" "${!blue_var}" "${!green_var}" "green" 100
  fi
done

echo ""
echo "# ========================================"
echo "# ROLLBACK TO PRODUCTION (100%)"
echo "# ========================================"

for site in "VERTIKAL" "INVESTORS" "CREATORS" "NETWORKS"; do
  zone_var="ZONE_ID_${site}"
  lb_var="LB_ID_${site}"
  prod_var="POOL_ID_PROD_${site}"
  
  if [ -n "${!zone_var:-}" ] && [ -n "${!lb_var:-}" ]; then
    site_lower=$(echo "$site" | tr '[:upper:]' '[:lower:]')
    generate_rollback "$site_lower" "${!lb_var}" "${!prod_var}"
  fi
done

echo ""
echo "# ========================================"
echo "# ROLLBACK TO BLUE (100%)"
echo "# ========================================"

for site in "VERTIKAL" "INVESTORS" "CREATORS" "NETWORKS"; do
  zone_var="ZONE_ID_${site}"
  lb_var="LB_ID_${site}"
  blue_var="POOL_ID_BLUE_${site}"
  
  if [ -n "${!zone_var:-}" ] && [ -n "${!lb_var:-}" ]; then
    site_lower=$(echo "$site" | tr '[:upper:]' '[:lower:]')
    generate_flip_blue_green "$site_lower" "${!lb_var}" "${!blue_var}" "dummy" "blue" 100
  fi
done

echo ""
echo "✅ Payload generation complete!"
echo ""
echo "To use:"
echo "1. Set: export CLOUDFLARE_API_TOKEN=\"your_token\""
echo "2. Copy/paste the commands above"
echo "3. Or save to file: ./generate-lb-payloads.sh > lb-commands.sh"

