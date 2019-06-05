#!/usr/bin/env bash
# Database JSON export (for backup)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
FILE=$DIR/../frontend/data/exercises.js

echo "exercisesObject=" > $FILE
curl https://badkan-9d48d.firebaseio.com/exercises.json?format=export >> $FILE
