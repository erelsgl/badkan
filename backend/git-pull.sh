FOLDERNAME=$1
EXFOLDER=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/../exercises/$FOLDERNAME

git fetch

git checkout HEAD $EXFOLDER

git pull



