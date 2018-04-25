#!/usr/bin/env bash

FRONTEND_PORT=$1
FRONTEND_Test_PORT=$2

if [ -z "$FRONTEND_PORT" ]; then
   FRONTEND_PORT=80
fi

# 1. Start the docker process:
sudo docker run --name badkan --rm -itd erelsgl/badkan bash

# 2. Start the backend server:
cd backend
sudo rm nohup.out
sudo nohup python3 -u server.py 5670 &
sudo nohup python3 -u server.py 5671 &
sudo nohup python3 -u server.py 5672 &
sudo nohup python3 -u server.py 5673 &
sudo nohup python3 -u server.py 5674 &
sudo nohup python3 -u server.py 5675 &
sudo nohup python3 -u server.py 5676 &
sudo nohup python3 -u server.py 5677 &
sudo nohup python3 -u server.py 5678 &
sudo nohup python3 -u server.py 5679 &
# -u = unbuffered. See https://stackoverflow.com/a/107717/827927

# 2. Start the frontend server:
cd ../frontend
sudo rm nohup.out
sudo nohup python3 -u -m http.server $FRONTEND_PORT &
# -u = unbuffered. See https://stackoverflow.com/a/107717/827927

cd Test
sudo rm nohup.out
sudo nohup python3 -u -m http.server $FRONTEND_Test_PORT &

echo "Try me by: lynx http://localhost:$FRONTEND_PORT"
