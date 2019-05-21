// First, get the uid of the home user
let uid = JSON.parse(localStorage.getItem("homeUserId"));

// Next get te exercise id.
let exerciseId = getParameterByName("exercise"); // in utils.js

// Then, retreive the data from firebase.
getConflictsByUid(exerciseId, uid);
