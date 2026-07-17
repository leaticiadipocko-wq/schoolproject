#!/bin/bash
cd /home/daytona/project
kill -9 $(ps aux | grep -E "mock-api|vite" | grep -v grep | awk '{print $2}') 2>/dev/null
sleep 1
rm -f /tmp/logs/mock-api.log /tmp/logs/vite-dev.log
node scripts/mock-api.mjs > /tmp/logs/mock-api.log 2>&1 &
npx vite --port 5173 --host 0.0.0.0 > /tmp/logs/vite-dev.log 2>&1 &
echo "Servers started"
