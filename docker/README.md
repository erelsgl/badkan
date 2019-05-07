These files are used to build the docker container.

The script get-submission.sh is copied to the docker container and executed from there.

To change the docker image:

1. Change the Dockerfile

2. Re-build the image:

        cd badkan/docker
        sudo docker build -t erelsgl/badkan:latest .

3. Commit the change:

        sudo docker commit -m="commit message" badkan

4. Push the image from your computer to the repository:

        sudo docker login # enter username and password to hub.docker.com 
        sudo docker push erelsgl/badkan:latest

5. To pull a new image from the repository (to another computer) do:

        sudo docker pull erelsgl/badkan:latest

6. To start or re-start the container, run:

        sudo bash ../start/docker.sh

7. To remove old versions do:

        sudo docker images    # note the old image with the <none> tag
        sudo docker rmi <old-image-id>

8. To copy a file or a folder into the container do e.g:

        sudo docker cp multiply badkan:/

9. To execute a command in the docker do:

        sudo docker exec badkan ls

10. To enter into the bash of the docker:

        sudo docker exec -it badkan bash

