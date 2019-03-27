#!/usr/bin/env bash
# Database JSON export (for backup)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/..
tar -zcvf database_exports/exercises-backup.tar.gz exercises

cd $DIR/../database_exports
python3 ../start/firebase_save.py
