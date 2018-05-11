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
    echo "! git fetch"
    git fetch
    echo "! git reset --hard origin/master"
    git reset --hard origin/master
    echo "! git clean -fxd"
    git clean -fxd
else
    URL=https://github.com/$USERNAME/$REPOSITORY.git
    echo "! git clone $URL"
    git clone $URL
    echo "! cd $REPOSITORY"
    cd $REPOSITORY
fi
