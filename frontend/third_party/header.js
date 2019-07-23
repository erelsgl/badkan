// Here are all the script needed by the header
var scripts = ["util/firebaseConfig.js", "util/utils.js", "data/retreiveUser.js", "util/notif.js", "util/protocols/httpProtocol.js"];
for (index = 0; index < scripts.length; ++index) {
    var script = document.createElement('script');
    script.src = scripts[index];
    script.type = 'text/javascript';
    var done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
            done = true;
        }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
}

// Here are all the links needed by the header
var links = ["style/header.css", "style/notif.css", "style/shape.css"];
for (index = 0; index < links.length; ++index) {
    var link = document.createElement('link');
    link.href = links[index];
    link.rel = 'stylesheet';
    var done = false;
    link.onload = link.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
            done = true;
        }
    };
    document.getElementsByTagName("head")[0].appendChild(link);
}

// Here is the html code needed in the body.
let div = '<div class="container">' +
    '<input id = "logo" type = "image" src = "logo/logo.png" onclick = "document.location.href=\'home.html\'">' +
    '<div id="pagename">Home Page</div>' +
    '<div id="notif">' +
    '<ul>' +
    '<li id="noti_Container">' +
    '<div id="noti_Counter"></div>' +
    '<div id="noti_Button"></div>' +
    '<div id="notifications">' +
    '<div class="notif">Notifications</div>' +
    '<div id=addNotif></div>' +
    '<div style="height:300px;"></div>' +
    '</div>' +
    '</li>' +
    '</ul>' +
    '</div>' +
    '<div id="home" onclick="document.location.href=\'home.html\'">Home</div>' +

    '<div class="dropdown">' +
    '<button id=button_profile class="dropbtn"></button>' +
    '<div class="dropdown-content">' +
    '<a href="grades.html"><i class="glyphicon glyphicon-user"></i> Profile</a>' +
    '<a href="#settings"><i class="glyphicon glyphicon-cog"></i> Settings</a>' +
    '<a href="#logout"><i class="glyphicon glyphicon-off"></i> Log Out</a>' +
    '</div>' +
    '</div>' +
    '</div >'
$("#header").append(div);

$('a[href="#settings"]').click(function () {
    var info = settings();
    info.then((prom) => {
        let json = JSON.stringify({
            uid: userUid,
            display_name: prom[0] + " " + prom[1],
            country_id: prom[2]
        });
        doPostJSON(json, "edit_user", "text", onEditSuccess)
    });
});

$('a[href="#logout"]').click(function () {
    signOut();
});

function onEditSuccess(data) {
    if (data == "success") {
        location.reload()
    } else {
        showSnackbar(data)
    }
}

async function settings() {
    const {
        value: formValues
    } = await Swal.fire({
        title: 'Settings',
        html: '<label for="name">Name: </label>' +
            '<input id="name" class="swal2-input" value=' + userDetails["name"] + '>' + // Retreive here the data.
            '<label for="lastname">Last name: </label>' +
            '<input id="lastname" class="swal2-input" value=' + userDetails["last_name"] + '>' + // Retreive here the data.
            '<label for="user_country_id">Id</label>' +
            '<input id="user_country_id" class="swal2-input" value=' + userDetails["country_id"] + '>' + // Retreive here the data.
            '<a class="btn btn-danger" onclick="deleteConfirmation();">Delete account</a>',
        focusConfirm: false,
        preConfirm: () => {
            return [
                escapeHtml(document.getElementById('name').value),
                escapeHtml(document.getElementById('lastname').value),
                escapeHtml(document.getElementById('user_country_id').value)
            ]
        }
    })
    if (formValues) {
        return formValues
    }
}

function deleteConfirmation() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            doPostJSON(JSON.stringify({
                uid: userUid,
            }), "delete_account", "text", signOut)
        }
    })
}

function signOut() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.log(error)
        Swal.fire(
            'Error',
            'There was an error in sign out. Please try again. If the problem persists, please contact the programmer.',
            'error'
        )
    });
}