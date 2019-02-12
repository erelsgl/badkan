#!/usr/bin/env bash

# 1. Start the docker process:
PORT_EXPOSED_FROM_DOCKER=8010
sudo docker run --name badkan -p $PORT_EXPOSED_FROM_DOCKER:$PORT_EXPOSED_FROM_DOCKER --rm -itd erelsgl/badkan bash
# Start the http server from within docker (optional):
#sudo docker exec badkan bash -c "cd /www; python3 -u -m http.server $PORT_EXPOSED_FROM_DOCKER" &

# 2. Start the backend server:
cd backend
sudo rm nohup.out
sudo python3 -u server.py 5670 &
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

# 3. Start the frontend server:
cd ../frontend
sudo rm nohup.out
sudo python3 -u -m http.server 8000 &
sudo nohup python3 -u -m http.server 8001 &
sudo nohup python3 -u -m http.server 8002 &
sudo nohup python3 -u -m http.server 8003 &
sudo nohup python3 -u -m http.server 8004 &
sudo nohup python3 -u -m http.server 8005 &
sudo nohup python3 -u -m http.server 8006 &
sudo nohup python3 -u -m http.server 8007 &
sudo nohup python3 -u -m http.server 8008 &
sudo nohup python3 -u -m http.server 8009 &
# -u = unbuffered. See https://stackoverflow.com/a/107717/827927

echo "Try me at: lynx http://localhost:8000?backend=5670"
