let userUid;
let userDetails;

/**
 * Every time a new page is loaded, we must go over this function to load the user.
 */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userUid = user.uid;
        retreiveDataForHomePage();
    } else {
        document.location.href = "index.html"
    };
});

function retreiveDataForHomePage() {
    let json = JSON.stringify({
        target: "get_data_user",
        uid: userUid,
    });
    sendWebsocket(json, () => { }, onFinishRetreiveUser, () => { }, onErrorAlert);
}

function onFinishRetreiveUser(message) {
    userDetails = JSON.parse(message.data.replace(/'/g, "\""))
    let display_name = userDetails["display_name"].split(" ");
    userDetails["name"] = display_name[0];
    userDetails["last_name"] = display_name[1];
    $("#button_profile").html(userDetails["name"]);
}