#!/bin/bash
# Netlify Environment Variables Setup Script
# EVAN: Run this after setting env vars in Netlify dashboard

echo "🚀 NETLIFY DEPLOYMENT CHECKLIST"
echo "=================================="
echo ""
echo "✅ STEP 1: Set Environment Variables in Netlify"
echo "   Go to: Netlify Dashboard → Site Settings → Environment Variables"
echo ""
echo "   Add these two variables:"
echo "   • ABOUT_VIDEO_EMBED_URL = https://www.youtube.com/embed/Bz_ibyq0ATs"
echo "   • FOUNDING50_VIDEO_EMBED_URL = https://www.youtube.com/embed/_koZVzaT34A"
echo ""
echo "✅ STEP 2: Trigger Deploy"
echo "   Option A: Push to main branch (auto-deploy)"
echo "   Option B: Manual deploy in Netlify dashboard"
echo ""
echo "✅ STEP 3: Verify Deployment"
echo "   • Check deploy logs for env vars"
echo "   • Test landing page videos"
echo "   • Screenshot env vars list (proof)"
echo ""
echo "📋 Current Git Status:"
git status --short
echo ""
echo "✅ Ready to commit and push:"
echo "   git add ."
echo "   git commit -m 'feat: add video embeds and scroll fix'"
echo "   git push origin main"
echo ""

