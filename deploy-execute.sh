#!/bin/bash
# Execute Deployment - Run this script

set -e

echo "🚀 VERTIKAL DEPLOYMENT EXECUTION"
echo "================================"
echo ""

# Check if GitHub Desktop is available
if command -v github &> /dev/null || [ -d "/Applications/GitHub Desktop.app" ]; then
    echo "✅ GitHub Desktop detected"
    echo ""
    echo "Opening GitHub Desktop..."
    open -a "GitHub Desktop" 2>/dev/null || echo "Please open GitHub Desktop manually"
    echo ""
    echo "INSTRUCTIONS:"
    echo "1. In GitHub Desktop, select 'vertikal' repository"
    echo "2. Click 'Push origin' button"
    echo "3. Enter your GitHub credentials"
    echo "4. Wait for push to complete"
    echo ""
    echo "After push, monitor deployment at:"
    echo "https://github.com/AlphaJRR/vertikal/actions"
    echo ""
else
    echo "GitHub Desktop not found. Using terminal method..."
    echo ""
    echo "To deploy via terminal:"
    echo "1. Create GitHub PAT: https://github.com/settings/tokens"
    echo "2. Run: git push https://AlphaJRR:YOUR_PAT@github.com/AlphaJRR/vertikal.git main"
    echo ""
fi

# Show current status
echo "Current Status:"
echo "  Commits ready: $(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')"
echo "  Sites ready: $(ls -d public public/*/ 2>/dev/null | wc -l | tr -d ' ')"
echo ""
echo "✅ Ready to deploy!"
