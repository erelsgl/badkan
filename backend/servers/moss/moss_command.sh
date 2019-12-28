#!/usr/bin/env bash
# INPUT: 
# ACTION: 


export LANGUAGE=$1
export SUBMISSIONS=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


echo "cd $DIR"
cd $DIR

pwd
./moss.pl -d -l $LANGUAGE -c "moss" $SUBMISSIONS

