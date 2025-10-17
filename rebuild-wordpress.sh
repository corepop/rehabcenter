#!/bin/bash

# WordPress Content Rebuild Script
# Simple script to rebuild the site with latest WordPress content

echo "🔄 WordPress Headless CMS Rebuild"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📡 Fetching latest content from WordPress..."
echo "   Source: https://rygg.nu/blogg/wordpress/"
echo ""

# Run the build process
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Upload the contents of the 'dist/' folder to your web server"
    echo "   2. Your new WordPress posts will be live immediately"
    echo ""
    echo "📁 Generated files are in: ./dist/"
    echo "📝 Check ./dist/blogg/ for your WordPress posts"
else
    echo ""
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi
