#!/bin/bash
#
# Quick Git Setup Script for LeiaoAI Platform
# This script prepares your deployment package for GitHub upload
#

echo "============================================================"
echo "🚀 LeiaoAI Platform - Quick Git Setup"
echo "============================================================"
echo ""

DEPLOYMENT_DIR="deployment-package"

# Check if deployment directory exists
if [ ! -d "$DEPLOYMENT_DIR" ]; then
    echo "❌ Error: deployment-package directory not found"
    echo "   Please ensure you're in the workspace directory"
    exit 1
fi

echo "📁 Navigating to deployment directory..."
cd "$DEPLOYMENT_DIR" || exit 1

echo "🔧 Initializing Git repository..."
git init

echo "📝 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/
pnpm-lock.yaml

# Build output
dist/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage/

# Temporary files
tmp/
temp/
*.tmp
EOF

echo "✅ .gitignore created"

echo "📦 Adding files to Git..."
git add -A

echo "💾 Creating initial commit..."
git commit -m "🚀 Initial commit: Complete LeiaoAI Platform restoration with 13 languages, AI Chat, and professional services"

echo ""
echo "============================================================"
echo "✅ Git Repository Ready!"
echo "============================================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create GitHub repository:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: leiaoai-story-platform"
echo "   - Create repository"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/leiaoai-story-platform.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Visit: https://vercel.com/new"
echo "   - Import the GitHub repository"
echo "   - Configure as per VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
echo "============================================================"
echo ""
echo "📖 Full instructions: ../VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
