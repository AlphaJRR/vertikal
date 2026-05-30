#!/bin/bash
# Export all AVA Media code files for review
# Creates a comprehensive code review package

REVIEW_DIR="code-review-package"
mkdir -p "$REVIEW_DIR"

echo "📦 Creating code review package..."
echo ""

# Copy all source files
echo "📁 Copying source files..."
mkdir -p "$REVIEW_DIR/src"
cp -r src/* "$REVIEW_DIR/src/"

# Copy configuration files
echo "⚙️  Copying configuration files..."
cp index.html "$REVIEW_DIR/"
cp vite.config.ts "$REVIEW_DIR/"
cp capacitor.config.ts "$REVIEW_DIR/"
cp package.json "$REVIEW_DIR/"
cp tsconfig.json "$REVIEW_DIR/" 2>/dev/null || true

# Copy iOS configuration
echo "📱 Copying iOS configuration..."
mkdir -p "$REVIEW_DIR/ios-config"
cp ios/App/App/Info.plist "$REVIEW_DIR/ios-config/" 2>/dev/null || true

# Create file listing
echo "📋 Creating file listing..."
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) | sort > "$REVIEW_DIR/file-list.txt"

# Create summary
cat > "$REVIEW_DIR/REVIEW_SUMMARY.md" << 'EOF'
# AVA Media Code Review Summary

## File Count
EOF

echo "- **TypeScript/TSX Files:** $(find src -name "*.tsx" -o -name "*.ts" | wc -l | xargs)" >> "$REVIEW_DIR/REVIEW_SUMMARY.md"
echo "- **CSS Files:** $(find src -name "*.css" | wc -l | xargs)" >> "$REVIEW_DIR/REVIEW_SUMMARY.md"
echo "- **Total Source Files:** $(find src -type f | wc -l | xargs)" >> "$REVIEW_DIR/REVIEW_SUMMARY.md"

cat >> "$REVIEW_DIR/REVIEW_SUMMARY.md" << 'EOF'

## Key Areas to Review

1. **Data Structure** - `src/data/`
2. **Components** - `src/components/`
3. **Pages** - `src/pages/`
4. **Context/State** - `src/context/`
5. **Configuration** - Root level config files

## Quick Review Commands

```bash
# Check TypeScript errors
npx tsc --noEmit

# Build the app
npm run build:web

# View file structure
cat file-list.txt
```

EOF

echo ""
echo "✅ Code review package created in: $REVIEW_DIR/"
echo ""
echo "📋 Files included:"
echo "   - All source files (src/)"
echo "   - Configuration files"
echo "   - File listing (file-list.txt)"
echo "   - Review summary (REVIEW_SUMMARY.md)"
echo ""
echo "🔍 Next steps:"
echo "   1. Review all files in $REVIEW_DIR/"
echo "   2. Check for any issues or improvements"
echo "   3. Run: npm run build:web (to verify build)"
echo "   4. Run: npx tsc --noEmit (to check types)"
echo ""
