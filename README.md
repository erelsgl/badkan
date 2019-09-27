# badkan
A server for automatic checking and grading of programming assignments.

## Installing the database
Badkan stores its data on a Firebase database.
 
Create a Firebase account if you don't have one.

Create a new Firebase project:

* Open the Firebase console at https://console.firebase.google.com/.
* Click "Add project".
* Add a project name and confirm.

After your project is initialized, add a web app by clicking on "</>".
Copy the script code from the text box, and paste it in the file:

    frontend/util/FirebaseConfig.js

If you want to add the feature "Sign in with GitHub" you need to enable the sign in method.
In firebase go to Authentication, in the "Sign-in method" enable GitHub.

But first you need to provide client ID and Client Secret from github.
To do this, go to https://github.com/settings/developers.
Click on new OAuth App.
Fill all the field and in the field: Authorization callback URL, enter the url that firebase provide.
For more information: https://firebase.google.com/docs/auth/?authuser=0 

Go to Authentication, in the "Sign-in method" enable GitHub.

You also need to initialize the storage database by clicking on it and clicking on the confirmation button.

Enable the admin privilege (for the backup): 

First download the package with:

    pip3 install firebase_admin

Then, you need to add to the project the private key that you download here:
       
    Go to settings -> Service Account -> Generate New private key.

Then put the file in the folder database_exports and change its name to private_key.json.

From the firebase storage, upload manually the badkan_guide.pdf in a bucket named guide.

Then, go to the Database onglet from your firebase project.
Create a database and then start in test mode.

open the terminal in the firebase folder and dl the firebase tools:

    sudo npm install -g firebase-tools a

Then, you need to login with:

    firebase login --no-localhost

Follow the instructions.

To verify if it's worked:

    firebase list

If the current project is not your actual project use:

    firebase use <project_id>

Now need to test if init or deployement.

if deployement:

    firebase deploy -m "Deploying the best new feature ever."

if init:

    firebase init

The system is also using the CLI from google "gsutil"
To initialize it, first, in the terminal enter:

    curl https://sdk.cloud.google.com | bash

Then restart your shell:

    exec -l $SHELL

Finally, initialize the gcloud environment: 

    gcloud init

To check if everything worked fine, you can test the gsutil command with:

    gsutil -m cp -R gs://<bucket_name>.appspot.com .

Add your domain in firebase authentification/sign-in method authorized domain onlget.

Once Firebase is initialized you need to install all the network stuff.


## Installing the server

Clone the repository:

    git clone https://github.com/SamuelBismuth/badkan.git

We will do everything as root:

    sudo su

Badkan uses python and its websockets library,
so let's install them first:

    apt update
    apt install git git-gui python3 python3-pip python3-dev
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
    docker images       # check that you see the badkan image

This can take a very long time since the image is large.
Alternatively, you can build the image yourself:

    cd badkan/docker
    docker build -t erelsgl/badkan:latest .
    docker images       # check that you see the badkan image


If you want to use a process-monitor to run the servers, you can use pm2:

    sudo apt install npm
    sudo npm install -g --no-optional pm2@latest

Please, install zip in the server by running the next command:

    sudo apt install zip

Please, install pandas in the server by running the next command:

    pip3 install pandas

Please, install flask and quart in the server by running the next command:

    sudo pip3 install flask
    sudo pip3 install quart

Since we use contrab for the backup, from the database_exports folder please run:

    crontab crontab-backup

Please, check that in the files crontab-backup, the cd is sending you to the good place.

To receive the email sended by the users, please, create two files in the backend/server/stmp folder:

    nano backend/servers/smtp/address.txt <your address email>
    nano backend/servers/smtp/password.txt <your password>

Please, check that the stmp server correspond to your email.

## Installing the Apache server

## 1 — Installing Apache

Update your local package index:

    sudo apt update

Install the apache2 package:

    sudo apt install apache2

## 2 — Adjusting the Firewall

Check the available ufw application profiles:

    sudo ufw app list

The output must be something like:

    Available applications:
    Apache
    Apache Full
    Apache Secure
    OpenSSH

Then run:

    sudo ufw allow 'Apache'

Verify the change:

    sudo ufw status

The output must be something like:

    Status: active

    To                         Action      From
    --                         ------      ----
    OpenSSH                    ALLOW       Anywhere                  
    Apache                     ALLOW       Anywhere                  
    OpenSSH (v6)               ALLOW       Anywhere (v6)             
    Apache (v6)                ALLOW       Anywhere (v6)

## 3 — Checking your Web Server

Check with the systemd init system to make sure the service is running by typing:

    sudo systemctl status apache2

The output must be something like:

    apache2.service - The Apache HTTP Server
       Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
      Drop-In: /lib/systemd/system/apache2.service.d
               └─apache2-systemd.conf
       Active: active (running) since Tue 2018-04-24 20:14:39 UTC; 9min ago
     Main PID: 2583 (apache2)
        Tasks: 55 (limit: 1153)
       CGroup: /system.slice/apache2.service
               ├─2583 /usr/sbin/apache2 -k start
               ├─2585 /usr/sbin/apache2 -k start
               └─2586 /usr/sbin/apache2 -k start

Access the default Apache landing page to confirm that the software is running properly through your IP address:

      http://your_server_ip

You should see the default page of apache2.

## 4 — Setting Up Virtual Hosts

