#!/usr/bin/env bash
# INPUT: git-username and git-repository owner-id exercise-id.
# ACTION: clone or pull the repository of that username into the "submissions" folder.

export USERNAME=$1
export REPOSITORY=$2
export OWNERID=$3
export EXID=$4

cd submissions

if [ ! -d $OWNERID ]; then
    echo "! mkdir $OWNERID"
    mkdir $OWNERID
fi

echo "! cd $OWNERID"
cd $OWNERID

if [ -d $EXID ]; then
    echo "! cd $EXID"
    cd $EXID

    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo "! git fetch, reset, clean"
        git fetch
        git reset --hard origin/master
        git clean -fxdq
    else
        URL=https://github.com/$USERNAME/$REPOSITORY.git
        echo "! git clone $URL $EXID"
        git clone $URL $EXID
        echo "! cd $EXID"
        cd $EXID
    fi;

else
    URL=https://github.com/$USERNAME/$REPOSITORY.git
    echo "! git clone $URL $EXID"
    git clone $URL $EXID
    echo "! cd $EXID"
    cd $EXID
fi
