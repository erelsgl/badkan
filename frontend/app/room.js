function onLoadMain() {
    flashlight(300)
    $("#main").show()
    Swal.fire({
        title: 'Welcome to the beta version of the exercise ROOM.',
        text: 'Do not hesitate to click',
        showConfirmButton: true,
    })
}

$('#instruction').click(function () {
    Swal.fire({
        title: 'Instructions.',
        text: 'Well done, you found the instructions. You need to multiply a number by two using java programming. You should find a way to submit your answer...',
        showConfirmButton: true,
    })
})

$('#s_image').click(function () {
    $('#s_image').hide()
    addLetter('s')
})

$('#u_image').click(function () {
    $('#u_image').hide()
    addLetter('u')
})

$('#b_image').click(function () {
    $('#b_image').hide()
    addLetter('b')
})

$('#m_image').click(function () {
    $('#m_image').hide()
    addLetter('m')
})

$('#i_image').click(function () {
    $('#i_image').hide()
    addLetter('i')
})

$('#t_image').click(function () {
    $('#t_image').hide()
    addLetter('t')
})

$('#light_switch').click(function () {
    changeFlashlightSize(600)
})

$('#letter').click(function () {
    html = '<form onsubmit="return false"> \
    <div class="container"> \
      <br> \
      <h1><b><span id="exerciseName" class="title_font"></span></b></h1> \
      <br> \
      <div class="white_square_1"> \
        <div class="naccs"> \
          <div class="grid"> \
            <div class="gc gc--2-of-5"> \
              <div class="menu"> \
                <div class="active github"><span class="light"></span><span>GitHub</span></div> \
                <div class="zip"><span class="light"></span><span>Zip</span></div> \
              </div> \
            </div> \
            <div class="gc gc--3-of-5"> \
              <ul class="nacc"> \
                <li class="active github"> \
                  <div> \
                    <label for="githubUrl">Enter the Github URL. <br> Must begin with https and end with \
                      .git</label> \
                    <br> \
                    <input id="githubUrl" type="text" class="form-control" /> \
                  </div> \
                </li> \
                <li class="zip"> \
                  <div> \
                    <label for="zipFile">Upload the zip file.</label> \
                    <br> \
                    <input id="zipFile" type="file" /> \
                  </div> \
            </div> \
            </li> \
            </ul> \
          </div> \
        </div> \
      </div>'
    Swal.fire({
        title: 'Submit.',
        html: html,
        confirmButtonText: 'Submit',
        allowOutsideClick: false,
        showConfirmButton: true,
    }).then(() => {
        submit()
        $('#feedback').show()
        swal.fire({
            title: 'One more step',
            text: 'Where is your feedback?',
            showConfirmButton: true,
        })
    })
})

$('#feedback').click(function () {
    Swal.fire({
        title: 'Feedback.',
        html: $("#output").html(),
        confirmButtonText: 'Confirm & Finish',
        showConfirmButton: true,
        showCancelButton: true,
    }).then((result) => {
        if (result.value) {
            document.location.href = "home.html";
        }
    })
})

function addLetter(letter) {
    $('#' + letter).html(letter)
    if (areWordFound()) {
        $('#letter').show()
    }
}

function areWordFound() {
    if ($('#s').html() == 's' && $('#u').html() == 'u' &&
        $('#b').html() == 'b' && $('#m').html() == 'm' &&
        $('#i').html() == 'i' && $('#t').html() == 't') {
        return true;
    }
    return false;
}

function getAdditionnalInfo() {
    return {
        target: "check_submission",
        // TODO: change here BETA VERSION
        // exercise_id: "-Lp8bjDJ5pq38WBuEprE",  // Local
        exercise_id: "-Lpluf1o3QVZUMtZp6wq",  // Official
        uid: userUid,
        country_id: userDetails.country_id,
        collab1: "",
        collab2: "",
        save_grade: false
    }
}