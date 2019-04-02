#!/usr/bin/env bash
#
# Restart the badkan backend and frontend.
#
# Credit:   https://stackoverflow.com/a/107717/827927
#           [for the explanation that -u = unbuffered]
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 1. Kill the running backend and frontend (ignore errors if they are not running):
sudo killall -9 python3 2>/dev/null

# 2. Start the backend server:
cd $DIR/../backend
sudo rm -f nohup.out
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

# 3. Start the frontend server:
cd $DIR/../frontend
sudo rm -f nohup.out
sudo nohup nice -n -5 python3 -u -m http.server 8000 &
# sudo nohup python3 -u -m http.server 8001 &
# sudo nohup python3 -u -m http.server 8002 &
# sudo nohup python3 -u -m http.server 8003 &
# sudo nohup python3 -u -m http.server 8004 &
# sudo nohup python3 -u -m http.server 8005 &
# sudo nohup python3 -u -m http.server 8006 &
# sudo nohup python3 -u -m http.server 8007 &
# sudo nohup python3 -u -m http.server 8008 &
# sudo nohup python3 -u -m http.server 8009 &

echo "Try me at: lynx http://localhost:8000"
