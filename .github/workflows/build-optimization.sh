#!/bin/bash

# Build optimization script for faster GitHub Pages deployments
# This script runs before the main build to optimize the process

set -e

echo "🚀 Starting build optimization..."

# Clean previous build artifacts
echo "🧹 Cleaning previous build artifacts..."
rm -rf dist/
rm -rf node_modules/.astro/
rm -rf .astro/

# Create optimized npm cache
echo "📦 Setting up optimized npm cache..."
npm cache clean --force
npm ci --prefer-offline --no-audit

# Pre-warm Astro cache
echo "⚡ Pre-warming Astro cache..."
npm run astro check --help > /dev/null 2>&1 || true

# Optimize for static generation
echo "🔧 Optimizing for static generation..."
export ASTRO_OPTIMIZER=true
export NODE_OPTIONS="--max-old-space-size=4096"

echo "✅ Build optimization completed!"
echo ""
echo "Build environment:"
echo "- Node version: $(node --version)"
echo "- NPM version: $(npm --version)"
echo "- Available memory: $(node -e "console.log(Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB')" 2>/dev/null || echo "Unknown")"
echo "- Platform: $(uname -a)"
echo ""
