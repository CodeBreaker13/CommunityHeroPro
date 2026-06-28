#!/bin/bash
# Community Hero — One-click start script

echo "🦸 Starting Community Hero..."

# Start backend
echo "▶ Starting Flask backend on :5000"
cd backend
pip install -r requirements.txt -q
python app.py &
BACKEND_PID=$!

# Start frontend
echo "▶ Starting React frontend on :3000"
cd ../frontend
npm install --silent
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Community Hero is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
