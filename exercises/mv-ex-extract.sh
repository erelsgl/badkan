FOLDERNAME=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

mkdir $1
cd $DIR/$1
unzip -j ../../backend/$1 -x *.git*
rm ../../backend/$1 

