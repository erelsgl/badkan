#!/usr/bin/env bash
# INPUT: git-username and git-repository.
# ACTION: clone or pull the repository of that username into the "submissions" folder.

export USERNAME=$1
export REPOSITORY=$2

cd submissions

if [ ! -d $USERNAME ]; then
    echo "! mkdir $USERNAME"
    mkdir $USERNAME
fi

echo "! cd $USERNAME"
cd $USERNAME

if [ -d $REPOSITORY ]; then
    echo "! cd $REPOSITORY"
    cd $REPOSITORY
    echo "! git fetch, reset, clean"
    git fetch
    git reset --hard origin/master
    git clean -fxdq
else
    URL=https://github.com/$USERNAME/$REPOSITORY.git
    echo "! git clone $URL"
    git clone $URL
    echo "! cd $REPOSITORY"
    cd $REPOSITORY
fi
