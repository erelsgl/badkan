#!bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

sudo killall -9 python3 2>/dev/null

cd $DIR
bash $DIR/backend.sh
bash $DIR/frontend.sh
sudo docker run --name badkan -p 8010:8010 --rm -itd erelsgl/badkan bash 

