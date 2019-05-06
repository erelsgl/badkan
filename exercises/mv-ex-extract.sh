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
unzip -j ../../backend/$FOLDERNAME -x *.git*
sudo rm ../../backend/$FOLDERNAME 
if [ -d "grade" ]; then
	sudo chmod +x grade # Check what's happen here.
fi
