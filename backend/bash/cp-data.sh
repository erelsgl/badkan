#!/usr/bin/env bash
# INPUT: no input required.
# ACTION: copy the data from the frontent/data folder to /var/www/html/ where the apache frontend resides.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "cd $DIR/../../frontend/data"
cd $DIR/../../frontend/data
echo "cp * /var/www/html/"
cp * /var/www/html/
