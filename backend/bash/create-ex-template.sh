#!/usr/bin/env bash
# INPUT: the foldername with the id of the exercise.
# ACTION: First run create exercise then run cp grade.

FOLDERNAME=$1 # Firebase id of the exercise.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "! cd $DIR"
cd $DIR
echo "! bash create-ex.sh $FOLDERNAME"
bash create-ex.sh $FOLDERNAME
echo "bash cp-grade.sh $FOLDERNAME"
bash cp-grade.sh $FOLDERNAME
