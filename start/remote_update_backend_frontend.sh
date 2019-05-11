#!/usr/bin/env bash
# CURRENTLY DOES NOT WORK - PROBLEM WITH  nohup
#
# Run this script from your home computer in order to automatically update the backend and frontend from github
#

git push
ssh root@104.248.40.179 "cd /root/badkan; bash start/update_backend_frontend.sh"
