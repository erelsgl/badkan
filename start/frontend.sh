#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/../frontend
sudo rm -f nohup.out
sudo nohup nice -n -5 python3 -u -m http.server 8000 &
