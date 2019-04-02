#!/usr/bin/env bash

sudo killall python3

# 1. Start the backend server:
cd backend
sudo rm nohup.out
sudo python3 -u server.py 5670 > nohup.out &
sudo python3 -u server.py 5671 > nohup.out &
sudo python3 -u server.py 5672 > nohup.out&
sudo python3 -u server.py 5673 > nohup.out&
sudo python3 -u server.py 5674 > nohup.out&
sudo python3 -u server.py 5675 > nohup.out&
sudo python3 -u server.py 5676 > nohup.out&
sudo python3 -u server.py 5677 > nohup.out&
sudo python3 -u server.py 5678 > nohup.out&
sudo python3 -u server.py 5679 &

# 2. Start the frontend server:
cd ../frontend
sudo rm nohup.out
sudo python3 -u -m http.server $FRONTEND_PORT > nohup.out &
# -u = unbuffered. See https://stackoverflow.com/a/107717/827927

cd Test
sudo rm nohup.out
sudo python3 -u -m http.server 8000 > nohup.out&
sudo python3 -u -m http.server 8001 > nohup.out&
sudo python3 -u -m http.server 8002 > nohup.out&
sudo python3 -u -m http.server 8003 > nohup.out&
sudo python3 -u -m http.server 8004 > nohup.out&
sudo python3 -u -m http.server 8005 > nohup.out&
sudo python3 -u -m http.server 8006 > nohup.out&
sudo python3 -u -m http.server 8007 > nohup.out&
sudo python3 -u -m http.server 8008 > nohup.out&
sudo python3 -u -m http.server 8009 > nohup.out&

sudo docker exec badkan bash -c 'cd /www; python3 -u -m http.server 8010'

