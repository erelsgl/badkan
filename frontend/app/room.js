flashlight()

function onLoadMain() {
    
}

$('#instruction').click(function () {
    alert("The instruction is: multiply a number by two.")
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

$('#letter').click(function () {
    alert("Here you can submit your solution.")
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