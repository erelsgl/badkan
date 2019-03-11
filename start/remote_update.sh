#!/usr/bin/env bash
#
# Run this script from your home computer in order to automatically update the server
#

git push
ssh root@104.248.40.179 "cd badkan; git pull; source start/backend_frontend.sh"
