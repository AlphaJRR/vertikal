#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "        COMPREHENSIVE PAGE TEST - PASS/FAIL REPORT"
echo "═══════════════════════════════════════════════════════════"
echo ""

PASS=0
FAIL=0

# Test 1: Check all HTML files exist
echo "TEST 1: File Existence"
echo "----------------------"
for file in "public/index.html" "public/creators/index.html" "public/networks/index.html" "public/investors/index.html" "public/beta/index.html"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
        ((PASS++))
    else
        echo "❌ $file MISSING"
        ((FAIL++))
    fi
done
echo ""

# Test 2: Check navigation links to vertikalapp.com
echo "TEST 2: Navigation Links to vertikalapp.com"
echo "-------------------------------------------"
for file in "public/creators/index.html" "public/networks/index.html" "public/investors/index.html"; do
    if grep -q 'href="https://vertikalapp.com"' "$file" || grep -q "href='https://vertikalapp.com'" "$file"; then
        echo "✅ $file links to vertikalapp.com"
        ((PASS++))
    else
        echo "❌ $file MISSING link to vertikalapp.com"
        ((FAIL++))
    fi
done
echo ""

# Test 3: Check cross-page navigation links
echo "TEST 3: Cross-Page Navigation Links"
echo "------------------------------------"
for file in "public/creators/index.html" "public/networks/index.html" "public/investors/index.html"; do
    has_creators=$(grep -q 'href.*creators' "$file" && echo "yes" || echo "no")
    has_networks=$(grep -q 'href.*networks' "$file" && echo "yes" || echo "no")
    has_investors=$(grep -q 'href.*investors' "$file" && echo "yes" || echo "no")
    
    if [ "$has_creators" = "yes" ] && [ "$has_networks" = "yes" ] && [ "$has_investors" = "yes" ]; then
        echo "✅ $file has all navigation links"
        ((PASS++))
    else
        echo "❌ $file MISSING navigation links"
        ((FAIL++))
    fi
done
echo ""

# Test 4: Badge Segregation
echo "TEST 4: Badge Segregation"
echo "------------------------"
# Creators: Should have Gold + Blue, NO Green, NO Titanium
creators_gold=$(grep -qi "gold\|founding 50" public/creators/index.html && echo "yes" || echo "no")
creators_blue=$(grep -qi "blue\|verified creator" public/creators/index.html && echo "yes" || echo "no")
creators_green=$(grep -qi "green\|titanium investor" public/creators/index.html && echo "yes" || echo "no")
creators_titanium=$(grep -qi "titanium.*network" public/creators/index.html && echo "yes" || echo "no")

if [ "$creators_gold" = "yes" ] && [ "$creators_blue" = "yes" ] && [ "$creators_green" = "no" ] && [ "$creators_titanium" = "no" ]; then
    echo "✅ Creators: Gold + Blue ONLY"
    ((PASS++))
else
    echo "❌ Creators: Badge segregation FAILED"
    ((FAIL++))
fi

# Networks: Should have Titanium ONLY
networks_titanium=$(grep -qi "titanium" public/networks/index.html && echo "yes" || echo "no")
networks_gold=$(grep -qi "gold\|founding 50" public/networks/index.html && echo "yes" || echo "no")
networks_blue=$(grep -qi "blue\|verified creator" public/networks/index.html && echo "yes" || echo "no")
networks_green=$(grep -qi "green\|titanium investor" public/networks/index.html && echo "yes" || echo "no")

if [ "$networks_titanium" = "yes" ] && [ "$networks_gold" = "no" ] && [ "$networks_blue" = "no" ] && [ "$networks_green" = "no" ]; then
    echo "✅ Networks: Titanium ONLY"
    ((PASS++))
else
    echo "❌ Networks: Badge segregation FAILED"
    ((FAIL++))
fi

# Investors: Should have Green ONLY
investors_green=$(grep -qi "green\|titanium investor" public/investors/index.html && echo "yes" || echo "no")
investors_gold=$(grep -qi "gold\|founding 50" public/investors/index.html && echo "yes" || echo "no")
investors_blue=$(grep -qi "blue\|verified creator" public/investors/index.html && echo "yes" || echo "no")
investors_titanium=$(grep -qi "titanium.*network" public/investors/index.html && echo "yes" || echo "no")

