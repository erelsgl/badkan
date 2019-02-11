/**
 * This class represents a User (every user has the same status, there is no special user).
 */
class User {

  constructor(name, lastName, id, email, createdEx, deletedEx) {
    this.name = name;
    this.lastName = lastName;
    this.id = id;
    this.email = email;
    this.createdEx = createdEx;
    this.deletedEx = deletedEx;
  }
}
