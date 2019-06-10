#!/usr/bin/env bash
# INPUT: the gitlab link to clone and the user firebase id.
# ACTION: clone the directory in a subfolder with the name of the user firebase id.

GITLAB=$1 # The firebase id of the exercise.
EXFOLDER=$2 # the subfolder of the GitLab repository.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "! cd $DIR/../../exercises/"
cd $DIR/../../exercises/
git clone $GITLAB $EXFOLDER



