# badkan
A server for automatic checking and grading of programming assignments.

## Installation

Clone the rep:

    clone https://github.com/erelsgl/badkan.git
    
We will do everything as root:

    sudo su

Badkan uses python and its websockets library, 
so let's install them first:

    apt install git git-gui python3 python3-pip python3-dev
    pip3 install websockets

Badkan executes the submitted exercises in an isolated environment. This is handled by *docker*
Let's install docker then. On Ubuntu, do:

    apt update
    curl -fsSL https://get.docker.com/ | sh
    systemctl start docker
    systemctl enable docker
    
Optional: check that docker is installed correctly:

    service docker status
    docker run hello-world

Next. pull a docker image from the public docker repository:

    docker pull erelsgl/badkan

This can take a very long time.
Alternatively, you can build the image yourself:

    cd docker
    docker build -t erelsgl/badkan:latest .
    
## Launch

The system has three different parts that should be launched separately 
(in the future there should be a single launch script.

1. Run the docker image (this opens a bash shell inside the docker container):

    sudo docker run --name badkan --rm -i -t erelsgl/badkan bash

2. In a second terminal, run the websockets server for checking and grading submissions. 
Note: it must be run as root since it uses docker. 

    cd backend
    sudo python3 server.py
    
3. In a third terminal, run the http server for submissions (you can choose any port other than 80):

    cd frontend
    python3 -m http.server 80

To check that it is working, point your browser to:

    http://localhost?exercise=00-multiply
    
(if you chose a different port number, put it after the "localhost").

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
