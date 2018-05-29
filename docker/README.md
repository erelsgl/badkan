These files are used to build the docker container.

The script get-submission.sh is copied to the docker 
container and executed from there.

To build or re-build the image do:

    sudo docker build -t erelsgl/badkan:latest .
    
To push the image to the repository do:

    sudo docker login    # enter username and password to hub.docker.com
    sudo docker push erelsgl/badkan:latest

To pull a new image from the repository do:

    sudo docker pull erelsgl/badkan:latest

To run the container, first exit the previous running container, then do:

    sudo docker run --name badkan --rm -i -t erelsgl/badkan bash

To remove old versions do:

    sudo docker rmi <old-image-id> 

To copy a folder into the container do e.g:

    sudo docker cp 00-multiply badkan:/
