# badkan
A server for automatic checking and grading of programming assignments.

## Installation

Clone the rep:

    git clone https://github.com/SamuelBismuth/badkan.git

Create a firebase account if you doesn't have one.

Create a new project:

Open the Firebase console at https://console.firebase.google.com/.

Click "Add project".

Add a project name and confirm.

While your project initialized, add an web app.
Copy all the script and paste it in the project at the next place:
frontend-> util -> Firebase.js
You need to replace the old script with the new one.

If you want to add the feature "Sign in with GitHub" you need to enable the sign in method.
But first you need to provide client ID and Client Secret from github.
To do this, go to https://github.com/settings/developers.
Click on new OAuth App.
Fill all the field and in the field: Authorization callback URL, enter the url that firebase provide.
For more information: https://firebase.google.com/docs/auth/?authuser=0 

Go to Authentification, in the "Sign-in method" enable GitHub.

Once firebase is initialized you need to install all the network stuff.
   
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
    <your-browser> http://localhost:<FRONTEND_PORT>?exercise=multiply

For example:

    lynx http://localhost?exercise=multiply

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
2. open the frontend with the exercise code, e.g. http://server?exercise=reverse 
3. submit the clone-url of this repository.

The system then:

4. clones the repository into the docker container;
5. copies all files from the exercise folder into the repository folder;
6. enters the repository folder and runs "grade".

The default installation contains two example exercises:
"multiply" and "reverse". 

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

# Badkan 2.0

## Goals
* Enable and encourage students to practice and improve their programming skills in a gamified environment.
* Allow instructors in programming courses to easily create and grade homework assignments.

## Comparison to similar systems
There are various systems that allow automatic grading of programming exersices, for example, hackerrank.com. Badkan will differ in the following ways:
* Badkan allows users to submit entire programming projects (through github) rather than just single files;
* Badkan's code is released as open-source, to encourage cooperation by other programmers and instructors worldwide.

## Main use cases
1. Sign up/Sign in.
1. Create/edit an exercise.
1. Solve an exercise.
1. Create/edit a "course" (a group of exercises).
1. View user achievements.
1. Create/edit a "class" (a group of users)

## 1. Sign up / sign in
Can be done in two ways:
* Standard: using username+password.
* Using an existing github account.

Users will be able to add to their account their personal details, such as full name and id (for grading purposes).

NOTE: It may be worthwhile to look for existing, off-the-shelf user-management systems.

## 2. Create/edit an exercise
Every user can create exercises - there is no special "instructor" status.

An exercise is owned by the user who created it; only this user can edit/delete the exercise.

Every exercise has:
* Name + description (text/html/markdown).
* Example test-cases, with full solutions.
* Hidden test-cases (used for grading).
* Code+files for compiling+grading a submission.

## 3. Solve an exercise
Every user can solve every available exercise.

To solve an exercise, the user submits a link to a github repository.

The repository is cloned or pulled into a folder on the server.

Then the exercise files are copied into the same folder.

Then, the grading-code of the exercise is executed.

The grade is shown to the students and written in the students' records.

An exercise can be submitted several times; only the last grade is reported.

CHALLENGE: handle several simultaneous submissions.

## 4. Create/edit a course
A "course" is a list of exercises in a related topic. For example: "C++", "algorithms", etc. Every user can create a course and edit the courses he created.

Solving an exercise in a course gives the solver points and badges specific to that course.

## 5. View user achievements
Each user has a public web-page which shows the achievements of that user: how many points and badges he has in each course he took, and what exercises he solved.

## 6. Create/edit a "class"
A "class" is a group of users (usually, a group of students taking a course).
Every user can create a class and edit the classes he created.

It is possible to create CSV reports of the performance of a class in an exercise or in an entire course.

## Development
Badkan is developed in Ariel university, computer science department.
The code is released under the GPL 3 software license.
Contributions are welcome!

## Firebase
Badkan use firebase as database.
The paln is the spark plan, and allow only 100 simultenous connection.
To check the number of current connection:   https://console.firebase.google.com/u/0/project/badkan-9d48d/database/usage/current-billing/connections
To see all the information about the spark plan:  
https://firebase.google.com/pricing/?authuser=0
Notice that at any moment, it's possible to change the plan.