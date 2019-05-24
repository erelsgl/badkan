#!/usr/bin/env bash
# INPUT: the foldername of the submission.
# ACTION: send the submission to the docker and clean up.

FOLDERNAME=$1 # The foldername to send - usualy the firebase owner id.

echo "! docker cp $FOLDERNAME badkan:/"
docker cp $FOLDERNAME badkan:/
echo "! sudo rm $FOLDERNAME"
sudo rm $FOLDERNAME
