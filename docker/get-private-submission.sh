#!/usr/bin/env bash
# INPUT: git-username and git-repository owner-id exercise-id.
# ACTION: clone or pull the repository of that username into the "submissions" folder.

export USERNAME=$1
export REPOSITORY=$2
export OWNERID=$3
export EXID=$4
export TOKENUSERNAME=$5
export TOKENPASS=$6

#  new_url = "https://" + username + ":" + password + "@" + url[8:]

URL=https://$TOKENUSERNAME:$TOKENPASS@gitlab.com/$USERNAME/$REPOSITORY.git

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

    echo "git previous url: " $(git config --get remote.origin.url)
    if [ $(git config --get remote.origin.url) == $URL ]; then        
        echo "! git fetch, reset, clean"
        git fetch
        git reset --hard origin/master
        git clean -fxdq
    else
        cd ..
        rm -r $EXID
        echo "! git clone $URL $EXID"
        git clone $URL $EXID
        echo "! cd $EXID"
        cd $EXID
    fi;

else
    echo "! git clone $URL $EXID"
    git clone $URL $EXID
    echo "! cd $EXID"
    cd $EXID
fi
