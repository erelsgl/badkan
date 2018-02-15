#!/usr/bin/env bash
# This script should run as root since the servers use docker.

FRONTEND_PORT=$1
if [ -z "$FRONTEND_PORT" ]; then
   FRONTEND_PORT=80
fi

cd backend
nohup python3 server.py &

cd ../frontend
nohup python3 -m http.server FRONTEND_PORT &
echo "Try me by: lynx http://localhost:80"
