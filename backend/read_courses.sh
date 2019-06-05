#!/usr/bin/env bash
# Database JSON export (for backup)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
FIREBASE_APP=badkan-9d48d

FILENAME=$DIR/../frontend/data/courses.js
echo "coursesObject=" > $FILENAME
curl https://$FIREBASE_APP.firebaseio.com/courses.json?format=export >> $FILENAME

FILENAME=$DIR/../frontend/data/exercises.js
echo "exercisesObject=" > $FILENAME
curl https://$FIREBASE_APP.firebaseio.com/exercises.json?format=export >> $FILENAME
