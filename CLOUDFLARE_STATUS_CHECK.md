# Cloudflare Stream Video Status Check

## Quick Check Command

```bash
# Set your API token first
export TOKEN='your-cloudflare-api-token'

# Then run the check script
./check-cloudflare-video.sh

# Or pass token directly
./check-cloudflare-video.sh your-api-token
```

## Manual Check

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.cloudflare.com/client/v4/accounts/3c47537fe9d7f57294883824a59b42fc/stream/547a1e91b487fdae35cf018718b4c07d
```

## What to Look For

### ✅ Video Ready (readyToStream: true)
```json
{
  "success": true,
  "result": {
    "readyToStream": true,
    ...
  }
}
```

**Action:** Update `src/data/demoSeed.ts`:
```typescript
cloudflare: {
  readyToStream: true, // ← Change to true
}
```

### ⏳ Video Still Processing (readyToStream: false)
```json
{
  "success": true,
  "result": {
    "readyToStream": false,
    ...
  }
}
```

**Action:** Wait and check again later.

## Video Details

- **Account ID:** `3c47537fe9d7f57294883824a59b42fc`
- **Video ID:** `547a1e91b487fdae35cf018718b4c07d`
- **Iframe URL:** `https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/iframe`

**Note:** The video ID in the API call (`547a1e91b487fdae35cf018718b4c07d`) is different from the one in the iframe URL (`9d3d0efed36b71e5f75c7b5e218809d7`). Make sure you're checking the correct video!

## Getting Your API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Create a token with:
   - **Permissions:** Account > Stream > Read
   - **Account Resources:** Include your account

