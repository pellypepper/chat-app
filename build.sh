#!/bin/bash

echo "🚀 Starting monorepo build process..."

# Clean previous builds and lock files
echo "🧹 Cleaning previous builds and lock files..."
rm -rf dist
rm -rf backend/dist
rm -rf frontend/.next
rm -rf frontend/dist
rm -f package-lock.json
rm -f backend/package-lock.json  
rm -f frontend/package-lock.json

# Install root dependencies first to establish version resolutions
echo "📦 Installing root dependencies..."
npm install --no-package-lock

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --no-package-lock
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --no-package-lock
cd ..

# Build backend
echo "🔧 Building backend..."
cd backend
npm run build
cd ..

# Verify backend build
if [ ! -d "backend/dist" ]; then
    echo "❌ Backend build failed - dist directory not found"
    exit 1
fi

echo "✅ Backend build complete. Contents:"
ls -la backend/dist/

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm run build
cd ..

# Verify frontend build
if [ ! -d "frontend/.next" ]; then
    echo "❌ Frontend build failed - .next directory not found"
    exit 1
fi

echo "✅ Frontend build complete"

# Build server
echo "🖥️ Building server..."
npm run build:server

# Verify server build
if [ ! -f "dist/server.js" ]; then
    echo "❌ Server build failed - dist/server.js not found"
    exit 1
fi

echo "✅ Server build complete"

echo "🎉 Build process completed successfully!"
echo "📁 File structure:"
echo "Root dist:"
ls -la dist/ 2>/dev/null || echo "No root dist"
echo "Backend dist:"
ls -la backend/dist/ 2>/dev/null || echo "No backend dist"
echo "Frontend .next:"
ls -la frontend/.next/ 2>/dev/null || echo "No frontend .next"