#!/usr/bin/env bash
# INPUT: the path to the3 folder
# ACTION: rm everything in this folder.

export EXERCISE_NAME=$1
export COMPILE_COMMAND=$2
export INPUT_OUTPUT_POINTS=$3
export MAIN_FILE=$4
export INPUT_FILE_NAME=$5
export OUTPUT_FILE_NAME=$6
export FOLDER_NAME=$7

echo "Grade exercise $EXERCISE_NAME"

cd grading_room/$FOLDER_NAME
unzip -qq $FOLDER_NAME.zip

cd */

# TODO: Handle conflict with python that don't need compile.
echo $COMPILE_COMMAND $MAIN_FILE
$COMPILE_COMMAND $MAIN_FILE 

for item in $INPUT_OUTPUT_POINTS; do
    echo $item
done

cd ../../
rm -R $FOLDER_NAME

echo $INPUT_OUTPUT_POINTS
echo $INPUT_FILE_NAME
echo $OUTPUT_FILE_NAME
