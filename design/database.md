# Database documentation

Badkan stores all information in a Firebase DB. The objects in the DB are:

## users

* userId - from Firebase Auth;
* user;
    * admin - a boolean that inform is the user has admin privilege or not;
    * created exercise - the number of created exercise/course;
    * deleted exercise - the number of deleted exercise;
    * edited exercise - the number of edited exercise;
    * email - the email of the user;
    * id - the identifying number in Moodle (can be considered as PK);
    * lastName
    * name 
    * notif - an array of the object Notification that includes an action, a message and a boolean read/notRead;
    * submissionIds - an array of ids that link to the "submission" objects related to the user;

## exercises

* exerciseId - the userId plus a serial number;
* exercise;
    * compiler - the compiler in use;
    * deadline
    * desciption - a small description to inform the student about the exercise;
    * exFolder - in case of the exercise is submitted via GitLab: the folder where the exercise resides;
    * example - deprecated: we use it to flag if the exercise contains a PDF or not; (need to change the name);
    * link - in case of the exercise is submitted via GitLab: the link of the repository;
    * name
    * ownerId - the firebase id of the owner of the exercise;
    * submission - object of three boolean fields "GitHub", "GitLab", "Zip";
    * submissionIds - an array of ids that link to the "submission" objects related to the user;

## submissions

* submissionId;
* exerciseId;
* userIds - array of the collabs;
* grade - the automatic grade;
* manualGrade - a number fed by the instructor;
* instructorComments - text fed by the instructor;
...

## peerSubmissions

(Notice that we currently don't allow collab in peer to peer process)
* peerSubmissionId;
* peerExerciseId;
* testGrade - the automatic grade for the test;
* solutionGrade - the automatic grade for the solution;
* finalGrade - the final grade of the student;
* testUrl - the url of the test submission;
* solutionUrl - the url of the solution submission;
...

## courses

* courseId - ownerId_index;
* course;
    * exercises (array of exerciseId);
    * grader - the country array of a grader that get access to the course managment;
    * name
    * ownerId - the firebase id of the owner of the course;
    * students - an array of ids of the student of the course, this array is null in case of the course is pubic;
 

## peerExercises

* peerExercisesId
* peerExercises;
    * compilerSolution - the compiler to compile the solution submission;
    * compilerTest - the compiler to compile the test submission;
    * deadlineConflicts 
    * deadlineSolutions
    * deadlineTests
    * description - like in exercise;
    * minTest - the minimum of test required for the students;
    * name
    * ownerId - like in exercise;
    * peerSubmissionIds - like in exercise but with the object peerSubmission;
    * signatureMap - A map with key: class and value : function signature;
    * submission - like in exercise;

## conflicts

* conflictId
    * exerciseId
        * testerId - can include several testerId;
            * testName - can include several testName;
                * about
                    * content - the whole test;    
                * ids - an array of the firebase id of all the complainant;
