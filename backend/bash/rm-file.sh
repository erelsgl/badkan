#!/usr/bin/env bash
# INPUT: the user id.
# ACTION: rm the zip file.

USER=$1 # The firebase user id 

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "! cd $DIR/.."
cd $DIR/..
echo "! rm $USER.zip"
rm $USER.zip
