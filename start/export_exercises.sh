#!/usr/bin/env bash
# Database JSON export (for backup)

tar -zcvf database_exports/exercises-backup.tar.gz exercises

# Send to Firebase file-storage
