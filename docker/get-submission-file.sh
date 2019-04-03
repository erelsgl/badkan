#!/usr/bin/env bash
# INPUT: owner-id exercise-id.
# ACTION: copy the folder in the docker.

export OWNERID=$1
export EXID=$2

cd submissions

if [ -d $OWNERID ]; then
    echo "! cd $OWNERID"
    cd $OWNERID
    if [ -d $EXID ]; then
        echo "! rm -r $EXID"
        rm -r $EXID
    fi
else
    mkdir $OWNERID
    echo "! cd $OWNERID"
    cd $OWNERID
fi

mkdir $EXID
cd $EXID
unzip -j ../../../$OWNERID -x *.git* # CHECK if github has been submitted.
rm ../../../$OWNERID


