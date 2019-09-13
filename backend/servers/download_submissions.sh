#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export EXERCISE_ID=$1

echo "$HOME/google-cloud-sdk/bin/gsutil -m cp -R gs://badkanlocal.appspot.com/submissions/$EXERCISE_ID ."
$HOME/google-cloud-sdk/bin/gsutil -m cp -R gs://badkanlocal.appspot.com/submissions/$EXERCISE_ID .
