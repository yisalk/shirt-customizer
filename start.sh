#!/bin/bash

echo "🚀 Starting SuitSupply E-commerce Application..."
echo ""

# Kill any existing processes
echo "🔄 Stopping existing processes..."
pkill -f "vite\|json-server" 2>/dev/null || true

# Wait a moment
sleep 2

# Start JSON Server
echo "📡 Starting JSON Server (API) on port 3001..."
npx json-server --watch data/db.json --port 3001 &
API_PID=$!

# Wait for API to start
sleep 3

# Start Vite
echo "⚡ Starting Vite (Frontend) on port 5173..."
npm run dev &
VITE_PID=$!

# Wait for both to start
sleep 5

echo ""
echo "✅ Application is running!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 API: http://localhost:3001"
echo ""
echo "📝 Demo Credentials:"
echo "   Email: john.doe@example.com"
echo "   Password: password123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait
