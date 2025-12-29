# Cloudflare Load Balancer Commands — Ready-to-Run

**Ready-to-run** Cloudflare Load Balancer `curl` commands for canary → green promotion flow plus rollbacks.

---

## 1. Set Environment Variables (One Time)

```bash
# Replace the ALL_CAPS placeholders with your real values before running any command
export CF_API_TOKEN="YOUR_CLOUDFLARE_API_TOKEN"
export ZONE_ID_VERTIKAL="ZONE_ID_FOR_VERTIKAL"
export LB_ID_VERTIKAL="LB_ID_FOR_VERTIKAL"
export POOL_PROD_VERTIKAL="POOL_ID_PROD_VERTIKAL"
export POOL_CANARY_VERTIKAL="POOL_ID_CANARY_VERTIKAL"
export POOL_BLUE_VERTIKAL="POOL_ID_BLUE_VERTIKAL"
export POOL_GREEN_VERTIKAL="POOL_ID_GREEN_VERTIKAL"

export ZONE_ID_INVESTORS="ZONE_ID_FOR_INVESTORS"
export LB_ID_INVESTORS="LB_ID_FOR_INVESTORS"
export POOL_PROD_INVESTORS="POOL_ID_PROD_INVESTORS"
export POOL_CANARY_INVESTORS="POOL_ID_CANARY_INVESTORS"
export POOL_BLUE_INVESTORS="POOL_ID_BLUE_INVESTORS"
export POOL_GREEN_INVESTORS="POOL_ID_GREEN_INVESTORS"

export ZONE_ID_CREATORS="ZONE_ID_FOR_CREATORS"
export LB_ID_CREATORS="LB_ID_FOR_CREATORS"
export POOL_PROD_CREATORS="POOL_ID_PROD_CREATORS"
export POOL_CANARY_CREATORS="POOL_ID_CANARY_CREATORS"
export POOL_BLUE_CREATORS="POOL_ID_BLUE_CREATORS"
export POOL_GREEN_CREATORS="POOL_ID_GREEN_CREATORS"

export ZONE_ID_NETWORKS="ZONE_ID_FOR_NETWORKS"
export LB_ID_NETWORKS="LB_ID_FOR_NETWORKS"
export POOL_PROD_NETWORKS="POOL_ID_PROD_NETWORKS"
export POOL_CANARY_NETWORKS="POOL_ID_CANARY_NETWORKS"
export POOL_BLUE_NETWORKS="POOL_ID_BLUE_NETWORKS"
export POOL_GREEN_NETWORKS="POOL_ID_GREEN_NETWORKS"
```

---

## 2. Quick Check — Fetch Current LB Config

Run this for each site to confirm the Load Balancer and pool IDs before making changes.

```bash
# Vertikal
curl -sS -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_VERTIKAL/load_balancers/$LB_ID_VERTIKAL" | jq .

# Investors
curl -sS -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_INVESTORS/load_balancers/$LB_ID_INVESTORS" | jq .

# Creators
curl -sS -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_CREATORS/load_balancers/$LB_ID_CREATORS" | jq .

# Networks
curl -sS -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_NETWORKS/load_balancers/$LB_ID_NETWORKS" | jq .
```

---

## 3. Set Prod 90 / Canary 10 (Gradual Canary)

Run per site to start gradual canary deployment.

### Vertikal: Prod 90 / Canary 10
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_VERTIKAL/load_balancers/$LB_ID_VERTIKAL" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_VERTIKAL"'"],
    "fallback_pool": "'"$POOL_PROD_VERTIKAL"'",
    "proxied": true,
    "default_pools_weights": [
      {"pool_id":"'"$POOL_PROD_VERTIKAL"'","weight":90},
      {"pool_id":"'"$POOL_CANARY_VERTIKAL"'","weight":10}
    ]
  }'
