# Database documentation

Badkan stores all information in a Firebase DB. The objects in the DB are:

## users

* userId - from Firebase Auth;
* name 
* country-ID - the identifying number in Moodle;
* submissionIds - an array of ids that link to the "submission" objects related to the user;

## exercises

* exerciseId - the userId plus a serial number;
* submissionIds - an array of ids that link to the "submission" objects related to the user;
...

## submissions

* submissionId;
* exerciseId;
* userIds - array of the collabs;
* grade - the automatic grade;
* manualGrade - a number fed by the instructor;
* instructorComments - text fed by the instructor;
...


## courses

... 
