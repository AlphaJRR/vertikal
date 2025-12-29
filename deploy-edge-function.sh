#!/bin/bash
# Deploy Supabase Edge Function

set -e

echo "🚀 Deploying Supabase Edge Function: signup"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in. Please run: supabase login"
    exit 1
fi

# Check if project is linked
if [ ! -f "supabase/config.toml" ]; then
    echo "⚠️  Project not linked. Linking..."
    supabase link --project-ref vuwawtzhhcarckybdgbd
fi

# Deploy function
echo "📤 Deploying signup function..."
supabase functions deploy signup

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Supabase Dashboard"
echo "2. Test signup flow"
echo "3. Verify Zapier webhook"
