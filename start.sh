#!/usr/bin/env bash
# This script should run as root since the servers use docker.

FRONTEND_PORT=$1

cd backend
nohup python3 server.py &

cd ../frontend
nohup python3 -m http.server FRONTEND_PORT &
