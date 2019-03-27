#!/usr/bin/env bash
# Database JSON export (for backup)

tar -zcvf database_exports/exercises-backup.tar.gz exercises
cd database_exports;   python3 ../start/firebase_save.py
