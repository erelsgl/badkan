// Here are all the links needed by the header
var links = ["style/header.css", "style/shape.css", "style/loader.css",
    "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css", "https://www.w3schools.com/w3css/4/w3.css"
];
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

// Here are all the script needed by the header
var scripts = ["util/utils.js",
    "util/protocols/httpProtocol.js", "https://cdn.jsdelivr.net/npm/sweetalert2@8", "data/retreiveUser.js"
];
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

// Here is the html code needed in the body.
let divHeader = '<div class="container">' +
    '<input id = "logo" type = "image" src = "logo/logo.png" onclick = "document.location.href=\'home.html\'">' +
    '<div id="pagename">' +
    document.title +
    '</div>' +
    '<div id="contact" onclick="contactUs()"><i class="glyphicon glyphicon-envelope"></i></div>' +
    '<div id="home" onclick="document.location.href=\'home.html\'">Home</div>' +
    '<div class="dropdown">' +
    '<button id=button_profile class="dropbtn"></button>' +
    '<div class="dropdown-content">' +
    '<a href="profile.html" style="text-decoration: none; color: black;"><i class="glyphicon glyphicon-user"></i> Profile</a>' +
    '<a href="#settings" style="text-decoration: none; color: black;"><i class="glyphicon glyphicon-cog"></i> Settings</a>' +
    '<a href="#logout" style="text-decoration: none; color: black;"><i class="glyphicon glyphicon-off"></i> Log Out</a>' +
    '</div>' +
    '</div>' +
    '</div >'
$("#header").append(divHeader);

let devLoader = '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'

$("#loader").append(devLoader);


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
        allowOutsideClick: false,
        title: 'Settings',
        html: '<label for="name">Name: </label>' +
            '<input id="name" class="swal2-input" value=' + userDetails["name"] + '>' + // Retreive here the data.
            '<label for="lastname">Last name: </label>' +
            '<input id="lastname" class="swal2-input" value=' + userDetails["last_name"] + '>' + // Retreive here the data.
            '<label for="user_country_id">Id</label>' +
            '<input id="user_country_id" class="swal2-input" value=' + userDetails["country_id"] + '>' + // Retreive here the data.
            '<a class="btn btn-danger" onclick="deleteConfirmation();">Delete account</a>',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            $("#main").hide()
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

async function contactUs() {
    Swal.fire({
        title: 'Contact us',
        html: '<label for="subject">Subject</label>' +
            '<input id="subject" class="swal2-input">' +
            '<label for="message">Message</label>' +
            '<textarea id="message" class="swal2-input">',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Send!',
        preConfirm: () => {
            const subject = escapeHtml($("#subject").val())
            const message = escapeHtml($("#message").val())
            if (subject == "" || message == "") {
                Swal.showValidationMessage(
                    `Please fill all the required fields.`
                )
            } else {
                json = JSON.stringify({
                    subject: subject,
                    message: reformatText(message)
                })
                doPostJSON(json, "contact_us", "text", () => {})
            }

        }
    })
}

function reformatText(text) {
    return text + "\n\n" + "user id: " + userUid + "\n" +
        "user country id: " + userDetails.country_id + "\n" +
        "user display name: " + userDetails.display_name + "\n" +
        "user instructor: " + userDetails.instructor + "\n" +
        "user name: " + userDetails.name + "\n" +
        "user last_name: " + userDetails.last_name + "\n" +
        "user email: " + userEmail + "\n" 
}