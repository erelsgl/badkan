#!/usr/bin/env bash
# This script should run as root since the servers use docker.

FRONTEND_PORT=$1
if [ -z "$FRONTEND_PORT" ]; then
   FRONTEND_PORT=80
fi

# 1. Start the docker process:
docker run --name badkan --rm -itd erelsgl/badkan bash

# 2. Start the backend server:
cd backend
rm nohup.out
nohup python3 server.py &

# 2. Start the frontend server:
cd ../frontend
rm nohup.out
nohup python3 -m http.server $FRONTEND_PORT &
echo "Try me by: lynx http://localhost:$FRONTEND_PORT"
