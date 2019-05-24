# Badkan 3.0

## Goals
* Simplify the use of the Badkan for the instructors, in particular for the create exercise process.
* Improve the UX of the platform.

## Comparison to similar system
There is a website of automated checking used by Ariel university at: http://31.154.73.187/cgi-bin/welcome.cgi
It was developed by Pinchas Weisberg. It has some advantages over badkan 2.0:

* Allows to upload exercises by a zip file.
* Allows to submit exercises by a zip file.
* Supports several courses.
* Has a beautiful GUI.

One goal of badkan 3.0 is to combine the advantages of both systems: 

* Badkan is dynamic and gives immediate real-time feedback on each submission through web interface. 
* Badkan allows users to submit entire programming projects through a GitHub URL, or zipped folder;
* Badkan allows instructors to upload and update exercises easily throught GitLab or zipped folder;
* Badkan has a simple registration process, either with email+password or without a password through a github account.
* Badkan should be easy to use for every user (beginner or expert).
* Badkan should have a short tutorial for students and for instructors.

## Main use cases
1. All the use cases of the Badkan 2
1. Making the grading system private or public
1. See the available exercises
1. Help to create exercise
1. Submission via GitHub or via a source folder
1. Create/edit a "course"
1. Peer-to-peer grading

## 1. Making the grading system private or public
Badkan allows instructor to choose if they want to share their grading system. That is, any instructor can take the exercise of another instructor and obtain all the files for the grading system.  

Thus, each instructor can either learn how to write a grading system by using others instructor's grading system, or customize the exercise as he wants to.

## 2. See the available exercises
Each instructor could see all the "public" (see use case 1) exercises of the platform. The search must be efficient: the instructor can as example search only for java exercises or hard exercises.

Each exercise will have some "tags" that will help find similar exercises.
For example: tag by language, tag by level, tag by concept (e.g. "operator overloading") and so on.

## 3. Help to create exercise
If an instructor has no time (or anything else) to program the grading system, but he want to create a particular exercise, Badkan allows the instructor to write a message (from the website) explaining the purpose of the exercise, and a programmer of the team Badkan will implement the grading system for the instructor.

Templates for common exercise types, for example: Java, C++,  ...

## 4. Submission via GitHub or via a source folder
An exercise creator can decide what kind of submissions to allow:
submission via a GitHub link (as in badkan 2.0), submission via a zipped folder (as in Pinchas' system), or both.
When a student solves an exercise, they will see a different UI depending on what kind/s of submissions are allowed. 
The grading process should remain the same in both options.

Also, an exercise creator will be able to upload files via a GitLab link (as in badkan 2.0) or via a zipped folder.

## 5. Create/edit a course
Every user will be able to create a  (buttons "create course" and "edit course" in the admin page).

Each course will contain a list of exercises. 
The course-creator will be able to add existing exercises to the list,
change their order, add notes to each exercise, delete exercises, etc.
 
Each user will be able to register to one or more courses, so that he sees only the relevant exercises.
The "solve exercise" and "records" pages will show the division to courses.
In the grades table, it will be possible to download grades of a single course.

## 6. peer-to-peer grading
(suggested by Gil Ben-Artzi)
Suppose an exercise has two parts: 

* First part - students submit unit-tests (based on a pre-determined interface).
* Second part - students submit the actual solutions.

Badkan can then run each unit-test from the first part, against each solution from the second part.
The second part is graded by how many tests it passed;
The first part is graded by how many buggy solutions it found.

Advantages:

* Instructors do not have to write unitests themselves.
* Students practice writing unitests.
* The exercise becomes a competitive game.

Challenges:

* How to cope with erroneous unitests?

