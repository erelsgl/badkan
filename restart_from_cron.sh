#!/usr/bin/env bash

FRONTEND_PORT=$1
FRONTEND_Test_PORT=$2

sudo killall python3

# 1. Start the backend server:
cd backend
sudo rm nohup.out
sudo python3 -u server.py > nohup.out &

# 2. Start the frontend server:
cd ../frontend
sudo rm nohup.out
sudo python3 -u -m http.server $FRONTEND_PORT > nohup.out &
# -u = unbuffered. See https://stackoverflow.com/a/107717/827927

cd Test
sudo rm nohup.out
sudo python3 -u -m http.server $FRONTEND_Test_PORT > nohup.out &
