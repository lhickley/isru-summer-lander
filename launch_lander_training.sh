#!/bin/bash

# Mars Lander ISRU Mission Control Launch Sequence
echo "🚀 MARS LANDER ISRU MISSION CONTROL SYSTEM v2.1.3"
echo "════════════════════════════════════════════════════"
echo "📡 NASA Mars Exploration Program - ISRU Division"
echo "🔬 In-Situ Resource Utilization Landing Simulator"
echo ""

# Pre-flight checks
echo "⚡ INITIATING PRE-FLIGHT SYSTEM CHECKS..."
echo "   ✓ Checking mission directory structure..."
if [ ! -f "index.html" ]; then
    echo "   ❌ CRITICAL ERROR: Mission files not found in current directory"
    echo "   📂 Please navigate to mars-lander-isru mission folder"
    exit 1
fi
echo "   ✓ Mission files verified"

echo "   ✓ Scanning for port conflicts on communication channel 8000..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
echo "   ✓ Communication channel cleared"

echo "   ✓ Verifying Python mission control systems..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "   ❌ ABORT: Python mission control system not available"
    exit 1
fi
echo "   ✓ Python mission control operational ($PYTHON_CMD)"

echo ""
echo "🛰️  LAUNCHING MISSION CONTROL SERVER..."
echo "   📊 Initializing HTTP communication protocols..."
echo "   🌐 Establishing server on Mission Control Port 8000..."
$PYTHON_CMD -m http.server 8000 > mission_control.log 2>&1 &
SERVER_PID=$!

echo "   ⏱️  Allowing systems to stabilize..."
sleep 3

# System verification
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "   ✅ MISSION CONTROL SERVER ONLINE"
    echo "   📡 Server Process ID: $SERVER_PID"
    echo "   🔗 Communication established on localhost:8000"
else
    echo "   ❌ CRITICAL FAILURE: Mission Control server failed to initialize"
    exit 1
fi

echo ""
echo "🎯 MARS LANDER MISSION PARAMETERS:"
echo "   🌍 Launch Site: Earth (Local Development Environment)"
echo "   🔴 Target: Mars Surface Landing Zones"
echo "   ⛽ Fuel Management: Critical Resource Optimization Required"
echo "   🎛️  Flight Controls: Arrow Key Navigation System"
echo "   📍 Primary Objective: ISRU-1 Landing Zone Deployment"
echo "   📍 Secondary Objectives: LZ-Alpha, LZ-Beta Safe Landing"
echo ""

echo "🚁 DEPLOYING MISSION INTERFACE..."
echo "   🖥️  Launching primary mission display..."

# Open the game in the default browser
if command -v open > /dev/null; then
    # macOS
    open http://localhost:8000
elif command -v xdg-open > /dev/null; then
    # Linux
    xdg-open http://localhost:8000
elif command -v start > /dev/null; then
    # Windows (Git Bash/WSL)
    start http://localhost:8000
else
    echo "   📱 Manual Navigation Required: http://localhost:8000"
fi

echo "   ✅ MISSION INTERFACE DEPLOYED"
echo ""
echo "🎮 FLIGHT CONTROL SYSTEMS ACTIVE"
echo "   ↑ Primary Thruster: Counteract Mars gravitational pull"
echo "   ← → RCS Thrusters: Lateral navigation and attitude control"
echo ""
echo "🏗️  ISRU EQUIPMENT STATUS: READY FOR DEPLOYMENT"
echo "   🟢 ISRU-1 Zone: Optimal resource extraction site"
echo "   🟡 LZ-Alpha: Backup landing site"
echo "   🟡 LZ-Beta: Emergency landing site"
echo ""
echo "📊 MISSION CONTROL LOG ACTIVE"
echo "   Mission Control PID: $SERVER_PID"
echo "   Terminate mission: Ctrl+C or kill $SERVER_PID"
echo "════════════════════════════════════════════════════"

# Keep script running and show server logs
echo "📡 REAL-TIME MISSION TELEMETRY:"
tail -f mission_control.log
