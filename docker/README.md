These files are used to build the docker container.

The script grade-single-submission.sh is copied to the docker 
container and executed from there.

To build the container do:

    sudo docker build -t erelsgl/badkan:latest .
    
To run the container, first exit the previous running container, then do:

    sudo docker run --name badkan --rm -i -t erelsgl/badkan bash

To remove old versions do:

    sudo docker rmi <old-image-id> 

To copy a folder into the container do:

    sudo docker cp 00-multiply badkan:/
