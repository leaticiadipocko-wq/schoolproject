#!/bin/bash
# SIARM unified start — production build + built-in API on a single port.
# Visit http://localhost:4173 to use the app.
cd "$(dirname "$0")"
pkill -f "node.*serve\.mjs" 2>/dev/null
pkill -f "node.*mock-api" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1
mkdir -p /tmp/logs
# Build if dist is missing or stale
if [ ! -f dist/index.html ] || [ src/pages -nt dist/index.html ] 2>/dev/null; then
  npm run build >/tmp/logs/build.log 2>&1
fi
nohup node scripts/serve.mjs >/tmp/logs/prod-server.log 2>&1 &
echo "✓ SIARM production server started on http://localhost:4173"
