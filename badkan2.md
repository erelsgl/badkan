# Badkan 2.0

## Goals
* Enable and encourage students to practice and improve their programming skills in a gamified environment.
* Allow instructors in programming coursese to easily create and grade homework assignments.

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