```

### Investors: Prod 90 / Canary 10
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_INVESTORS/load_balancers/$LB_ID_INVESTORS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_INVESTORS"'"],
    "fallback_pool": "'"$POOL_PROD_INVESTORS"'",
    "proxied": true,
    "default_pools_weights": [
      {"pool_id":"'"$POOL_PROD_INVESTORS"'","weight":90},
      {"pool_id":"'"$POOL_CANARY_INVESTORS"'","weight":10}
    ]
  }'
```

### Creators: Prod 90 / Canary 10
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_CREATORS/load_balancers/$LB_ID_CREATORS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_CREATORS"'"],
    "fallback_pool": "'"$POOL_PROD_CREATORS"'",
    "proxied": true,
    "default_pools_weights": [
      {"pool_id":"'"$POOL_PROD_CREATORS"'","weight":90},
      {"pool_id":"'"$POOL_CANARY_CREATORS"'","weight":10}
    ]
  }'
```

### Networks: Prod 90 / Canary 10
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_NETWORKS/load_balancers/$LB_ID_NETWORKS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_NETWORKS"'"],
    "fallback_pool": "'"$POOL_PROD_NETWORKS"'",
    "proxied": true,
    "default_pools_weights": [
      {"pool_id":"'"$POOL_PROD_NETWORKS"'","weight":90},
      {"pool_id":"'"$POOL_CANARY_NETWORKS"'","weight":10}
    ]
  }'
```

---

## 4. Promote Canary → Green (100% Green)

**Step A:** Deploy green via GitHub Actions workflow (run workflow with `mode=green` for each site or `target=all`).  
**Step B:** Flip LB to green 100% (commands below).

### Vertikal: Flip to Green 100%
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_VERTIKAL/load_balancers/$LB_ID_VERTIKAL" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_GREEN_VERTIKAL"'"],
    "fallback_pool": "'"$POOL_GREEN_VERTIKAL"'",
    "proxied": true
  }'
```

### Investors: Flip to Green 100%
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_INVESTORS/load_balancers/$LB_ID_INVESTORS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_GREEN_INVESTORS"'"],
    "fallback_pool": "'"$POOL_GREEN_INVESTORS"'",
    "proxied": true
  }'
```

### Creators: Flip to Green 100%
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_CREATORS/load_balancers/$LB_ID_CREATORS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_GREEN_CREATORS"'"],
    "fallback_pool": "'"$POOL_GREEN_CREATORS"'",
    "proxied": true
  }'
```

### Networks: Flip to Green 100%
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_NETWORKS/load_balancers/$LB_ID_NETWORKS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_GREEN_NETWORKS"'"],
    "fallback_pool": "'"$POOL_GREEN_NETWORKS"'",
    "proxied": true
  }'
```

---

## 5. Gradual Blue/Green Shift (Blue 20% / Green 80%)

Use this if you prefer staged promotion instead of immediate 100% flip.

### Vertikal: Blue 20 / Green 80
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_VERTIKAL/load_balancers/$LB_ID_VERTIKAL" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_BLUE_VERTIKAL"'"],
    "fallback_pool": "'"$POOL_BLUE_VERTIKAL"'",
    "proxied": true,
    "default_pools_weights": [
      {"pool_id":"'"$POOL_BLUE_VERTIKAL"'","weight":20},
      {"pool_id":"'"$POOL_GREEN_VERTIKAL"'","weight":80}
    ]
  }'
```

Repeat the same pattern for the other sites by substituting the appropriate environment variables.

---

## 6. Immediate Rollback Commands

### Rollback to Prod (100% Prod)

#### Vertikal → Prod
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_VERTIKAL/load_balancers/$LB_ID_VERTIKAL" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_VERTIKAL"'"],
    "fallback_pool": "'"$POOL_PROD_VERTIKAL"'",
    "proxied": true
  }'
```

