#!/usr/bin/env bash
# Database JSON export (for backup)

curl https://badkan-9d48d.firebaseio.com/.json?format=export > database_exports/$1.json

# To export only the "exercises" object use:
# curl https://badkan-9d48d.firebaseio.com/exercises.json?format=export > database_exports/$1.json
