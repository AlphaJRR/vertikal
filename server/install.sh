#!/bin/bash

# VERTIKAL Server Installation Script

echo "🚀 VERTIKAL Server Setup"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo ""
    echo "Please install Node.js 18+ first:"
    echo "  - macOS: brew install node"
    echo "  - Or download from: https://nodejs.org/"
    echo ""
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env and set your DATABASE_URL"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
echo "⚠️  Make sure your DATABASE_URL in .env is correct"
echo ""
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Please check your DATABASE_URL in .env"
    exit 1
fi

echo "✅ Database migrations completed"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run prisma:seed

if [ $? -ne 0 ]; then
    echo "⚠️  Seed failed (this is okay if database already has data)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env and set your DATABASE_URL"
echo "  2. Run: npm run dev"
echo ""


