/**
* From there, he can:
* - Run a code of the user.
* - Read and edit any file of any user.
*/

let exerciseId = JSON.parse(localStorage.getItem("selectedValue"));
let exercise = JSON.parse(localStorage.getItem("exercise"));
let userId =  JSON.parse(localStorage.getItem("userId"));
let user =  JSON.parse(localStorage.getItem("user"));

console.log(exerciseId)
console.log(exercise)
console.log(user)
console.log(userId)

$("#student").html(user.name + " " + user.lastName + " " + user.id);