if [ "$investors_green" = "yes" ] && [ "$investors_gold" = "no" ] && [ "$investors_blue" = "no" ] && [ "$investors_titanium" = "no" ]; then
    echo "✅ Investors: Green ONLY"
    ((PASS++))
else
    echo "❌ Investors: Badge segregation FAILED"
    ((FAIL++))
fi
echo ""

# Test 5: Buttons and Forms
echo "TEST 5: Buttons and Forms"
echo "-------------------------"
for file in "public/creators/index.html" "public/networks/index.html" "public/investors/index.html"; do
    has_button=$(grep -q '<button\|class="btn"' "$file" && echo "yes" || echo "no")
    if [ "$has_button" = "yes" ]; then
        echo "✅ $file has buttons"
        ((PASS++))
    else
        echo "❌ $file MISSING buttons"
        ((FAIL++))
    fi
done
echo ""

# Test 6: Investors Badge Explanation Length
echo "TEST 6: Investors Badge Explanation ≤340 chars"
echo "------------------------------------------------"
badge_text=$(grep -A 1 "Titanium Investor Badge" public/investors/index.html | grep -o '<p[^>]*>.*</p>' | sed 's/<[^>]*>//g' | sed 's/&nbsp;/ /g')
char_count=$(echo -n "$badge_text" | wc -c | tr -d ' ')
if [ "$char_count" -le 340 ]; then
    echo "✅ Investors badge explanation: $char_count chars (≤340)"
    ((PASS++))
else
    echo "❌ Investors badge explanation: $char_count chars (>340)"
    ((FAIL++))
fi
echo ""

# Test 7: Status, Scarcity, Advantage Check
echo "TEST 7: Status, Scarcity, Advantage"
echo "-----------------------------------"
# Creators
creators_status=$(grep -qi "badge\|tier\|status" public/creators/index.html && echo "yes" || echo "no")
creators_scarcity=$(grep -qi "50\|capped\|scarcity\|limited" public/creators/index.html && echo "yes" || echo "no")
creators_advantage=$(grep -qi "economics\|revenue\|advantage\|benefit" public/creators/index.html && echo "yes" || echo "no")
if [ "$creators_status" = "yes" ] && [ "$creators_scarcity" = "yes" ] && [ "$creators_advantage" = "yes" ]; then
    echo "✅ Creators: Status, Scarcity, Advantage present"
    ((PASS++))
else
    echo "❌ Creators: Missing Status/Scarcity/Advantage"
    ((FAIL++))
fi

# Networks
networks_status=$(grep -qi "titanium\|badge\|authority" public/networks/index.html && echo "yes" || echo "no")
networks_scarcity=$(grep -qi "early\|closing\|window" public/networks/index.html && echo "yes" || echo "no")
networks_advantage=$(grep -qi "roi\|10x\|80%\|revenue\|advantage" public/networks/index.html && echo "yes" || echo "no")
if [ "$networks_status" = "yes" ] && [ "$networks_scarcity" = "yes" ] && [ "$networks_advantage" = "yes" ]; then
    echo "✅ Networks: Status, Scarcity, Advantage present"
    ((PASS++))
else
    echo "❌ Networks: Missing Status/Scarcity/Advantage"
    ((FAIL++))
fi

# Investors
investors_status=$(grep -qi "badge\|titanium investor" public/investors/index.html && echo "yes" || echo "no")
investors_scarcity=$(grep -qi "pre-launch\|exclusivity\|early\|not available" public/investors/index.html && echo "yes" || echo "no")
investors_advantage=$(grep -qi "ownership\|equity\|leverage\|advantage" public/investors/index.html && echo "yes" || echo "no")
if [ "$investors_status" = "yes" ] && [ "$investors_scarcity" = "yes" ] && [ "$investors_advantage" = "yes" ]; then
    echo "✅ Investors: Status, Scarcity, Advantage present"
    ((PASS++))
else
    echo "❌ Investors: Missing Status/Scarcity/Advantage"
    ((FAIL++))
fi
echo ""

# Final Report
echo "═══════════════════════════════════════════════════════════"
echo "                    FINAL REPORT"
echo "═══════════════════════════════════════════════════════════"
echo "✅ PASSED: $PASS"
echo "❌ FAILED: $FAIL"
echo ""
if [ $FAIL -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED - READY FOR PRODUCTION"
    exit 0
else
    echo "⚠️  SOME TESTS FAILED - REVIEW REQUIRED"
    exit 1
fi
