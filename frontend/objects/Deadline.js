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
    let sumPoint = 0;
    for (var i =0; currentTime > finalDate || i < deadline.penalities.length; i++){
        sumPoint += deadline.penalities[i].point
        finalDate = finalDate.addDays(deadline.penalities[i].late);
    }
}

function isOpen(deadline) {
    var currentTime = new Date();
    var finalDate = new Date(deadline.date);
    for (var penality in deadline.penalities) {
        finalDate = finalDate.addDays(deadline.penalities[penality].late);
    }
    return (currentTime < finalDate);
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}