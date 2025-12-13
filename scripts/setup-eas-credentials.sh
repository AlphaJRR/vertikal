#!/bin/bash
# EAS Credentials Setup Script
# Run this interactively to set up credentials, then builds can run non-interactively

set -e

echo "🔐 EAS Credentials Setup"
echo "========================"
echo ""

# Check if logged in
echo "Checking EAS login status..."
eas whoami || {
    echo "❌ Not logged in to EAS. Please run: eas login"
    exit 1
}

echo ""
echo "📱 Setting up Android credentials..."
eas credentials:configure-build --platform android

echo ""
echo "🍎 Setting up iOS credentials..."
eas credentials:configure-build --platform ios

echo ""
echo "✅ Credentials configured successfully!"
echo ""
echo "🚀 You can now run builds non-interactively:"
echo "   eas build --platform all --profile production"

