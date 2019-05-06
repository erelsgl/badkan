#!/usr/bin/env bash
#
# Run start/update_docker_from_hub.sh after you update docker/Dockerfile.
# See README.md  for other update scripts.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $DIR/export.sh before-docker-update
sudo docker build -t erelsgl/badkan:latest .
source $DIR/docker.sh
