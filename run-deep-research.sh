#!/bin/bash

# Deep Research AI Company Data Generation Script
# This script runs the comprehensive AI company data generation process

echo "🚀 Starting Deep Research AI Company Data Generation"
echo "📊 Target: 200+ AI Companies with Complete English Content"
echo "🔬 Method: Deep Research with DeepSeek -> OpenAI -> Qwen Fallback"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if the generator script exists
if [ ! -f "deep-research-generator.js" ]; then
    echo "❌ deep-research-generator.js not found. Please ensure the file exists."
    exit 1
fi

# Check environment variables
echo "🔍 Checking environment variables..."
if [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "⚠️  DEEPSEEK_API_KEY not set. Using fallback to OpenAI."
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set. Using fallback to Qwen."
fi

if [ -z "$QWEN_API_KEY" ]; then
    echo "⚠️  QWEN_API_KEY not set. DeepSeek and OpenAI must be configured."
fi

echo ""

# Step 1: Prepare database
echo "📋 Step 1: Preparing database..."
echo "Please run the following SQL script in Supabase SQL Editor:"
echo "   prepare-database-for-deep-research.sql"
echo ""
read -p "Press Enter after running the SQL script to continue..."

# Step 2: Run the deep research generator
echo "🔬 Step 2: Running deep research generator..."
echo "This will take approximately 2-4 hours for 200+ companies."
echo "Each company requires 4 API calls (details, tools, funding, news)."
echo ""

read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Generation cancelled."
    exit 0
fi

# Run the generator
echo "🚀 Starting generation process..."
node deep-research-generator.js

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deep Research Generation Complete!"
    echo "📄 Check deep-research-generation-report.json for detailed results."
    echo ""
    echo "Next steps:"
    echo "1. Verify data in Supabase dashboard"
    echo "2. Check frontend at https://leiao.ai/ai-companies"
    echo "3. Review generated content quality"
else
    echo ""
    echo "❌ Generation failed. Check the error messages above."
    echo "Common issues:"
    echo "- API key configuration"
    echo "- Network connectivity"
    echo "- Rate limiting"
    echo "- Database connection"
fi
