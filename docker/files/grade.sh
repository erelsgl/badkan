#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export EXERCISE_NAME=$1
export COMPILER=$2
export INPUT_OUTPUT_POINTS=$3
export MAIN_FILE=$4
export INPUT_FILE_NAME=$5
export OUTPUT_FILE_NAME=$6
export FOLDER_NAME=$7
export RUNNER=$8

echo "Grade exercise $EXERCISE_NAME"

cd grading_room/$FOLDER_NAME
unzip -qq $FOLDER_NAME.zip

cd */

# TODO: Handle conflict with python that don't need compile.
echo $COMPILER $MAIN_FILE
$COMPILER $MAIN_FILE 

grade=0

for item in $INPUT_OUTPUT_POINTS; do
    iter=$(echo $item | tr "@*@" "\n")
    arr=($iter)
    input=${arr[0]}
    expected_output=${arr[1]}
    points=${arr[2]}
    # First run the program.
    if [ $INPUT_FILE_NAME == "standart" ]; then
        output=$($RUNNER $MAIN_FILE $input)
        echo "Your output is " $output  # Make this parameter.
        if [ $output == $expected_output ]; then
            ((grade+=$points))
        fi;
    else
        # If the input is not standart.
        echo "not standart"
    fi;
done

echo "Your final grade is " $grade

cd ../../
rm -R $FOLDER_NAME
