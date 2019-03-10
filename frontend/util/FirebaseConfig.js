alert("Insert your FIrebase details in frontend/util/FirebaseConfig.js")
// Initialize Firebase
var config = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "..."
};
firebase.initializeApp(config);
