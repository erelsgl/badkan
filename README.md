# badkan
A server for automatic checking and grading of programming assignments.

## Installation

Clone the rep:

    git clone https://github.com/erelsgl/badkan.git
   
We will do everything as root:

    sudo su

Badkan uses python and its websockets library, 
so let's install them first:

    apt update
    apt install git git-gui python3 python3-pip python3-dev
    pip3 install --upgrade pip
    pip3 install websockets

Badkan executes the submitted exercises in an isolated environment. This is handled by [docker](https://www.docker.com/).
Let's install docker then. On Ubuntu, do:

    curl -fsSL https://get.docker.com/ | sh
    systemctl start docker
    systemctl enable docker
    
Optional: check that docker is installed correctly:

    service docker status
    docker run hello-world

Next, pull a docker image of badkan from the public docker repository:

    docker pull erelsgl/badkan
    sudo docker images       # check that you see the badkan image

This can take a very long time since the image is large.
Alternatively, you can build the image yourself:

    cd badkan/docker
    docker build -t erelsgl/badkan:latest .
    sudo docker images       # check that you see the badkan image

If you want to use a process-monitor to run the servers, you can use pm2:

    sudo apt install npm 
    sudo npm install -g --no-optional pm2@latest



## Start

The system has three different parts: docker, backend and frontend.

They can all be started with:

    cd badkan
    sudo bash start.sh <FRONTEND_PORT>

For example:

    sudo bash start.sh 80

Verify that the docker container is running:

    sudo docker container ls

Verify that the back-end is running:

    less backend/nohup.out

Verify that the front-end is running:

    sudo less frontend/nohup.out
    <your-browser> http://localhost:<FRONTEND_PORT>?exercise=00-multiply

For example:

    lynx http://localhost?exercise=00-multiply

(If you installed badkan on a remote server, use its IP address instead of localhost).

You can try to submit the following solution to the sample assignment:

    https://github.com/ereltest/multiply.git

You should see that the grade is 100%.


## Logs

The backend logs are at backend/nohup.out

The frontend logs are at frontend/nohup.out


## Restart

When you upgrade badkan, you have to restart it. Since both badkan servers
run in python, you can stop it by just:

    sudo killall python3
    
then start it again by:

    sudo bash start.sh 80

You can run both by:

    bash restart.sh 80


## Exercises

An *exercise* corresponds to a subfolder of the "exercises" folder.
Inside the folder, there should be an executable program
called *grade*. This program is responsible for checking and grading the submissions.
For example, it can contain a "make" command, 
and some commands for running the executable and comparing against expected outputs.

To submit an exercise, a student should:

1. put the solution in a git repository (e.g. in GitHub);
2. open the frontend with the exercise code, e.g. http://server?exercise=00-reverse 
3. submit the clone-url of this repository.

The system then:

4. clones the repository into the docker container;
5. copies all files from the exercise folder into the repository folder;
6. enters the repository folder and runs "grade".

The default installation contains two example exercises:
"00-multiply" and "00-reverse". 

## Maintenance

To enter the running docker container:

    sudo docker attach badkan
    
To exit back to the host:

    Ctrl+P+Q

To copy files from the host into the container:

    docker cp <local-file> badkan:/<remote-file>
    
To replace the container with an updated container:

    sudo docker pull erelsgl/badkan:latest
    sudo docker images    # note the old image with the <none> tag
    sudo docker rmi <old-image-id>
    sudo docker run --name badkan --rm -i -t erelsgl/badkan bash
    
To replace an old exercise-grader with a new one: 
put the new grader code in the "exercises" folder on the *host*.
The server will automatically copy it to the docker container.
