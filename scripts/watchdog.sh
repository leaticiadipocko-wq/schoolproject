#!/bin/bash
# SIARM watchdog — keeps both servers alive
SERVE_PID=""
VITE_PID=""

while true; do
  # Check serve.mjs (mock API on port 4173)
  if ! curl -sf http://localhost:4173/ > /dev/null 2>&1; then
    pkill -f "serve.mjs" 2>/dev/null
    cd /home/daytona/project && node scripts/serve.mjs > /tmp/logs/serve.log 2>&1 &
    SERVE_PID=$!
    echo "[watchdog] Restarted serve.mjs (PID $SERVE_PID)" >> /tmp/logs/watchdog.log
  fi

  # Check Vite dev server (port 5173)
  if ! curl -sf http://localhost:5173/ > /dev/null 2>&1; then
    pkill -f "vite" 2>/dev/null
    cd /home/daytona/project && npx vite --host 0.0.0.0 --port 5173 > /tmp/logs/vite.log 2>&1 &
    VITE_PID=$!
    echo "[watchdog] Restarted Vite (PID $VITE_PID)" >> /tmp/logs/watchdog.log
  fi

  sleep 15
done