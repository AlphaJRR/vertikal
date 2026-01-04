#!/bin/bash

# Cloudflare Stream Video Status Checker
# Usage: ./check-cloudflare-video.sh YOUR_API_TOKEN

TOKEN="${1:-$TOKEN}"
ACCOUNT_ID="3c47537fe9d7f57294883824a59b42fc"
VIDEO_ID="547a1e91b487fdae35cf018718b4c07d"

if [ -z "$TOKEN" ]; then
    echo "❌ Error: API Token required"
    echo ""
    echo "Usage:"
    echo "  ./check-cloudflare-video.sh YOUR_API_TOKEN"
    echo ""
    echo "Or set environment variable:"
    echo "  export TOKEN='your-api-token'"
    echo "  ./check-cloudflare-video.sh"
    exit 1
fi

echo "🔍 Checking Cloudflare Stream video status..."
echo "Video ID: $VIDEO_ID"
echo ""

RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/stream/$VIDEO_ID")

# Check if request was successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Request successful!"
    echo ""
    
    # Extract readyToStream status
    READY_TO_STREAM=$(echo "$RESPONSE" | grep -o '"readyToStream":[^,}]*' | cut -d':' -f2 | tr -d ' ')
    
    if [ "$READY_TO_STREAM" = "true" ]; then
        echo "🎉 STATUS: readyToStream = TRUE"
        echo ""
        echo "✅ Video is ready! You can now:"
        echo "   1. Update src/data/demoSeed.ts"
        echo "   2. Set readyToStream: true"
        echo "   3. The app will use Cloudflare iframe automatically"
    else
        echo "⏳ STATUS: readyToStream = FALSE"
        echo ""
        echo "Video is still processing. Wait a bit longer and check again."
    fi
    
    echo ""
    echo "Full response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo "❌ Request failed!"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo "Common issues:"
    echo "  - Invalid API token"
    echo "  - Token doesn't have Stream API permissions"
    echo "  - Video ID doesn't exist"
fi

