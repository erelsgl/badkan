#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export FOLDER_NAME=$1
export EXERCISE_ID=$2

# unzip the submission.
cd grading_room/$FOLDER_NAME/$EXERCISE_ID

unzip -qq ./$EXERCISE_ID.zip

# rename the submission folder to EXERCISE_ID
mv */ ./$EXERCISE_ID 2>/dev/null

# make the name of the outside folder exercise to be UNIQUE "EXERCISE_ID+_FOLDER_NAME"
# mv ./$EXERCISE_ID ./$EXERCISE_ID$FOLDER_NAME
cd ../$FOLDER_NAME

unzip -qq ./$FOLDER_NAME.zip

# make the name of the exercise to be "EXERCISE_ID"
mv */ ./$FOLDER_NAME 2>/dev/null

# move all submission file to submission folder
mv -v ./$FOLDER_NAME/*  2>/dev/null ../$EXERCISE_ID/$EXERCISE_ID 

cd ../$EXERCISE_ID/$EXERCISE_ID
# process the grade.
echo "OUTPUT OF YOUR SUBMISSION: "
echo "--------------------------"
bash grade

cd ../../..

# rm -R ./$EXERCISE_ID
rm -R $FOLDER_NAME
