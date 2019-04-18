
FOLDERNAME=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ ! -d $FOLDERNAME ]; then
    echo "! mkdir $FOLDERNAME"
    mkdir $FOLDERNAME
else
    rm -r $FOLDERNAME
    mkdir $FOLDERNAME
fi

cd $DIR/$FOLDERNAME
unzip -j ../../backend/$1 -x *.git*
sudo rm ../../backend/$1 
# sudo chmod +x grade # Check what's happen here.
