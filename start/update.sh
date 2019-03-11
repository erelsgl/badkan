#!/usr/bin/env bash
#
# Run start/first_time.sh at the first time you start the system on a new server (or after reboot).
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

git pull   &&   source $DIR/backend_frontend.sh
