#!/bin/bash
# Auto-start and watchdog for SIARM production server
# Run this script in init.scope cgroup for persistence

SERVE_SCRIPT="/home/daytona/project/scripts/serve.mjs"
LOG_DIR="/tmp/logs"
mkdir -p "$LOG_DIR"

ensure_server() {
  if ! curl -sf http://localhost:4173/ > /dev/null 2>&1; then
    echo "[$(date)] Server down, restarting..." >> "$LOG_DIR/watchdog.log"
    cd /home/daytona/project
    nohup node "$SERVE_SCRIPT" >> "$LOG_DIR/serve.log" 2>&1 &
    SPID=$!
    # Move to init.scope for persistence
    echo "$SPID" > /sys/fs/cgroup/init.scope/cgroup.procs 2>/dev/null
    echo "[$(date)] Restarted server with PID $SPID" >> "$LOG_DIR/watchdog.log"
  fi
}

# Build on start
cd /home/daytona/project
npm run build >> "$LOG_DIR/build.log" 2>&1
echo "[$(date) Build complete]" >> "$LOG_DIR/watchdog.log"

ensure_server

# Monitor loop
while true; do
  ensure_server
  sleep 30
done