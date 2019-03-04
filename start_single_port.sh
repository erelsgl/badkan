#!/usr/bin/env bash
#
# Start all three parts of badkan (docker, backend and frontend).
# Each part uses a single port.
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 1. Start the docker process:
cd $DIR
sudo docker run --name badkan --rm -itd erelsgl/badkan bash

# 2. Start the backend server:
cd $DIR/backend
sudo rm -f nohup.out
sudo nohup python3 -u server.py 5670 &
# -u = unbuffered. See https://stackoverflow.com/a/107717/827927

# 3. Start the frontend server:
cd $DIR/frontend
sudo rm -f nohup.out
sudo nohup python3 -u -m http.server 8000 &
# -u = unbuffered. See https://stackoverflow.com/a/107717/827927

echo "Try me at: lynx http://localhost:8000?backend=5670"
