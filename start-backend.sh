#!/bin/bash
# SIARM API Server Starter
# Starts the built-in mock API server (no PHP or database required)

echo "Starting SIARM Mock API Server..."
echo "API available at: http://localhost:8000/api"
echo "Press Ctrl+C to stop"

cd "$(dirname "$0")"
node scripts/mock-api.mjs