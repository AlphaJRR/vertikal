#!/bin/bash
# Check Cloudflare Stream video status

TOKEN="${1:-$TOKEN}"
ACCOUNT_ID="3c47537fe9d7f57294883824a59b42fc"

# The video ID from the iframe URL (the one we're actually using)
VIDEO_ID_IFRAME="9d3d0efed36b71e5f75c7b5e218809d7"

# The video ID from the curl command
VIDEO_ID_CURL="547a1e91b487fdae35cf018718b4c07d"

if [ -z "$TOKEN" ]; then
    echo "❌ Error: API Token required"
    echo ""
    echo "Usage:"
    echo "  ./check-video-status.sh YOUR_API_TOKEN"
    echo ""
    echo "Or: export TOKEN='your-token' && ./check-video-status.sh"
    exit 1
fi

echo "🔍 Checking Cloudflare Stream video status..."
echo ""
echo "Checking VIDEO ID from iframe URL: $VIDEO_ID_IFRAME"
echo ""

RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/stream/$VIDEO_ID_IFRAME")

if echo "$RESPONSE" | grep -q '"success":true'; then
    READY=$(echo "$RESPONSE" | grep -o '"readyToStream":[^,}]*' | cut -d':' -f2 | tr -d ' ')
    
    if [ "$READY" = "true" ]; then
        echo "✅ STATUS: readyToStream = TRUE"
        echo ""
        echo "🎉 Video is ready! Update src/data/demoSeed.ts:"
        echo "   cloudflare: { readyToStream: true }"
    else
        echo "⏳ STATUS: readyToStream = FALSE (still processing)"
    fi
    
    echo ""
    echo "Full response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo "❌ Request failed!"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
fi
