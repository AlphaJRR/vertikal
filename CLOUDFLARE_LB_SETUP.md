# 🎯 Cloudflare Load Balancer Payload Generator

## Quick Start

### Step 1: Fill in the Template

Edit `cloudflare-lb-config.template` and fill in your IDs:

```bash
# Example for vertikalapp.com:
ZONE_ID_VERTIKAL=your_zone_id_here
LB_ID_VERTIKAL=your_lb_id_here
POOL_ID_PROD_VERTIKAL=your_prod_pool_id
POOL_ID_CANARY_VERTIKAL=your_canary_pool_id
POOL_ID_BLUE_VERTIKAL=your_blue_pool_id
POOL_ID_GREEN_VERTIKAL=your_green_pool_id
```

Repeat for all 4 sites:
- `VERTIKAL` (vertikalapp.com)
- `INVESTORS` (investors.vertikalapp.com)
- `CREATORS` (creators.vertikalapp.com)
- `NETWORKS` (networks.vertikalapp.com)

### Step 2: Generate Payloads

```bash
./generate-lb-payloads.sh
```

This outputs ready-to-run `curl` commands for:
- ✅ Set prod/canary weights (90/10, 95/5, etc.)
- ✅ Promote canary to green (100% green)
- ✅ Flip blue/green (make green live)
- ✅ Rollback to production (100% prod)
- ✅ Rollback to blue (100% blue)

---

## How to Get Your IDs

### Zone ID
1. Go to: https://dash.cloudflare.com
2. Select domain: `vertikalapp.com`
3. Right sidebar → **Zone ID** (copy)

### Load Balancer ID
1. Cloudflare Dashboard → **Traffic** → **Load Balancing**
2. Click your load balancer
3. URL will show: `.../load_balancers/LB_ID_HERE`
4. Or check API response

### Pool IDs
1. Load Balancer → **Pools** tab
2. Click each pool → **Pool ID** shown
3. Or use API: `GET /zones/{zone_id}/load_balancers/{lb_id}/pools`

---

## Usage Examples

### Set 90/10 Prod/Canary Split

```bash
export CLOUDFLARE_API_TOKEN="your_token"
./generate-lb-payloads.sh | grep -A 20 "90/10" | head -25
```

### Promote Canary to Green

```bash
# After deploying to green pool:
./generate-lb-payloads.sh | grep -A 15 "PROMOTE CANARY"
```

### Rollback to Production

```bash
./generate-lb-payloads.sh | grep -A 15 "ROLLBACK TO PRODUCTION"
```

---

## Generated Commands Include

1. **Weight Updates**: Adjust traffic split between pools
2. **Blue/Green Flips**: Switch 100% traffic to target pool
3. **Rollback Commands**: Revert to known-good state
4. **Promotion Workflows**: Canary → Green deployment flow

---

## Safety Notes

- ⚠️ **Test in staging first**
- ⚠️ **Verify pool health before flipping**
- ⚠️ **Keep rollback commands ready**
- ⚠️ **Monitor traffic after changes**

---

## Template Format

The config file uses this format:

```bash
# SITE: vertikalapp.com
ZONE_ID_VERTIKAL=zone_id_here
LB_ID_VERTIKAL=lb_id_here
POOL_ID_PROD_VERTIKAL=prod_pool_id
POOL_ID_CANARY_VERTIKAL=canary_pool_id
POOL_ID_BLUE_VERTIKAL=blue_pool_id
POOL_ID_GREEN_VERTIKAL=green_pool_id
```

Fill in all values, then run the generator.

---

**Status:** ✅ Ready — Fill in template and generate payloads

