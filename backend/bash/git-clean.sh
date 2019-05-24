FOLDERNAME=$1
SUBFOLDER=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


echo $FOLDERNAME
echo $SUBFOLDER

cp -a $DIR/../../exercises/$FOLDERNAME/$SUBFOLDER/. $DIR/../../exercises/$FOLDERNAME/
rm -r $DIR/../../exercises/$FOLDERNAME/$SUBFOLDER/

cd $DIR/../../exercises/$FOLDERNAME 
chmod +x grade






