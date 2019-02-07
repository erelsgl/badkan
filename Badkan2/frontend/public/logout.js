document.getElementById("btnLogOut").addEventListener('click', e=>{
    console.log('logged out')
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(user=>{ 
    console.log("status change");
    if(!user){
      console.log("not user");
      document.location.href = "register.html";
    }
  });