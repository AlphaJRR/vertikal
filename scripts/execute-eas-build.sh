#!/bin/bash
# Complete EAS Build Execution Script
# This script handles the full build process including credential setup

set -e
# Disable zsh globbing if running in zsh
[ -n "$ZSH_VERSION" ] && setopt +o nomatch 2>/dev/null || true

echo "🚀 VERTIKAL EAS Build Execution"
echo "================================"
echo ""

# Step 1: Verify EAS login
echo "✅ Step 1: Verifying EAS authentication..."
eas whoami || {
    echo "❌ Not logged in. Please run: eas login"
    exit 1
}

# Step 2: Configure Android credentials (interactive)
echo ""
echo "📱 Step 2: Configuring Android credentials..."
echo "   (This will prompt for keystore generation)"
eas credentials:configure-build --platform android

# Step 3: Configure iOS credentials (interactive)
echo ""
echo "🍎 Step 3: Configuring iOS credentials..."
echo "   (This will prompt for certificate setup)"
eas credentials:configure-build --platform ios

# Step 4: Execute production build
echo ""
echo "🚀 Step 4: Starting production build for both platforms..."
echo "   This will take 10-30 minutes..."
eas build --platform all --profile production --auto-submit

echo ""
echo "✅ Build process initiated!"
echo "   Monitor progress at: https://expo.dev/accounts/vertikalapp/projects/vertikal-mobile/builds"
