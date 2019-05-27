class Deadline {

    constructor(date, penalities) {
        this.date = date;
        this.penalities = penalities;
    }

}

/**
     * Return the number of fewer point.
     */
function isPenalized(deadline) {
    var currentTime = new Date();
    var finalDate = new Date(deadline.date);
    currentTime.setHours(0, 0, 0, 0)
    finalDate.setHours(0, 0, 0, 0)
    let sumPoint = 0;
    for (var i = 0; currentTime > finalDate && i < deadline.penalities.length; i++) {
        sumPoint += parseInt(deadline.penalities[i].point)
        finalDate.setDate(finalDate.getDate() + parseInt(deadline.penalities[i].late));
    }
    return sumPoint;
}

function isOpen(deadline) {
    var currentTime = new Date();
    var finalDate = new Date(deadline.date);
    for (var penality in deadline.penalities) {
        finalDate.setDate(finalDate.getDate() + parseInt(deadline.penalities[penality].late));
    }
    currentTime.setHours(0, 0, 0, 0)
    finalDate.setHours(0, 0, 0, 0)
    return (currentTime <= finalDate);
}