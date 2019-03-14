This folder contains JSON files that are exported from the Firebase database for backup purposes.

To create a backup, do (from badkan folder):

     curl https://<instance-id>.firebaseio.com/.json?format=export > database_exports/<backup-name>.json 

For example:

     curl https://badkan-9d48d.firebaseio.com/.json?format=export > database_exports/backup-1.json 

