#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export MY_PATH=$1
export MY_UID=$2

cd $MY_PATH/$MY_UID
echo "$(git log -1)"
cd ../
zip -r --quiet $MY_UID.zip $MY_UID/
cd  ../../servers/
