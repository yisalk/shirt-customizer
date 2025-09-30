#!/bin/bash

echo "🔍 Checking SuitSupply Application Status..."
echo ""

# Check if ports are in use
echo "📡 Checking servers..."

# Check Vite (port 5173)
if lsof -i :5173 >/dev/null 2>&1; then
    echo "✅ Vite (Frontend) is running on port 5173"
    VITE_RUNNING=true
else
    echo "❌ Vite (Frontend) is NOT running on port 5173"
    VITE_RUNNING=false
fi

# Check JSON Server (port 3001)
if lsof -i :3001 >/dev/null 2>&1; then
    echo "✅ JSON Server (API) is running on port 3001"
    API_RUNNING=true
else
    echo "❌ JSON Server (API) is NOT running on port 3001"
    API_RUNNING=false
fi

echo ""

# Test API endpoints
if [ "$API_RUNNING" = true ]; then
    echo "🧪 Testing API endpoints..."
    
    # Test products endpoint
    if curl -s http://localhost:3001/products >/dev/null 2>&1; then
        echo "✅ Products API is working"
    else
        echo "❌ Products API is not responding"
    fi
    
    # Test users endpoint
    if curl -s http://localhost:3001/users >/dev/null 2>&1; then
        echo "✅ Users API is working"
    else
        echo "❌ Users API is not responding"
    fi
else
    echo "⚠️  Cannot test API - server not running"
fi

echo ""

# Test frontend
if [ "$VITE_RUNNING" = true ]; then
    echo "🧪 Testing frontend..."
    
    if curl -s http://localhost:5173 >/dev/null 2>&1; then
        echo "✅ Frontend is responding"
    else
        echo "❌ Frontend is not responding"
    fi
else
    echo "⚠️  Cannot test frontend - server not running"
fi

echo ""

# Overall status
if [ "$VITE_RUNNING" = true ] && [ "$API_RUNNING" = true ]; then
    echo "🎉 Application is fully running!"
    echo "🌐 Open http://localhost:5173 in your browser"
    echo "📝 Demo login: john.doe@example.com / password123"
else
    echo "⚠️  Application is not fully running"
    echo "💡 Run './start.sh' to start both servers"
fi
