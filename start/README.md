Scripts for starting the various parts of the system:

To start the system the first time, or after reboot, do:

      start/1st_time.sh

(it starts the docker, the backend and the frontend).

To update the system after pushing some *backend* updates to github, do:

      start/update_backend_frontend.sh

(it pulls from github, copies the frontend to var/www/html, then restarts the backend).

To update the system after pushing some *frontend only* updates to github, do:

      start/update_frontend.sh

(it pulls from github and copies the frontend to var/www/html, but does not restart the backend).

To just restart the backend and frontend, do:

      start/backend_frontend.sh

To just restart the backend, do:

      start/backend.sh

FROM YOUR COMPUTER, to push local changes, pull them on the server and restart the server, do:

      start/remote_update_backend_frontend.sh

or

      start/remote_update_frontend.sh
