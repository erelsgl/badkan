/**
 * This class represents a User (every user has the same status, there is no special user).
 */
class User {

  /**
   * 
   * @param {string} name 
   * @param {string} lastName 
   * @param {int} id 
   * @param {string} email 
   * @param {int} createdEx  // Also courses.
   * @param {int} deletedEx 
   * @param {int} editedEx 
   * @param {int} exerciseSolved 
   */
  constructor(name, lastName, id, email, createdEx, deletedEx, editedEx, exerciseSolved, myCourses) {
    this.name = name;
    this.lastName = lastName;
    this.id = id;
    this.email = email;
    this.createdEx = createdEx;
    this.deletedEx = deletedEx;
    this.editedEx = editedEx;
    this.exerciseSolved = exerciseSolved;
    this.myCourses = myCourses;
  }
}
