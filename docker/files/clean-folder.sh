#!/usr/bin/env bash
# INPUT: the path to the3 folder
# ACTION: rm everything in this folder.

export INFO=$1

if [ -d $INFO ]; then
    echo "! cd $INFO"
    cd $INFO
    echo "! Current Path $PATH"

    echo "! rm *"
    rm *
fi


