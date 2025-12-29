#!/bin/bash
# Site Verification Script

echo "=== VERIFYING LIVE SITES ==="
echo ""

sites=(
  "https://vertikalapp.com"
  "https://investors.vertikalapp.com"
  "https://creators.vertikalapp.com"
  "https://networks.vertikalapp.com"
)

for site in "${sites[@]}"; do
  echo "Checking: $site"
  
  # HTTP status check
  status=$(curl -s -o /dev/null -w "%{http_code}" "$site")
  
  if [ "$status" = "200" ]; then
    echo "  ✅ HTTP 200 OK"
    
    # SSL check
    domain=$(echo $site | sed 's|https://||')
    ssl_check=$(echo | openssl s_client -connect ${domain}:443 -servername ${domain} 2>/dev/null | grep "Verify return code" | awk '{print $4}')
    
    if [ "$ssl_check" = "0" ]; then
      echo "  ✅ SSL certificate valid"
    else
      echo "  ⚠️ SSL check failed (code: $ssl_check)"
    fi
    
    # Content check (basic)
    content=$(curl -s "$site" | head -20)
    if [ -n "$content" ]; then
      echo "  ✅ Content loaded"
    else
      echo "  ⚠️ No content returned"
    fi
  else
    echo "  ❌ HTTP $status"
  fi
  
  echo ""
done

echo "=== VERIFICATION COMPLETE ==="

