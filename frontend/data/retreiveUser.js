let userUid;
let userDetails;
let userEmail

/**
 * Every time a new page is loaded, we must go over this function to load the user.
 */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userUid = user.uid;
        userEmail = firebase.auth().currentUser.email
        retreiveDataForHeader();
    } else {
        document.location.href = "index.html"
    };

});

function retreiveDataForHeader() {
    doPostJSON(JSON.stringify({
        uid: userUid,
    }), "get_data_user", "json", onFinishRetreiveUser)
}

/**
 * Everytime the header finish to load, we call the function onLoadMain that is duplicate for each app file
 * @param {json} data 
 */
function onFinishRetreiveUser(data) {
    userDetails = data
    if(!data["display_name"]) {
        data["display_name"]= "anonymous anonymous"
    }
    let display_name = data["display_name"].split(" ");
    userDetails["name"] = display_name[0];
    userDetails["last_name"] = display_name[1];
    if (userDetails.instructor == "True") {
        $("#manage_header").show()
    }
    $("#button_profile").html(userDetails["name"]);
    $('#header').show();
    onLoadMain();
}