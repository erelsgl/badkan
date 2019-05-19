#!/usr/bin/env bash
# INPUT: owner-id exercise-id.
# ACTION: copy the folder in the docker.

export OWNERID=$1
export EXID=$2

# cd submissions/$OWNERID/$EXID/src/main/java/
unzip -j $OWNERID -d $EXID -x *.git* # CHECK if github has been submitted.


USERS=$(echo submissions/*/$EXID/src/main/java)

echo $USERS

for val in $USERS; do
    cp -a $EXID/. $val
done

rm -r $EXID
rm -r $OWNERID


