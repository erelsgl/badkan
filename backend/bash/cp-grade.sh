#!/usr/bin/env bash
# INPUT: the foldername with the id of the exercise.
# ACTION: copy the grade file to the folder.

FOLDERNAME=$1 # Firebase id of the exercise.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "cd $DIR/.."
cd $DIR/..
echo "sudo chmod +x grade"
sudo chmod +x grade
echo "mv grade $DIR/../../exercises/$FOLDERNAME/"
mv grade $DIR/../../exercises/$FOLDERNAME/

