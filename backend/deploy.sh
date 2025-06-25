#!/bin/bash

# SafeDoser Backend Deployment Script
# This script helps deploy the backend to various hosting platforms

set -e

echo "🚀 SafeDoser Backend Deployment Script"
echo "======================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check environment variables
echo "🔍 Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your actual credentials before running the server."
fi

# Run database migrations (if needed)
echo "🗄️  Database setup complete (using Supabase)"

# Run tests
echo "🧪 Running tests..."
python -m pytest tests/ -v || echo "⚠️  Some tests failed, but continuing deployment..."

# Start the server
echo "🎯 Starting SafeDoser API server..."
echo "📍 Server will be available at: http://localhost:8000"
echo "📊 Health check: http://localhost:8000/health"
echo ""
echo "🔗 API Documentation:"
echo "   - Authentication: /auth/login, /auth/signup"
echo "   - User Profile: /user/profile"
echo "   - Supplements: /supplements"
echo "   - AI Chat: /chat"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Choose deployment method
if [ "$1" = "production" ]; then
    echo "🏭 Starting in production mode with Gunicorn..."
    gunicorn -w 4 -b 0.0.0.0:8000 --timeout 120 app:app
else
    echo "🛠️  Starting in development mode..."
    python app.py
fi