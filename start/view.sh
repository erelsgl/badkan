#!/usr/bin/env bash
#
# View the running system parts
#

printf "\n\nDOCKER:\n"
sudo docker container ls

printf "\n\nFRONTEND:\n"
sudo systemctl status apache2

printf "\n\nBACKEND:\n"
ps ax -o pid,ni,cmd | grep pyth

printf "\n\nSUBMISSIONS:\n"
tail backend/trace_table.csv
