#!/usr/bin/env bash
# INPUT: 
# ACTION: 

export EXERCISE_ID=$1
export BUCKET=$2

echo "$HOME/google-cloud-sdk/bin/gsutil -m cp -R gs://$BUCKET.appspot.com/submissions/$EXERCISE_ID ."
$HOME/google-cloud-sdk/bin/gsutil -m cp -R gs://$BUCKET.appspot.com/submissions/$EXERCISE_ID .
