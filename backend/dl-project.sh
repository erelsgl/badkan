EX=$1
USER=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker cp badkan:/submissions/$USER/$EX $USER

cd $DIR
zip -r $USER.zip $USER

rm -r $USER

