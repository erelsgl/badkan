#!/usr/bin/env bash
# INPUT: The exercise foldername.
# ACTION: rm the exercise folder.

EXERCISE=$1 # The firebase user id 

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "! cd $DIR/../../exercises"
cd $DIR/../../exercises
echo "! rm -r " $EXERCISE
rm -r $EXERCISE
