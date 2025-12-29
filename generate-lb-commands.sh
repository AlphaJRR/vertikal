#!/bin/bash

# Cloudflare Load Balancer Command Generator
# Generates exact curl commands with IDs filled in from config file

set -e

CONFIG_FILE="${1:-cloudflare-lb-ids.conf}"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Config file not found: $CONFIG_FILE"
    echo ""
    echo "Usage: $0 <config-file>"
    echo ""
    echo "Create a config file with this format:"
    echo ""
    echo "SITE: vertikalapp.com"
    echo "ZONE_ID: <zone id>"
    echo "LB_ID: <lb id>"
    echo "POOL_ID_PROD: <pool id>"
    echo "POOL_ID_CANARY: <pool id>"
    echo "POOL_ID_BLUE: <pool id>"
    echo "POOL_ID_GREEN: <pool id>"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     Cloudflare Load Balancer Command Generator${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Parse config file
SITE=""
ZONE_ID=""
LB_ID=""
POOL_PROD=""
POOL_CANARY=""
POOL_BLUE=""
POOL_GREEN=""

generate_commands() {
    local site_name="$1"
    local zone_id="$2"
    local lb_id="$3"
    local pool_prod="$4"
    local pool_canary="$5"
    local pool_blue="$6"
    local pool_green="$7"
    
    echo -e "${GREEN}=== Commands for $site_name ===${NC}"
    echo ""
    
    echo "# Quick check - fetch current LB config"
    echo "curl -sS -H \"Authorization: Bearer \$CF_API_TOKEN\" \\"
    echo "  \"https://api.cloudflare.com/client/v4/zones/$zone_id/load_balancers/$lb_id\" | jq ."
    echo ""
    
    echo "# Set Prod 90 / Canary 10"
    echo "curl -sS -X PATCH \"https://api.cloudflare.com/client/v4/zones/$zone_id/load_balancers/$lb_id\" \\"
    echo "  -H \"Authorization: Bearer \$CF_API_TOKEN\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{"
    echo "    \"default_pools\": [\"$pool_prod\"],"
    echo "    \"fallback_pool\": \"$pool_prod\","
    echo "    \"proxied\": true,"
    echo "    \"default_pools_weights\": ["
    echo "      {\"pool_id\":\"$pool_prod\",\"weight\":90},"
    echo "      {\"pool_id\":\"$pool_canary\",\"weight\":10}"
    echo "    ]"
    echo "  }'"
    echo ""
    
    echo "# Flip to Green 100%"
    echo "curl -sS -X PATCH \"https://api.cloudflare.com/client/v4/zones/$zone_id/load_balancers/$lb_id\" \\"
    echo "  -H \"Authorization: Bearer \$CF_API_TOKEN\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{"
    echo "    \"default_pools\": [\"$pool_green\"],"
    echo "    \"fallback_pool\": \"$pool_green\","
    echo "    \"proxied\": true"
    echo "  }'"
    echo ""
    
    echo "# Rollback to Prod 100%"
    echo "curl -sS -X PATCH \"https://api.cloudflare.com/client/v4/zones/$zone_id/load_balancers/$lb_id\" \\"
    echo "  -H \"Authorization: Bearer \$CF_API_TOKEN\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{"
    echo "    \"default_pools\": [\"$pool_prod\"],"
    echo "    \"fallback_pool\": \"$pool_prod\","
    echo "    \"proxied\": true"
    echo "  }'"
    echo ""
    
    echo "# Rollback to Blue 100%"
    echo "curl -sS -X PATCH \"https://api.cloudflare.com/client/v4/zones/$zone_id/load_balancers/$lb_id\" \\"
    echo "  -H \"Authorization: Bearer \$CF_API_TOKEN\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{"
    echo "    \"default_pools\": [\"$pool_blue\"],"
    echo "    \"fallback_pool\": \"$pool_blue\","
    echo "    \"proxied\": true"
    echo "  }'"
    echo ""
    echo ""
}

# Parse config file
while IFS= read -r line || [ -n "$line" ]; do
    line=$(echo "$line" | xargs) # Trim whitespace
    
    if [[ "$line" =~ ^SITE: ]]; then
        # Save previous site if exists
        if [ -n "$SITE" ] && [ -n "$ZONE_ID" ] && [ -n "$LB_ID" ]; then
            generate_commands "$SITE" "$ZONE_ID" "$LB_ID" "$POOL_PROD" "$POOL_CANARY" "$POOL_BLUE" "$POOL_GREEN"
        fi
        
        # Reset for new site
        SITE=$(echo "$line" | sed 's/SITE: //' | xargs)
        ZONE_ID=""
        LB_ID=""
        POOL_PROD=""
        POOL_CANARY=""
        POOL_BLUE=""
        POOL_GREEN=""
    elif [[ "$line" =~ ^ZONE_ID: ]]; then
        ZONE_ID=$(echo "$line" | sed 's/ZONE_ID: //' | xargs)
    elif [[ "$line" =~ ^LB_ID: ]]; then
        LB_ID=$(echo "$line" | sed 's/LB_ID: //' | xargs)
    elif [[ "$line" =~ ^POOL_ID_PROD: ]]; then
        POOL_PROD=$(echo "$line" | sed 's/POOL_ID_PROD: //' | xargs)
    elif [[ "$line" =~ ^POOL_ID_CANARY: ]]; then
        POOL_CANARY=$(echo "$line" | sed 's/POOL_ID_CANARY: //' | xargs)
    elif [[ "$line" =~ ^POOL_ID_BLUE: ]]; then
        POOL_BLUE=$(echo "$line" | sed 's/POOL_ID_BLUE: //' | xargs)
    elif [[ "$line" =~ ^POOL_ID_GREEN: ]]; then
        POOL_GREEN=$(echo "$line" | sed 's/POOL_ID_GREEN: //' | xargs)
    fi
done < "$CONFIG_FILE"

# Generate commands for last site
if [ -n "$SITE" ] && [ -n "$ZONE_ID" ] && [ -n "$LB_ID" ]; then
    generate_commands "$SITE" "$ZONE_ID" "$LB_ID" "$POOL_PROD" "$POOL_CANARY" "$POOL_BLUE" "$POOL_GREEN"
fi

echo -e "${YELLOW}⚠️  Remember to set CF_API_TOKEN before running these commands:${NC}"
echo "export CF_API_TOKEN=\"your_token_here\""
echo ""

