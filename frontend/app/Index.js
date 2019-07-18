/**
 * This js file is linked with the register page.
 */

/**
 * BUTTON SIGNUP.
 * Here we first authenticate the user,
 * then we register the user in the realtime database,
 * then we redirect the user to the home page.
 */
document.getElementById("btnSignUp").addEventListener('click', e => {
    const email = document.getElementById("txtEmailSignIn").value;
    const pass = document.getElementById("txtPasswordSignIn").value;
    const name = document.getElementById("txtName").value;
    const lastName = document.getElementById("txtLastName").value;
    const id = document.getElementById("txtId").value;
    if (checkEmptyFields([email, pass, name, lastName, id])) {
        let checked = document.getElementById("instructor").checked;
        if (!instructorPrivilege(checked)) {
            return;
        }
        let json = JSON.stringify({
            target: "create_auth",
            email: email,
            pass: pass,
            name: name,
            lastName: lastName,
            id: id,
            checked: checked
        });
        sendWebsocket(json, () => {}, onMessageCreateAuth, () => {}, onErrorAlert);
    }
});

/**
 * BUTTON GITHUB.
 * Attention !! Must use an HTTP or HTTPS adress.
 * It can't be on the local server but with a web server.
 * Run configuration:
 * Open a terminal and write:
 * python3 -m http.server
 * Then, in the bowser, write: http://localhost/
 * and go to the html file and we're done.
 */
document.getElementById('github').addEventListener('click', e => {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        /**
         * Two cases here: if the user is new need to register him in the realtime database
         * and then go to home, if the user is old need to go to home.
         */
        if (result.additionalUserInfo.isNewUser) {
            var info = additionalInformation();
            info.then((prom) => {
                checked = prom[1]
                if (!instructorPrivilege(checked)) {
                    return;
                }
                let json = JSON.stringify({
                    target: "create_auth_github",
                    uid: result.user.uid,
                    country_id: prom[0],
                    checked: checked
                });
                sendWebsocket(json, () => {}, onMessageCreateAuth, () => {}, onErrorAlert);
            });
        } else {
            document.location.href = "home.html";
        }
    }).catch(function (error) {
        showSnackbar(error.message);
    });
});


/**
 * BUTTON LOGIN.
 * Here we're checking if the mail and password correspond
 * and send he user to the home page.
 */
document.getElementById("btnLogin").addEventListener('click', e => {
    const email = document.getElementById("txtEmail").value;
    const pass = document.getElementById("txtPassword").value;
    firebase.auth().signInWithEmailAndPassword(email, pass).then(function () {
        document.location.href = "home.html";
    }).catch(error => {
        showSnackbar(error.message);
    })
});


async function additionalInformation() {
    const {
        value: formValues
    } = await Swal.fire({
        title: 'Additional information',
        html: '<label for="user_country_id">Id</label>' +
            '<input id="user_country_id" class="swal2-input">' +
            '<label for="is_instructor">Instructor: </label>' +
            '<input type="checkbox" id="is_instructor" name="is_instructor">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('user_country_id').value,
                document.getElementById('is_instructor').checked
            ]
        }
    })
    if (formValues) {
        return formValues
    }
}


$('a[href="#githubSubmission"]').click(function () {
    Swal.fire({
        title: 'Efficient use of GitHub',
        text: "Badkan allows users to submit both entire programming projects (through github)" +
            " and than just single files. The instructor can choose the submission way."
    });
});


$('a[href="#grade"]').click(function () {
    Swal.fire({
        title: 'Automatic grade',
        text: "To get the grade, the system run the code provided by the student with" +
            " a specific input and compare the output of the student with the expectation" +
            " the instructor provide for the output. If the expectation correspond to the output" +
            " of the student's code, then some point will be give to the student."
    });
});


$('a[href="#instructor"]').click(function () {
    Swal.fire({
        title: 'Save instructor time',
        text: "Badkan provide an easy graphical interface ot let the instructor customize the input/output system."
    });
});


$('a[href="#peer"]').click(function () {
    Swal.fire({
        title: 'Peer grading',
        text: "Another interesting way to grade student is by using peer to peer grading: on" +
            "this process, students grade them-self. Indeed, the first part" +
            "of the process is to let student implement test-cases for the given exercise." +
            "Then, the second part is to let them submit their answer for the exercise." +
            "At this point, the platform is able to grade the test-cases submission and" +
            "also the solution of the exercise."
    });
});


$('a[href="#realtime"]').click(function () {
    Swal.fire({
        title: 'Real time grading',
        text: "The grade is displayed to the student's screen in real time. " +
            "That is, at every submission, the student will be inform of his grade."
    });
});


$('a[href="#other"]').click(function () {
    Swal.fire({
        title: 'More features',
        text: "The instructor is able to upload a pdf, to check plagarism, to download all the grades, " +
            "to run or download a specific project or all the projects..."
    });
});