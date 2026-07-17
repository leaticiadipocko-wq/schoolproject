#!/bin/bash
cd /home/daytona/project
pkill -f "node.*mock-api" 2>/dev/null
pkill -f "node.*vite" 2>/dev/null
pkill -f "mock-api" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1
mkdir -p /tmp/logs
nohup node scripts/mock-api.mjs </dev/null >/tmp/logs/mock-api.log 2>&1 &
nohup npx vite --port 5173 --host 0.0.0.0 </dev/null >/tmp/logs/vite-dev.log 2>&1 &
disown -a 2>/dev/null
echo "Servers started"
