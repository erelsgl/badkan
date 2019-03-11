Scripts for starting the various parts of the system:

To start the system the first time, or after reboot, do:

      start/1st_time.sh

(it starts the docker, the backend and the frontend).

To update the system after pushing some updates to github, do:

      start/update.sh

(it pulls from github, then restarts only the backend and the frontend).

To just restart the backend and frontend, do:

      start/backend_frontend.sh

FROM YOUR COMPUTER, to push local changes, pull them on the server and restart the server, do:

      start/remote_update.sh
