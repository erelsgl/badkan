#!/usr/bin/env bash
# INPUT: the exercise id and the subfolder of the GitLab repository.
# ACTION: pull the repository.

FOLDERNAME=$1 # The firebase id of the exercise.
EXFOLDER=$2 # the subfolder of the GitLab repository.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "! cd $DIR/../../exercises/$FOLDERNAME"
cd $DIR/../../exercises/$FOLDERNAME
git fetch
git checkout HEAD $EXFOLDER
git pull



