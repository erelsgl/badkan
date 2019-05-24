#!/usr/bin/env bash
# INPUT: the foldername with the id of the exercise.
# ACTION: unzip the exercise and mv it to the exercise folder.

FOLDERNAME=$1 # Firebase id of the exercise.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "! cd $DIR/../../exercises"
cd $DIR/../../exercises
echo "! bash mv-ex-extract.sh $FOLDERNAME"
bash mv-ex-extract.sh $FOLDERNAME