#### Investors → Prod
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_INVESTORS/load_balancers/$LB_ID_INVESTORS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_INVESTORS"'"],
    "fallback_pool": "'"$POOL_PROD_INVESTORS"'",
    "proxied": true
  }'
```

#### Creators → Prod
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_CREATORS/load_balancers/$LB_ID_CREATORS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_CREATORS"'"],
    "fallback_pool": "'"$POOL_PROD_CREATORS"'",
    "proxied": true
  }'
```

#### Networks → Prod
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_NETWORKS/load_balancers/$LB_ID_NETWORKS" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_PROD_NETWORKS"'"],
    "fallback_pool": "'"$POOL_PROD_NETWORKS"'",
    "proxied": true
  }'
```

### Rollback to Blue (If Blue Was Previously Live)

#### Vertikal → Blue
```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_VERTIKAL/load_balancers/$LB_ID_VERTIKAL" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'"$POOL_BLUE_VERTIKAL"'"],
    "fallback_pool": "'"$POOL_BLUE_VERTIKAL"'",
    "proxied": true
  }'
```

Repeat for other sites by swapping environment variables.

---

## 7. Post-Change Verification

Run after each flip to verify changes.

### Basic HTTP Checks
```bash
curl -I https://vertikalapp.com
curl -I https://investors.vertikalapp.com
curl -I https://creators.vertikalapp.com
curl -I https://networks.vertikalapp.com
```

### Content Checks (Quick)
```bash
curl -s https://vertikalapp.com | grep -i "STOP ROTATING YOUR PHONE" || echo "vertikal hero missing"
curl -s https://investors.vertikalapp.com | grep -i "Founding Participant" || echo "investors tiers missing"
curl -s https://networks.vertikalapp.com | grep -i "FOUNDING 50 NETWORKS" || echo "networks headline missing"
```

---

## 8. Safety Notes and Best Practices

- **Confirm IDs first**: Run the Quick check (section 2) and verify `pool` IDs match the intended Pages origins before making changes.
- **Make one change at a time** per site and monitor metrics (errors, latency, conversions) for 5–15 minutes before proceeding.
- **If the API returns an error** about schema (e.g., `default_pools_weights` not accepted), use the Cloudflare Dashboard UI to set weights — the API schema can vary by account/region.
- **Keep your CF API token secure**; prefer setting it as an environment variable rather than embedding it in commands.
- **If you want exact commands with IDs filled in**, use the `generate-lb-commands.sh` script (see below).

---

## 9. Generate Exact Commands with Your IDs

To generate exact commands with your IDs filled in, create a config file:

```bash
# Create config file
cat > cloudflare-lb-ids.conf << 'EOF'
SITE: vertikalapp.com
ZONE_ID: <zone id>
LB_ID: <lb id>
POOL_ID_PROD: <pool id>
POOL_ID_CANARY: <pool id>
POOL_ID_BLUE: <pool id>
POOL_ID_GREEN: <pool id>

SITE: investors.vertikalapp.com
ZONE_ID: <zone id>
LB_ID: <lb id>
POOL_ID_PROD: <pool id>
POOL_ID_CANARY: <pool id>
POOL_ID_BLUE: <pool id>
POOL_ID_GREEN: <pool id>

SITE: creators.vertikalapp.com
ZONE_ID: <zone id>
LB_ID: <lb id>
POOL_ID_PROD: <pool id>
POOL_ID_CANARY: <pool id>
POOL_ID_BLUE: <pool id>
POOL_ID_GREEN: <pool id>

SITE: networks.vertikalapp.com
ZONE_ID: <zone id>
LB_ID: <lb id>
POOL_ID_PROD: <pool id>
POOL_ID_CANARY: <pool id>
POOL_ID_BLUE: <pool id>
POOL_ID_GREEN: <pool id>
EOF

# Then run the generator script
./generate-lb-commands.sh cloudflare-lb-ids.conf
```

---

**Generated:** $(date)  
**Version:** 1.0  
**Status:** Ready for use

