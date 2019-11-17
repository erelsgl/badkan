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
export RUNNER='timeout 20 '$8
export SIGNATURE=$9
export GRADE=0


create_file () {
cat <<EOF >$INPUT_FILE_NAME
$input
EOF
}

run_standard_and_read_standard() {
    input=$1
    return $(echo "$input" | $RUNNER)
}

run_standard_and_read_file() {
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

run_file_and_read_standard() {
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

cd grading_room/$FOLDER_NAME
unzip -qq $FOLDER_NAME

cd */

# Handle conflict with python and perl that don't need compile.
if [[ ( $COMPILER != "python3" ) || ( $COMPILER != "perl" ) ]] ; then
    $COMPILER $MAIN_FILE > /dev/null 2>&1
fi;

for item in $INPUT_OUTPUT_POINTS; do
    iter=$(echo $item | tr "@*@" "\n")
    arr=($iter)
    input=${arr[0]}
    echo "The input is" $input 
    expected_output=${arr[1]}
    points=${arr[2]}
    if [[ ( $INPUT_FILE_NAME == "standard" ) &&  ( $OUTPUT_FILE_NAME == "standard") ]]; then
        run_standard_and_read_standard $input
    elif [[ ( $INPUT_FILE_NAME == "standard" ) && ( $OUTPUT_FILE_NAME != "standard" ) ]]; then
        run_standard_and_read_file $input
    elif [[ ( $INPUT_FILE_NAME != "standard" ) &&  ( $OUTPUT_FILE_NAME == "standard" ) ]]; then
        run_file_and_read_standard $input
    elif [[ ( $INPUT_FILE_NAME != "standard" ) &&  ( $OUTPUT_FILE_NAME != "standard" ) ]]; then
        run_file_and_read_file $input
    else  # If the input is not standard.
        echo "error..."
    fi;
    output=$?
    echo "Your output is" $output  
    edit_grade $output $expected_output $points
done

echo $SIGNATURE $GRADE

cd ../../
rm -R $FOLDER_NAME
