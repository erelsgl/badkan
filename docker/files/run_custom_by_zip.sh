#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export FOLDER_NAME=$1
export EXERCISE_ID=$2


cd grading_room/$EXERCISE_ID
unzip -qq ./$EXERCISE_ID.zip

# make the name of the exercise to be "EXERCISE_ID"
mv */ ./$EXERCISE_ID 2>/dev/null

# unzip the submission.
cd ../$FOLDER_NAME 
unzip -qq $FOLDER_NAME.zip

# move all submission to exercise folder
mv $FOLDER_NAME/*  2>/dev/null ../$EXERCISE_ID/$EXERCISE_ID 

# return in the exercise folder
cd ../$EXERCISE_ID/$EXERCISE_ID

# process the grade.
bash grade

cd ../..

# remov all folders from the grading room
rm -R ./$EXERCISE_ID
rm -R $FOLDER_NAME
