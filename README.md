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

## Launch

The system has three different parts that should be launched separately 
(in the future there should be a single launch script.

1. Run the docker image (this opens a bash shell inside the docker container):

        sudo docker run --name badkan --rm -i -t erelsgl/badkan bash
        ls      # verify that you see grade-single-submission.sh

2. In a second terminal, run the backend server (websockets server for checking and grading submissions)
and the frontend server (http server for submissions). Note: it must be run as root since it uses docker. 

        sudo docker container ls     # check that you see badkan running
        cd badkan
        bash start.sh <FRONTEND_PORT>

For example:

        bash start.sh 80

To check that it is working, point your browser to:

    http://localhost:<FRONTEND_PORT>?exercise=00-multiply
    
(If you installed badkan on a remote server, use its IP address instead of localhost).

You can try to submit the following solution to the sample assignment:

    https://github.com/erelsgl/cpp-homework-00.git

You should see that the grade is 100%.


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
