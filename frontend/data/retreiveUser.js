let userUid;
let userDetails;

/**
 * Every time a new page is loaded, we must go over this function to load the user.
 */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userUid = user.uid;
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
    let display_name = data["display_name"].split(" ");
    userDetails["name"] = display_name[0];
    userDetails["last_name"] = display_name[1];
    $("#button_profile").html(userDetails["name"]);
    $('#header').show();
    onLoadMain();
}