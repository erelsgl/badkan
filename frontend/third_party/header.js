$('a[href="#settings"]').click(function () {
    var info = settings();
    info.then((prom) => {
        // Handle here the changes.
        console.log(prom)
    });

});

$('a[href="#logout"]').click(function () {
    signOut();
});

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
                document.getElementById('name').value,
                document.getElementById('lastname').value,
                document.getElementById('user_country_id').value
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
            doPostJSONWithoutReturn(JSON.stringify({
                uid: userUid,
            }), "delete_account", signOut)
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