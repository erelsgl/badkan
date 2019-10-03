#!/usr/bin/env bash
#
# Run start/update_frontend.sh after you update only the frontend code at github.
# See README.md  for other update scripts.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if git pull
then
    cp -rf $DIR/../frontend/* /var/www/html/
fi
