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
export GRADE=0

create_file () {
cat <<EOF >$INPUT_FILE_NAME
$input
EOF
}

run_standart_and_read_standart() {
    input=$1
    return $(echo "$input" | $RUNNER)
}

run_standart_and_read_file() {
    input=$1
    $(echo "$input" | $RUNNER)
    return $(cat $OUTPUT_FILE_NAME)
}

run_file_and_read_file() {
    input=$1
    create_file $input
    $RUNNER
    return $(cat $OUTPUT_FILE_NAME)
}

run_file_and_read_standart() {
    input=$1
    create_file $input
    return $($RUNNER)
}

edit_grade() {
    output=$1
    expected_output=$2
    points=$3
    if [ $output == $expected_output ]; then
                ((GRADE+=$points))
    fi;
}

echo "Grade exercise $EXERCISE_NAME"

cd grading_room/$FOLDER_NAME
unzip -qq $FOLDER_NAME

cd */

# Handle conflict with python that don't need compile.
if [ $COMPILER != "python3" ] ; then
    echo $COMPILER $MAIN_FILE
    $COMPILER $MAIN_FILE 
fi;

for item in $INPUT_OUTPUT_POINTS; do
    iter=$(echo $item | tr "@*@" "\n")
    arr=($iter)
    input=${arr[0]}
    expected_output=${arr[1]}
    points=${arr[2]}
    if [[ ( $INPUT_FILE_NAME == "standart" ) &&  ( $OUTPUT_FILE_NAME == "standart") ]]; then
        run_standart_and_read_standart $input
    elif [[ ( $INPUT_FILE_NAME == "standart" ) && ( $OUTPUT_FILE_NAME != "standart" ) ]]; then
        run_standart_and_read_file $input
    elif [[ ( $INPUT_FILE_NAME != "standart" ) &&  ( $OUTPUT_FILE_NAME == "standart" ) ]]; then
        run_file_and_read_standart $input
    elif [[ ( $INPUT_FILE_NAME != "standart" ) &&  ( $OUTPUT_FILE_NAME != "standart" ) ]]; then
        run_file_and_read_file $input
    else  # If the input is not standart.
        echo "error..."
    fi;
    output=$?
    echo "Your output is " $output  # Make this parameter.
    edit_grade $output $expected_output $points
done

echo "Your final grade is" $GRADE

cd ../../
rm -R $FOLDER_NAME

echo "*** $GRADE ***"