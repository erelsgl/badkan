#!/usr/bin/env bash
#
# Run start/update_backend_frontend.sh after you update the backend and frontend code at github.
# See README.md  for other update scripts.


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if git pull
then
    source $DIR/export.sh before-backend-update
    cp -rf $DIR/../frontend/* /var/www/html/
    source $DIR/backend.sh
fi
