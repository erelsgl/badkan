$('a[href="#settings"]').click(function () {
    var info = settings();
    info.then((prom) => {
        console.log(prom)
    });

});

$('a[href="#logout"]').click(function () {
    firebase.auth().signOut().then(
        () => {
            document.location.href = 'index.html'
        },
        (error) => {
            console.log(error)
            Swal.fire(
                'Error',
                'There was an error in sign out. Please try again. If the problem persists, please contact the programmer.',
                'error'
            )
        });
});

async function settings() {
    const {
        value: formValues
    } = await Swal.fire({
        title: 'Settings',
        html: '<label for="name">Name: </label>' +
            '<input id="name" class="swal2-input" value="Samuel">' + // Retreive here the data.
            '<label for="lastname">Last name: </label>' +
            '<input id="lastname" class="swal2-input" value="Bismuth">' + // Retreive here the data.
            '<label for="user_country_id">Id</label>' +
            '<input id="user_country_id" class="swal2-input" value="342533064">' + // Retreive here the data.
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
        console.log(result)
        if (result.value) {
            sendWebsocket(json, () => {}, onMessageCreateAuth, () => {}, onErrorAlert);            
        }
    })
}