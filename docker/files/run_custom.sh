#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export FOLDER_NAME=$1
export CORRECTION_URL=$2

# unzip the submission.
cd grading_room/$FOLDER_NAME
unzip -qq $FOLDER_NAME.zip

# make the name of the submission be "FOLDER_NAME"
mv */ $FOLDER_NAME

# clone the correction on the folder "git_clone_correction"
git clone --quiet $CORRECTION_URL git_clone_correction 
# move all the correction files on the "FOLDER_NAME" for the grade process.
mv git_clone_correction/* $FOLDER_NAME

cd $FOLDER_NAME

# process the grade.
bash grade

cd ../../
rm -R $FOLDER_NAME