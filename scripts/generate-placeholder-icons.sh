#!/bin/bash
# Generate placeholder app icons for iOS
# Replace these with your actual app icons later

ICON_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
ICON_SIZE=1024

echo "🎨 Generating placeholder app icons..."

# Create a simple black square with "V" text as placeholder
# This is a basic placeholder - replace with your actual icon design

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create placeholder icon..."
    convert -size ${ICON_SIZE}x${ICON_SIZE} xc:#000000 \
            -gravity center \
            -pointsize 400 \
            -fill "#FFD700" \
            -font "Helvetica-Bold" \
            -annotate +0+0 "V" \
            "${ICON_DIR}/AppIcon-1024.png"
    
    # Copy to the 2x version
    cp "${ICON_DIR}/AppIcon-1024.png" "${ICON_DIR}/AppIcon-512@2x.png"
    
    echo "✅ Placeholder icons created at ${ICON_DIR}/"
    echo "⚠️  Remember to replace these with your actual app icons!"
else
    echo "⚠️  ImageMagick not found. Please create app icons manually:"
    echo "   1. Create a 1024x1024 PNG icon"
    echo "   2. Save it as: ${ICON_DIR}/AppIcon-1024.png"
    echo "   3. Also save as: ${ICON_DIR}/AppIcon-512@2x.png"
    echo ""
    echo "   You can use online tools like:"
    echo "   - https://www.appicon.co"
    echo "   - https://appicon.build"
fi
