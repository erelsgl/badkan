FOLDERNAME=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/..

echo "! bash create-ex.sh $FOLDERNAME"
bash create-ex.sh $FOLDERNAME

echo "bash cp-grade.sh $FOLDERNAME"
bash cp-grade.sh $FOLDERNAME