Make a new virtual host file at /etc/apache2/sites-available/<application_name>.conf:

    sudo nano /etc/apache2/sites-available/<application_name>.conf

Paste in the following configuration block, updated for our new directory and domain name:

    <VirtualHost \*:80>
    ServerAdmin your@email.com
    ServerName <application_name>.com
    ServerAlias www.<application_name>.com
    DocumentRoot <path to the index.html file
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>

Save and close the file when you are finished.

Enable the file with a2ensite:

    sudo a2ensite <application_name>.com.conf

Disable the default site defined in 000-default.conf:

      sudo a2dissite 000-default.conf

Test for configuration errors:

    sudo apache2ctl configtest

You should see the following output:

    Syntax OK

if your trying to install it in local, you need to add in the hosts file the following:

    sudo nano /etc/hosts

Add the next line:

    127.0.0.1       <application_name>.com

Restart Apache to implement your changes:

      sudo systemctl restart apache2

go to http://<application_name>.com

Don't forget to start the backend and docker server too!

If there are issues when trying to sign in/up with github:

Check if the error is :

    The popup has been closed by the user before finalizing the operation. signin with girhub fireabse

Then, go to Firebase in the Authentication -> Sign-in method -> Authorized domain and add your domain.
Also go to GitHub settings -> application -> choose the right application and change the Homepage URL with the new one.

## Installing PERL for the MOSS command

To install the perl package do:

    sudo apt-get install perl

Try your installation by doing:

    /usr/bin/perl -e 'print "Hello, world\n";'

You can check the installation and the version by typing:

    perl -V

You can also check that the perl folder resides at the location "/usr/bin/perl".  
If not, you should change the location of the first line at backend/moss.pl and enter the right location.

Next, you need to execute permission for the file by giving this command on shell:

    chmod ug+x backend/servers/moss/moss.pl

Now Get all the files which you need to check for plagiarism, in a given directory.

Now run the command mentioned below, from the location where your moss file is present.

    ./moss.pl -l c -c "Machine Problem 3 Moss Report_FInal_c" ./directory/*
    -l Option is for language. which is C in the above example. Its cc for C++, java for java and etc.
    -c option s just for name of the report generated
    ./directory/* specifies the location where all the files are present

Once you run this, you would be given a URL, where you could see the report generated.

## Start

The system has three different parts: docker, backend and frontend.

They can all be started for the first time (or after reboot) by:

    cd badkan
    start/1st_time.sh

Verify that a docker container with image "badkan" is running:

    sudo docker container ls

Verify that the back-end is running:

    less backend/nohup.out

Verify that the front-end is running:

    sudo less frontend/nohup.out
    <your-browser> http://localhost:8000

For example:

    lynx http://localhost:8000

(If you installed badkan on a remote server, use its IP address instead of localhost).

You can try to submit the following solution to the sample assignment "multiply":

    https://github.com/ereltest/multiply.git

You should see that the grade is 100%.

To restart the badkan server, you can do:

    start/backend_frontend.sh

In the export.sh file, change the bucket name.

## Logs

The backend logs are at backend/nohup.out

The frontend logs are at frontend/nohup.out


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

## UPDATING THE DOCKER CONTAINER

To enter the running docker container:

    sudo docker attach badkan

To exit back to the host:

    Ctrl+P+Q

To copy files from the host into the container:

    docker cp <local-file> badkan:/<remote-file>

After you change the badkan container, you can push your changes upstream by:

    docker commit <container-id> erelsgl/badkan
    docker push erelsgl/badkan

Then, on another server, you can pull these changes by:

    sudo docker pull erelsgl/badkan:latest
    sudo docker images    # note the old image with the <none> tag
    sudo docker stop badkan
    sudo docker rmi <old-image-id>
    sudo docker run --name badkan --rm -itd erelsgl/badkan bash

To replace an old exercise-grader with a new one:
put the new grader code in the "exercises" folder on the *host*.
The server will automatically copy it to the docker container.

Sometimes, you need to check the open ports using this command:
ps -fA | grep pytho
If needed, kill the port by using both command:
first: sudo killall python3
then: sudo kill 21473

As a developper, sometimes, you want to open the server in localhost without use nohup.  
Thus, open three terminal.  
Here are the command for the terminals:  

	1- cd backend then sudo python3 -u server.py 5670  
	2 - cd frontend then sudo python3 -u -m http.server 8000  
	3 - sudo docker run --name badkan -p 8010:8010 --rm -itd erelsgl/badkan bash  
	Then, optional: sudo docker exec badkan bash -c "cd /www; python3 -u -m http.server 8010"  

Once everything done, open another terminal and here is the command:
<your-browser> http://localhost:<FRONTEND_PORT>

To update when update the readme:
The grade program must output the student grade at its last line in format:  
< *** Right: 2. Wrong: 0. Grade: 100% ***

Note: A trace table (csv format) can be found in the folder backend.  
In this table, there are for each submission the following information:  
time, url, ids, and grade.  

At the end, you need to manually run a script from the server by typing:

    cd backend
    python3 update_courses.py

To update the new change, please from your local computer run:

    bash start/remote_update_frontend.sh 


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

## Clean up

To clean up the data of the whole project:

- Delete the data of the firebase realtime db, storage and authentification from the firebase console.
- Delete all the subfolders of the folder backend/submissions/ (sudo rm -r ./*)


