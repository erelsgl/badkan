#!/usr/bin/env bash
# INPUT: git-username and git-repository.
# ACTION: clone the repository of that username into "submissions", cd into it, and run the

HOMEWORKNAME=$1
USERNAME=$2
REPOSITORY=$3

cd submissions

if [ ! -d $USERNAME ]; then
    echo "! mkdir $USERNAME"
    mkdir $USERNAME
fi
echo "! cd $USERNAME"
cd $USERNAME

if [ -d $REPOSITORY ]; then
    rm -rf $REPOSITORY
    # echo "! cd $REPOSITORY"
    # cd $REPOSITORY
    # echo "! git pull"
    # git pull 2>&1
fi
URL=https://github.com/$USERNAME/$REPOSITORY.git
echo "! git clone $URL"
git clone $URL 2>&1
echo "! cd $REPOSITORY"
cd $REPOSITORY

echo "! grade"
cp ../../../$HOMEWORKNAME/* .
./grade
