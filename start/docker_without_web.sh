#!/usr/bin/env bash
#
# Start a docker server that does not expose a web port.
#

sudo docker run --name badkan --rm -itd erelsgl/badkan bash

sudo docker container ls

