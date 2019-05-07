#!/usr/bin/env bash
#
# Run this script from your home computer in order to automatically update the frontend from github
#

git push
ssh root@104.248.40.179 "source /root/badkan/start/update_frontend.sh"
