These files are used to build the docker container.

The script get-submission.sh is copied to the docker container and executed from there.

To change the docker image:

1. Change the Dockerfile


2. Re-build the image:

        cd badkan/docker
        sudo docker build -t erelsgl/badkan:latest .
        sudo docker image ls     # look for erelsgl/badkan with tag "latest" 


3. To push the image from your computer to the repository do:

        sudo docker login    # enter username and password to hub.docker.com
        sudo docker push erelsgl/badkan:latest

4. To pull a new image from the repository (to another computer) do:

        sudo docker pull erelsgl/badkan:latest

5. To run the container, first exit the previous running container:

        sudo docker container stop badkan

then do:

        sudo bash ../start/docker.sh

6. To remove old versions do:

        sudo docker rmi <old-image-id> 

7. To copy a file or a folder into the container do e.g:

        sudo docker cp <folder> badkan:/

8. To execute a command in the docker do:

        sudo docker exec badkan ls

9. To enter into the bash of the docker:

        sudo docker exec -it badkan bash
