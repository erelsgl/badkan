EX=$1
INFO=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

for val in $INFO; do
    docker cp badkan:/submissions/$val/$EX $val
done

cd $DIR
zip -r $EX.zip $INFO

for val in $INFO; do
    rm -r $val
done
