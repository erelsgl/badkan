DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

sudo killall -9 python3 2>/dev/null
cd $DIR/../backend; sudo gnome-terminal -- python3 -u server.py 5670 &
cd $DIR/../backend; sudo gnome-terminal -- python3 -u file_server.py 9000 &
cd $DIR/../frontend; sudo gnome-terminal -- python3 -u -m http.server 8000 &

