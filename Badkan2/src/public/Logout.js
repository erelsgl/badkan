document.getElementById("btnLogOut").addEventListener('click', e=>{
    console.log('logged out')
    firebase.auth().signOut();
    document.location.href = "register.html";
});