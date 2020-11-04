#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export FOLDER_NAME=$1
export EXERCISE_ID=$2

# unzip the submission.
cd grading_room/$FOLDER_NAME
unzip -qq $FOLDER_NAME.zip

# rename the submission folder to FOLDER_NAME
mv */ ./$FOLDER_NAME 2>/dev/null
cd ..

# make the name of the outside folder exercise to be UNIQUE "EXERCISE_ID+_FOLDER_NAME"
mv ./$EXERCISE_ID ./$EXERCISE_ID$FOLDER_NAME

cd ./$EXERCISE_ID$FOLDER_NAME
unzip -qq ./$EXERCISE_ID.zip

# make the name of the exercise to be "EXERCISE_ID_FOLDER_NAME"
mv */ ./$EXERCISE_ID$FOLDER_NAME 2>/dev/null

# move all submission file to submission folder
mv -v ./$EXERCISE_ID$FOLDER_NAME/*  2>/dev/null ../$FOLDER_NAME/$FOLDER_NAME 

cd ../$FOLDER_NAME/$FOLDER_NAME
# process the grade.
bash grade

cd ../..
rm -R ./$EXERCISE_ID$FOLDER_NAME
rm -R $FOLDER_NAME
