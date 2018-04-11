#!/usr/bin/env bash

FRONTEND_PORT=$1
if [ -z "$FRONTEND_PORT" ]; then
   FRONTEND_PORT=80
fi

# NOTE: the backend port is set in backend/server.py.
# It is identical to the port in frontend/index.html.
# Initially it was 5678.

# 1. Start the docker process:
sudo docker run --name badkan --rm -itd erelsgl/badkan bash

# 2. Start the backend server:
cd backend
sudo rm nohup.out
sudo nohup python3 server.py &

# 2. Start the frontend server:
cd ../frontend
sudo rm nohup.out
sudo nohup python3 -m http.server $FRONTEND_PORT &
echo "Try me by: lynx http://localhost:$FRONTEND_PORT"
