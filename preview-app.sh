#!/bin/bash
# AVA Media - Preview App Script
# Builds and opens the app in Xcode for preview

echo "🚀 AVA Media - Building and Preparing for Preview"
echo "=================================================="
echo ""

# Step 1: Build the web app
echo "📦 Step 1: Building React + Vite app..."
npm run build:web

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check for errors."
    exit 1
fi

echo "✅ Web app built successfully!"
echo ""

# Step 2: Sync to iOS
echo "📱 Step 2: Syncing to iOS project..."
npx cap sync ios

if [ $? -ne 0 ]; then
    echo "❌ Sync failed! Please check for errors."
    exit 1
fi

echo "✅ iOS project synced!"
echo ""

# Step 3: Open in Xcode
echo "🔧 Step 3: Opening in Xcode..."
echo ""
echo "📝 Next steps in Xcode:"
echo "   1. Select a simulator or your iPhone"
echo "   2. Click the Play button (▶️) or press Cmd+R"
echo "   3. Wait for the app to build and launch"
echo ""

npx cap open ios

echo ""
echo "✅ Xcode should now be opening..."
echo ""
echo "💡 Tip: If Xcode doesn't open automatically, run:"
echo "   npm run open:ios"
echo ""
