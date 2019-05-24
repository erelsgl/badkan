#!/usr/bin/env bash
# INPUT: the exercise id and the array info including the following items: "user_id/username".
# ACTION: Move all the project for a given exercise and zip it.

export EXID=$1 # The firebase id of the exercise.
export INFO=$2 # INFO is an array like "user_id/username"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "! cd $DIR/.."
cd $DIR/..

for val in $INFO; do
    ID="$(cut -d'/' -f1 <<<$val)"
    NAME="$(cut -d'/' -f2 <<<$val)"
    if [ ! -d $EXID ]; then
        mkdir $EXID
    fi
    if [ ! -d $EXID/$NAME ]; then
        mkdir $EXID/$NAME
    fi
    docker cp badkan:/submissions/$ID/$EXID $EXID/$NAME
    mv -v $EXID/$NAME/$EXID/*.{cpp,java,h,c,hpp} $EXID/$NAME
    rm -r $EXID/$NAME/$EXID
done

echo "! zip -r $EXID.zip $EXID"
zip -r $EXID.zip $EXID
echo "! rm -r $EXID"
rm -r $EXID

