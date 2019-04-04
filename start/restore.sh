#!/usr/bin/env bash

#
# This script should contain code to restore the system from backup.
#
# There are several things to restore:
#
# 1. In case of server crash: get the file exercises-backup.tar.gz from Firebase file storage, and unzip it to the exercises folder on the server.
# 2. Import a json file from database_exports into the Firebase realtime database (using the Firebase GUI).
# 3. Update the FirebaseConfig.js for the new database (see the README.md)
# 4. After a user re-registers (after the crash), we have to set his user-id to the old user-id.
#    We can find the old user-id in the realtime database, for example, by the email address.
