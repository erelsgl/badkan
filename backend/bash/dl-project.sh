#!/usr/bin/env bash
# INPUT: the exercise id and firebase user id.
# ACTION: Move the project of the user for a given exercise and zip it.

EX=$1 # The firebase id of the exercise.
USER=$2  # The firebase id of the user.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker cp badkan:/submissions/$USER/$EX $USER

echo "! cd $DIR/.."
cd $DIR/..
echo "! zip -r $USER.zip $USER/*.{cpp,java,h,c,hpp}"
zip -r $USER.zip $USER/*.{cpp,java,h,c,hpp}
echo "! rm -r $USER"
rm -r $USER

