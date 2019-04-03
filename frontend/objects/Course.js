/**
 * This object is an Exrcise created by any instructor.
 * 
 * 
 * ADMIN PRIVILEGE OF THE COURSE FOR EACH EXERCISE OF THE COURSE:
 * 
 * - Can get an access to all the submitted folder.
 * - Can run each submitted folder.
 * - Can edit files of the project of any students. 
 * - Can dl the grades
 * - Can run the "moss" command.
 * - Create a table with the input/output of the student.
 */
class Course {

    /**
     * @param {String} name: The name of the course, eg: C++ 
     * @param {List} exercises: A list of all the id of the exercises of the course.
     * The list only contains the id of the exercises. Like a pointer to the table exercises.
     * Can be null (since firebase doesn't allow null, we put a dummy exercises).
     * @param {List} students:  A list of all the id of the students of the course.
     * The list only contains the id of the exercises. Like a pointer to the table exercises.
     * At the beginning student is null (since firebase doesn't allow null, we put a dummy student).
     * @param {String} password: A password of the course if the instructor want the course to be private.
     * Can be null.
     * @param {String} ownerId: This is the firebase ID of the owner of the course.
     */
    constructor(name, exercises, students, password, ownerId) {
        this.name = name;
        this.exercises = exercises;
        this.students = students;
        this.password = password;
        this.ownerId = ownerId;
    }

}


