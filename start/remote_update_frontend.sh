#!/usr/bin/env bash
# CURRENTLY DOES NOT WORK - PROBLEM WITH  nohup
#
# Run this script from your home computer in order to automatically update the frontend from github
#

git push
echo "don't forget to update the script version"
ssh root@104.248.40.179 "cd /root/badkan; bash start/update_frontend.sh"
