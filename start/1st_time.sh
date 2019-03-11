#!/usr/bin/env bash
#
# Run start/update.sh after you update the server code at github.
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/docker.sh  &&  source $DIR/backend_frontend.sh
