#!/bin/bash
# SIARM Backend Server Starter
# Starts PHP development server for the API

echo "Starting SIARM Backend API Server..."
echo "API will be available at: http://localhost:8000/api"
echo "Press Ctrl+C to stop"

cd "$(dirname "$0")/backend/api"
php -S 0.0.0.0:8000