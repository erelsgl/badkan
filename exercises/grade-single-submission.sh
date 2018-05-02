#!/usr/bin/env bash
# INPUT: git-username and git-repository.
# ACTION: clone the repository of that username into "submissions", cd into it, and run the

export HOMEWORKNAME=$1
export USERNAME=$2
export REPOSITORY=$3

cd submissions

if [ ! -d $USERNAME ]; then
    echo "! mkdir $USERNAME"
    mkdir $USERNAME
fi
echo "! cd $USERNAME"
cd $USERNAME

if [ -d $REPOSITORY ]; then
    # rm -rf $REPOSITORY
    echo "! cd $REPOSITORY"
    cd $REPOSITORY
    echo "! git fetch"
    git fetch
    echo "! git reset --hard origin/master"
    git reset --hard origin/master
else
    URL=https://github.com/$USERNAME/$REPOSITORY.git
    echo "! git clone $URL"
    git clone $URL
    echo "! cd $REPOSITORY"
    cd $REPOSITORY
fi

echo "! grade"

# Copy all grading files from the homework folder to the current student's folder:
cp -r ../../../$HOMEWORKNAME/* .

# Run the actual grading script for the specific homework:
./grade
