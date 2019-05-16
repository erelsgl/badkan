#!/usr/bin/env bash
# INPUT: class name, signature name.
# ACTION: create a java.class file with the good function signature and put it to the right place.

export CLASSNAME=$1
export FUNCTIONS=$2
export OWNERID=$3
export EXID=$4

cd submissions/$OWNERID/$EXID/src/main/java/

SUBSTRING=$(echo $CLASSNAME| cut -d'.' -f 1)

cat <<EOF >$CLASSNAME
public class $SUBSTRING {
    $FUNCTIONS
}
EOF

