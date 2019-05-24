FOLDERNAME=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR

sudo chmod +x grade # Check what's happen here.

mv grade $DIR/../exercises/$FOLDERNAME/

