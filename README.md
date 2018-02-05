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

Badkan executes the homework assignments in an isolated environment. This is handled by *docker*
Let's install docker then. On Ubuntu, do:

    apt update
    curl -fsSL https://get.docker.com/ | sh
    systemctl start docker
    systemctl enable docker
    
Optional: check that docker is installed correctly:

    docker run hello-world

Next. pull a docker image from the public docker repository:

    docker pull erelsgl/badkan

This can take a very long time.
Alternatively, you can build the image yourself:

    docker build -t erelsgl/badkan:latest .

Now, run the docker image (this opens a bash shell inside the docker container):

    docker run --name badkan --rm -i -t erelsgl/badkan bash

In a second terminal, run the websockets server for checking and grading submissions: 
    
    python3 server.py
    
In a third terminal, run the http server for submissions (you can choose any port other than 80):

    cd frontend
    python3 -m http.server 80 &
    
Optional: check that it is working by pointing your browser to:

    http://localhost
    
(if you chose a different port number, put it after the "localhost").

You can try to submit the following solution to the sample assignment:

    https://github.com/erelsgl/cpp-homework-00.git

You should see that the grade is 100%.

## Adding homework assignments

A homework assignment is contained in a folder.
The name of the folder is the name of the assignment.
The default installation contains a single example assignment:
"00-multiply". 

Inside the folder, there should be an executable program
called "grade". This program is responsible for checking and grading the submissions.
It will be run from inside the user's folder.
 
To copy an assignment folder to docker, do:

    docker cp <assignment-folder> badkan:/

