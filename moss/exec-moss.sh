#!/usr/bin/env bash

export COMPILER=$1
export EXID=$2
export INFO=$3 # INFO is an array like "user_id/username"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR

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
    
    # Here add the new languages if needed...
    
    mv -v $EXID/$NAME/$EXID/*.{cpp,java,h,c,hpp} $EXID/$NAME
    rm -r $EXID/$NAME/$EXID
done

./moss.pl -d -l $COMPILER -c "moss" ./$EXID/*/*

rm -r $EXID
