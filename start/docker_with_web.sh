#!/usr/bin/env bash
#
# Start a docker server that exposes a web port.
#

PORT_EXPOSED_FROM_DOCKER=8010
sudo docker run --name badkan -p $PORT_EXPOSED_FROM_DOCKER:$PORT_EXPOSED_FROM_DOCKER --rm -itd erelsgl/badkan bash

# Start the http server from within docker:
sudo docker exec badkan bash -c "cd /www; python3 -u -m http.server $PORT_EXPOSED_FROM_DOCKER" &

sudo docker container ls
