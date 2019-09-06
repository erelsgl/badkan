#!/usr/bin/env bash
# INPUT: owner-id exercise-id.
# ACTION: copy the folder in the docker.

export OWNERID=$1
export EXID=$2

cd submissions/$OWNERID/$EXID/src/test/java/

unzip -j //$OWNERID -x *.git* # CHECK if github has been submitted.
rm //$OWNERID


